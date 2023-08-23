import { forwardRef, MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { UsersService } from './service/users.service';
import { UsersController } from './controller/users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, userSchema } from './schema/user.schema';
import { AuthModule } from 'src/auth/auth.module';
import { RequiredMiddleware } from 'src/middleware/requierd.middleware';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: userSchema}]),
  forwardRef(() => AuthModule), JwtModule.register({
    secret: process.env.JWT_SECRET_KEY,
    signOptions: { expiresIn: '1y' },
  }),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequiredMiddleware).forRoutes({ path: 'users/mypage', method: RequestMethod.GET });
  }

}
