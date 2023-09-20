import { Inject, Injectable, NotFoundException, UnauthorizedException, forwardRef } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { Review, ReviewDocument } from './schema/review.schema';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { ChallengesService } from 'src/challenges/challenges.service';
import { UsersService } from 'src/users/users.service';
import { ObjectId } from 'typeorm';

@Injectable()
export class ReviewService {
  constructor(@InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
  @Inject(forwardRef(() => ChallengesService)) private readonly challengeService: ChallengesService,
  @Inject(forwardRef(() => UsersService)) private readonly usersService: UsersService) {}
  

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
      let review: any = await this.reviewModel.findOne({ _id: challenge.review[i]});
      const user = await this.usersService.findById(review.user);
      const name = user.name;
      review = { review, name }; 
      reviews.push(review);
    }

    return reviews;
  }

  async remove(user: any, id: string, reviewId: string) {
    const review = await this.reviewModel.findById(reviewId);
    
    if(!user._id.equals(review.user)) {
      throw new UnauthorizedException("리뷰 작성자만 삭제할 수 있습니다.");
    }
    
    await this.reviewModel.deleteOne({ _id: reviewId });

    return this.challengeService.removeReview(id, reviewId);
    
  }
}
