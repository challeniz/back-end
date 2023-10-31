import { Controller, Get, Post, Body, Param, Delete, Request, Patch } from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiBody, ApiResponse, ApiParam } from '@nestjs/swagger';
import { Challenge } from 'src/challenges/schema/challenge.schema';
import { ReviewResponse } from './dto/review-response.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Review } from './schema/review.schema';

@Controller('review')
@ApiTags('Reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @ApiOperation({
    summary: "후기 쓰기",
    description: "챌린지 인증목록 추가"
  })
  @Post('')
  @ApiBearerAuth('access-token')
  @ApiBody({ type: CreateReviewDto })
  @ApiResponse({ status: 200, description: '리뷰쓰기가 성공하면 challenge 리턴', type: Challenge})
  async createReview(@Request() req, @Body() createReviewdto: CreateReviewDto ) {
    return this.reviewService.createReview(req.user, createReviewdto);
  }

  @ApiOperation({
    summary: "챌린지 리뷰 목록",
    description: "특정 챌린지 리뷰 목록"
  })
  @Get(':id')
  @ApiParam({ name: 'id', type: 'string' , example: '653a6694c8f1516bfb6017e6', description: "챌린지의 _id"})
  @ApiResponse({ status: 200, description: '특정 챌린지의 리뷰들과 그 작성자 리턴', type: ReviewResponse})
  async getReview(@Param('id') id: string) {
    return this.reviewService.getReview(id);
  }

  @ApiOperation({
    summary: "챌린지 리뷰 수정",
    description: "특정 챌린지 리뷰 수정"
  })
  @Patch(':id')
  @ApiParam({ name: 'id', type: 'string' , example: '653a6694c8f1516bfb6017e6', description: "챌린지의 _id"})
  @ApiResponse({ status: 200, description: '수정된 리뷰 리턴', type: Review})
  async update(@Request() req, @Param('id') id:string, @Body() updateReviewDto:UpdateReviewDto) {
    return this.reviewService.update(req.user, id, updateReviewDto);
  }

  @ApiOperation({
    summary: "챌린지 리뷰 삭제",
    description: "특정 챌린지 리뷰 삭제"
  })
  @Delete('/:id')
  @ApiBearerAuth('access-token')
  @ApiParam({ name: 'id', type: 'string' , example: '653a6694c8f1516bfb6017e6', description: "챌린지의 _id"})
  async remove(@Request() req, @Param('id') id:string, @Body() body) {
    return this.reviewService.remove(req.user, id, body.reviewId);
  }
}
