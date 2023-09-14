import { Controller, Get, Post, Body, Patch, Param, Delete, Request } from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  // 후기 쓰기
  @Post('/:id')
  async createReview(@Request() req, @Param('id') id: string, @Body() createReviewdto: CreateReviewDto ) {
    return this.reviewService.createReview(req.user, id, createReviewdto);
  }

  // 내가 쓴 리뷰?
  @Get()
  findAll() {
    return this.reviewService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reviewService.findOne(+id);
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
