import { Controller, Get, Post, Body, Patch, Param, Delete, Request } from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

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

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto) {
    return this.reviewService.update(+id, updateReviewDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reviewService.remove(+id);
  }
}
