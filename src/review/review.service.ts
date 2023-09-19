import { Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
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
  

  async createReview(user: any, createReviewdto: CreateReviewDto) {

    let createdReview = await new this.reviewModel(createReviewdto);
    createdReview.user = user;

    await createdReview.save();

    return await this.challengeService.createReview( createReviewdto.challengeId, createdReview);
  }


  async getReview(id: string) {
    let challenge = await this.challengeService.findById(id);

    if(!challenge) {
      throw new NotFoundException("찾는 챌린지가 존재하지 않습니다. 다시 확인해 주세요.");
    }

    const reviews = [];

    for(let i = 0; i<challenge.review.length; i++) {
      reviews.push(await this.reviewModel.findOne({ _id: challenge.review[i]}));
    }

    return reviews;
  }

  update(id: number, updateReviewDto: UpdateReviewDto) {
    return `This action updates a #${id} review`;
  }

  remove(id: number) {
    return `This action removes a #${id} review`;
  }
}
