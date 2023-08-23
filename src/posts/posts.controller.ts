import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Request } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post('/upload')
  @UseInterceptors(FilesInterceptor('file'))
  async create(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
    return file;
  }

  @Get()
  async findAll(@Request() req) {
    return this.postsService.findAll();
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.postsService.findOne(+id);
  }


}
