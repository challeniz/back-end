import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { Post, postSchema } from './schema/post.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [MongooseModule.forFeature([{ name: Post.name, schema: postSchema }])],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
