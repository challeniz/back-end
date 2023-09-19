import { MiddlewareConsumer, Module, NestModule, RequestMethod, forwardRef } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Review, reviewSchema } from './schema/review.schema';
import { RequiredMiddleware } from 'src/middleware/requierd.middleware';
import { ChallengesModule } from 'src/challenges/challenges.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Review.name, schema: reviewSchema }, ]),
  forwardRef(()=> ChallengesModule), forwardRef(()=> UsersModule)],
  controllers: [ReviewController],
  providers: [ReviewService],
})
export class ReviewModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequiredMiddleware).forRoutes({ path: 'review', method: RequestMethod.POST }, 
    );
  }
}
