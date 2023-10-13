import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseInterceptors, UploadedFile } from '@nestjs/common';
import { BadgesService } from './badges.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('badges')
export class BadgesController {
  constructor(private readonly badgesService: BadgesService) {}

  @Post('')
  @UseInterceptors(FileInterceptor('file'))
  async create(@Request() req, @Body() body, @UploadedFile() file: Express.Multer.File) {
    const name = body.name;

    return this.badgesService.create(req.user, name, file);
  }

  @Post('/ddddddddd')
  async createBadgeList(@Request() req) {
    return this.badgesService.createBadgeList(req.user);
  }

  @Get('')
  async getBadgeList(@Request() req) {
    return this.badgesService.getBadgeList(req.user);
  }

}
