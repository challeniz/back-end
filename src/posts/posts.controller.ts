import { Controller, Get, Post, Body, Param, UseInterceptors, UploadedFile, Request } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { FileInterceptor} from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes, ApiBody, ApiParam, ApiResponse } from '@nestjs/swagger';
import { MyPostResponse } from './dto/mypost-response.dto';

@Controller('posts')
@ApiTags('Posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @ApiOperation({
    summary: "챌린지 인증하기",
    description: "챌린지 인증목록 추가"
  })
  @Post('/upload/:id')
  @ApiParam({ name: 'id', type: 'string' , description: '챌린지 _id',example: '653a6554c8f1516bfb601714'})
  @ApiBearerAuth('access-token')
  @ApiConsumes('multipart/form-data') 
  @ApiBody({ type: CreatePostDto })
  @UseInterceptors(FileInterceptor('file'))
  async create(@Request() req, @UploadedFile() file: Express.Multer.File, @Body() createPostDto : CreatePostDto, @Param('id') id: string) {

    return this.postsService.create(req.user, file, createPostDto, id);
  }

  @ApiOperation({
    summary: "챌린지 인증 목록",
    description: "챌린지의 인증들"
  })
  @ApiParam({ name: 'id', type: 'string' , description: '챌린지 _id',example: '653a6554c8f1516bfb601714'})
  @Get('/challenges/:id')
  @ApiResponse({ status: 200, description: '목록들'})
  async posts(@Param('id') id:string) {
    return this.postsService.getpost(id);
  }   

  @ApiOperation({
    summary: "내 인증 보기",
    description: "내가 한 인증들 보기"
  })
  @ApiBearerAuth('access-token')
  @Get('/my')
  @ApiResponse({ status: 200, description: '챌린지당 인증 목록들' , type: MyPostResponse })
  async myPosts(@Request() req) {
    return this.postsService.mypost(req.user);
  }

}
