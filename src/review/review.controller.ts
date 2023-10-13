import { Controller, Get, Post, Body, Param, Delete, Request } from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  // 후기 쓰기
  @Post('')
  async createReview(@Request() req, @Body() createReviewdto: CreateReviewDto ) {
    return this.reviewService.createReview(req.user, createReviewdto);
  }

  // 특정 챌린지 전체 리뷰보기
  @Get(':id')
  async getReview(@Param('id') id: string) {
    return this.reviewService.getReview(id);
  }

  @Delete('/:id')
  remove(@Request() req, @Param('id') id:string, @Body() body) {
    return this.reviewService.remove(req.user, id, body.reviewId);
  }
}
