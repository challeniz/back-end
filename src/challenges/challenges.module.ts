import { forwardRef, MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ChallengesService } from './challenges.service';
import { ChallengesController } from './challenges.controller';
import { Challenge, challengeSchema } from './schema/challenge.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { RequiredMiddleware } from 'src/middleware/requierd.middleware';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Challenge.name, schema: challengeSchema }]),
  forwardRef(() => UsersModule)
],
  
  controllers: [ChallengesController],
  providers: [ChallengesService],
  exports: [ChallengesService]
})
export class ChallengesModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequiredMiddleware).forRoutes({ path: 'challenges/create', method: RequestMethod.POST }, 
    { path: 'challenges/subscription/:id', method: RequestMethod.PATCH }, { path: 'challenges/subscription/:id', method: RequestMethod.GET },
    { path: 'challenges/:id', method: RequestMethod.PATCH }, { path: 'challenges/zzim/:id', method: RequestMethod.PATCH }
    );
  }
}