import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review, ReviewDocument } from './review.schema';
import {
  CreateReviewDto,
  UpdateReviewDto,
  ReviewQueryDto,
} from './dto/review.dto';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
  ) {}

  async create(createReviewDto: CreateReviewDto): Promise<Review> {
    const review = new this.reviewModel(createReviewDto);
    return review.save();
  }

  async findAll(query: ReviewQueryDto = {}): Promise<{
    reviews: Review[];
    total: number;
  }> {
    const { isActive, isFeatured, limit = 10, skip = 0 } = query;

    const filter: any = {};

    if (isActive !== undefined) {
      filter.isActive = isActive;
    }

    if (isFeatured !== undefined) {
      filter.isFeatured = isFeatured;
    }

    const reviews = await this.reviewModel
      .find(filter)
      .sort({ displayOrder: 1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();

    const total = await this.reviewModel.countDocuments(filter);

    return { reviews, total };
  }

  async findOne(id: string): Promise<Review> {
    const review = await this.reviewModel.findById(id).exec();
    if (!review) {
      throw new NotFoundException('Review not found');
    }
    return review;
  }

  async update(id: string, updateReviewDto: UpdateReviewDto): Promise<Review> {
    const review = await this.reviewModel
      .findByIdAndUpdate(id, updateReviewDto, { new: true })
      .exec();

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    return review;
  }

  async remove(id: string): Promise<void> {
    const result = await this.reviewModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Review not found');
    }
  }

  async getFeaturedReviews(limit: number = 3): Promise<Review[]> {
    return this.reviewModel
      .find({ isActive: true, isFeatured: true })
      .sort({ displayOrder: 1, createdAt: -1 })
      .limit(limit)
      .exec();
  }

  async getActiveReviews(limit: number = 10): Promise<Review[]> {
    return this.reviewModel
      .find({ isActive: true })
      .sort({ displayOrder: 1, createdAt: -1 })
      .limit(limit)
      .exec();
  }

  async toggleActive(id: string): Promise<Review> {
    const review = await this.findOne(id);
    return this.update(id, { isActive: !review.isActive });
  }

  async toggleFeatured(id: string): Promise<Review> {
    const review = await this.findOne(id);
    return this.update(id, { isFeatured: !review.isFeatured });
  }
}
