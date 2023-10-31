import { Controller, Get, Post, Body, Request, UseInterceptors, UploadedFile } from '@nestjs/common';
import { BadgesService } from './badges.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@Controller('badges')
@ApiTags('Badges')
export class BadgesController {
  constructor(private readonly badgesService: BadgesService) {}

  @Post('')
  @ApiOperation({
    summary: "뱃지 추가 - 사용 X",
    description: "DB에 새로운 뱃지 추가"
  })
  @UseInterceptors(FileInterceptor('file'))
  async create(@Request() req, @Body() body, @UploadedFile() file: Express.Multer.File) {
    const name = body.name;

    return this.badgesService.create(req.user, name, file);
  }

  @ApiOperation({
    summary: "회원 뱃지 리스트 만들기 - 사용 X",
    description: "사용 X"
  })
  @Post('/ddddddddd')
  async createBadgeList(@Request() req) {
    return this.badgesService.createBadgeList(req.user);
  }

  @ApiOperation({
    summary: "회원 뱃지 리스트 조회 - 사용 X",
    description: "사용 X"
  })
  @Get('')
  async getBadgeList(@Request() req) {
    return this.badgesService.getBadgeList(req.user);
  }

}
