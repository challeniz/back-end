import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Review, ReviewDocument } from './schema/review.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChallengesService } from 'src/challenges/challenges.service';

@Injectable()
export class ReviewService {
  constructor(@InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
  @Inject(forwardRef(() => ChallengesService)) private readonly challengeService: ChallengesService) {}
  

  async createReview(user: any, id: string, createReviewdto: CreateReviewDto) {
    let createdReview = await new this.reviewModel(createReviewdto);
    createdReview.user = user;

    await createdReview.save();

    return await this.challengeService.createReview(id, createdReview);
  }

  findAll() {
    return `This action returns all review`;
  }

  findOne(id: number) {
    return `This action returns a #${id} review`;
  }

  update(id: number, updateReviewDto: UpdateReviewDto) {
    return `This action updates a #${id} review`;
  }

  remove(id: number) {
    return `This action removes a #${id} review`;
  }
}
