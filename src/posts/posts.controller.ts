import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Request } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { FileInterceptor} from '@nestjs/platform-express';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  // 인증하기
  @Post('/upload/:id')  // challenge의 id
  @UseInterceptors(FileInterceptor('file'))
  async create(@Request() req, @UploadedFile() file: Express.Multer.File, @Body() createPostDto : CreatePostDto, @Param('id') id: string) {

    return this.postsService.create(req.user, file, createPostDto, id);
  }

  @Get('/challenges/:id')
  async posts(@Param('id') id:string) {
    return this.postsService.getpost(id);
  }   

  // 내 인증 보기
  @Get('/my')
  async myPosts(@Request() req) {
    return this.postsService.mypost(req.user);
  }

}
