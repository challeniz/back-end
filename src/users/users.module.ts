import { forwardRef, MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, userSchema } from './schema/user.schema';
import { AuthModule } from 'src/auth/auth.module';
import { RequiredMiddleware } from 'src/middleware/requierd.middleware';
import { JwtModule } from '@nestjs/jwt';
import { ChallengesModule } from 'src/challenges/challenges.module';
import { BadgesModule } from 'src/badges/badges.module';
import { PostsModule } from 'src/posts/posts.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: userSchema}]),
  forwardRef(() => AuthModule), JwtModule.register({
    secret: process.env.JWT_SECRET_KEY,
    signOptions: { expiresIn: '1y' },
  }), forwardRef(() => ChallengesModule), forwardRef(() => BadgesModule,), forwardRef(() => PostsModule),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequiredMiddleware).forRoutes({ path: 'users/mypageInfo', method: RequestMethod.GET },
    { path: 'users/mypageChall', method: RequestMethod.GET }, { path: 'users/withdrawal', method: RequestMethod.DELETE },
    { path: 'users/mypageInfo', method: RequestMethod.PATCH });
  }

}
