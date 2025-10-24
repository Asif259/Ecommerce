import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admin, AdminDocument } from '../admin/admin.schema';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Admin.name) private adminModel: Model<AdminDocument>,
    private jwtService: JwtService,
  ) {}

  validateAdmin(token: string): { isLoggedIn: boolean; user?: any } {
    if (!token) {
      throw new UnauthorizedException('Token not provided');
    }

    try {
      const decodedToken = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
      return { isLoggedIn: true, user: decodedToken };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  async validateAdminWithDetails(
    token: string,
  ): Promise<{ isLoggedIn: boolean; user?: any }> {
    if (!token) {
      throw new UnauthorizedException('Token not provided');
    }

    try {
      const decodedToken = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });

      // Fetch full user details from database
      const admin = await this.adminModel
        .findById(decodedToken.id)
        .select('-passwordHash')
        .exec();

      if (!admin) {
        throw new UnauthorizedException('Admin not found');
      }

      return {
        isLoggedIn: true,
        user: {
          userId: (admin as any)._id.toString(),
          email: admin.email,
          role: admin.role,
          createdAt: (admin as any).createdAt,
          updatedAt: (admin as any).updatedAt,
          lastLogin: admin.lastLogin,
        },
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
  async login(
    email: string,
    password: string,
  ): Promise<{ access_token: string }> {
    const user = await this.adminModel.findOne({
      email,
    });

    if (!user) {
      throw new UnauthorizedException('User with this email does not exist.');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    // Update last login time
    await this.adminModel.updateOne(
      { _id: user._id },
      { $set: { lastLogin: new Date() } },
    );

    const payload = { id: user.id, email: user.email };
    return {
      access_token: await this.jwtService.signAsync(payload, {
        expiresIn: '24h',
      }),
    };
  }

  async userCount(): Promise<number> {
    return await this.adminModel.countDocuments();
  }

  async changePassword(
    email: string,
    password: string,
    newPassword: string,
  ): Promise<void> {
    console.log('Change password request:', {
      email,
      passwordLength: password.length,
    });

    const user = await this.adminModel.findOne({ email });
    console.log(
      'Found user:',
      user ? { id: user._id, email: user.email } : 'No user found',
    );

    if (!user) {
      throw new UnauthorizedException('User with this email does not exist.');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    console.log('Password validation result:', isPasswordValid);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials.');
    }
    user.passwordHash = await bcrypt.hash(newPassword, 10);
    await user.save();
    console.log('Password changed successfully for user:', user.email);
  }
}
