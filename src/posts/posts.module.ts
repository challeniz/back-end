import { forwardRef, MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { Post, postSchema } from './schema/post.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { RequiredMiddleware } from 'src/middleware/requierd.middleware';
import { UsersModule } from 'src/users/users.module';
import { ChallengesModule } from 'src/challenges/challenges.module';
import { MulterPostConfig } from 'src/middleware/multer.post.config';

@Module({
  imports: [MongooseModule.forFeature([{ name: Post.name, schema: postSchema },]),
   forwardRef(()=> UsersModule), forwardRef(()=> ChallengesModule), MulterModule.registerAsync({ useClass: MulterPostConfig })],
  controllers: [PostsController],
  providers: [PostsService],
  exports: [PostsService]
})

export class PostsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequiredMiddleware).forRoutes({ path: 'posts/upload/:id', method: RequestMethod.POST }, 
    { path: 'posts', method: RequestMethod.GET }
    );
  }
}
