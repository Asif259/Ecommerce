import {
  Controller,
  Post,
  Body,
  Res,
  Get,
  UseGuards,
  HttpStatus,
  Req,
} from '@nestjs/common';
import type { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Public } from './auth.decorators';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(dto.email, dto.password);

    // Set access token in HTTP-only cookie
    res.cookie('access_token', result.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax', // Changed from 'strict' to 'lax' for cross-origin
      domain: 'localhost', // Set domain to localhost for cross-port access
      maxAge: 3600000, // 1 hour in milliseconds
    });

    return { message: 'Login successful' };
  }

  @Public()
  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    // Clear the access token cookie
    res.cookie('access_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      domain: 'localhost',
      maxAge: 0, // Expire immediately
    });

    return { message: 'Logout successful' };
  }

  @Get('verify')
  validateToken(@Req() req: Request, @Res() res: Response) {
    const token = (req as any).cookies?.access_token;
    if (!token) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: 'Token not found' });
    }
    try {
      const result = this.authService.validateAdmin(token);
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: error.message });
    }
  }
}
