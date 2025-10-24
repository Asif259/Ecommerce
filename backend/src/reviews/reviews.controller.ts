import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import {
  CreateReviewDto,
  UpdateReviewDto,
  ReviewQueryDto,
} from './dto/review.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Public } from 'src/auth/auth.decorators';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  // Public endpoints for frontend
  @Public()
  @Get('featured')
  async getFeaturedReviews(@Query('limit') limit?: number) {
    const reviews = await this.reviewsService.getFeaturedReviews(limit);
    return {
      success: true,
      data: reviews,
    };
  }

  @Public()
  @Get('active')
  async getActiveReviews(@Query('limit') limit?: number) {
    const reviews = await this.reviewsService.getActiveReviews(limit);
    return {
      success: true,
      data: reviews,
    };
  }

  // Admin endpoints
  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createReviewDto: CreateReviewDto) {
    const review = await this.reviewsService.create(createReviewDto);
    return {
      success: true,
      message: 'Review created successfully',
      data: review,
    };
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@Query() query: ReviewQueryDto) {
    const result = await this.reviewsService.findAll(query);
    return {
      success: true,
      data: result.reviews,
      total: result.total,
      limit: query.limit || 10,
      skip: query.skip || 0,
    };
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string) {
    const review = await this.reviewsService.findOne(id);
    return {
      success: true,
      data: review,
    };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateReviewDto: UpdateReviewDto,
  ) {
    const review = await this.reviewsService.update(id, updateReviewDto);
    return {
      success: true,
      message: 'Review updated successfully',
      data: review,
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.reviewsService.remove(id);
    return {
      success: true,
      message: 'Review deleted successfully',
    };
  }

  @Patch(':id/toggle-active')
  @UseGuards(JwtAuthGuard)
  async toggleActive(@Param('id') id: string) {
    const review = await this.reviewsService.toggleActive(id);
    return {
      success: true,
      message: `Review ${review.isActive ? 'activated' : 'deactivated'} successfully`,
      data: review,
    };
  }

  @Patch(':id/toggle-featured')
  @UseGuards(JwtAuthGuard)
  async toggleFeatured(@Param('id') id: string) {
    const review = await this.reviewsService.toggleFeatured(id);
    return {
      success: true,
      message: `Review ${review.isFeatured ? 'featured' : 'unfeatured'} successfully`,
      data: review,
    };
  }
}
