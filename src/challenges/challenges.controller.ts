import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseInterceptors, UploadedFile, Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ChallengesService } from './challenges.service';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { UpdateChallengeDto } from './dto/update-challenge.dto';

@Controller('challenges')
export class ChallengesController {
  constructor(private readonly challengesService: ChallengesService) {}

  // 챌린지 생성
  @Post('/create')
  @UseInterceptors(FileInterceptor('file'))
  async create(@Request() req, @Body() createChallengeDto: CreateChallengeDto, @UploadedFile() file: Express.Multer.File) {

    return this.challengesService.create(req.user, createChallengeDto, file);
  }

  // 챌린지 목록 - 메인페이지
  @Get('')
  async findMain() {

    return this.challengesService.findAll();
  }

  // 챌린지 목록
  @Get('/list') 
  async findAll() {
    return this.challengesService.findList();
  }

  // 챌린지 상세
  @Get('/:id')
  async findOne(@Param('id') id: string) {
    return this.challengesService.findOne(id);
  }

  // 챌린지 수정
  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  async update(@Request() req, @Param('id') id: string, @Body() updateChallengeDto: UpdateChallengeDto, @UploadedFile() file?: Express.Multer.File) {
    return this.challengesService.update(req.user, id, updateChallengeDto, file);
  }

  // 챌린지 삭제 + 기간 확인
  @Delete(':id')
  async remove(@Request() req, @Param('id') id: string) {

    return this.challengesService.remove(req.user, id);
  }

  // 챌린지 신청할 때 정보 가져오기
  @Get('/subscription/:id')
  async getsub(@Request() req, @Param('id') id: string) {

   return this.challengesService.getsub(req.user, id);
  }
  
  // 챌린지 신청
  @Patch('/subscription/:id')
  async subscription(@Request() req, @Param('id') id: string) {

    return this.challengesService.subscription(req.user, id);
  }

  // 찜하기
  @Patch('/zzim/:id')
  async zzim(@Request() req, @Param('id') id: string) {
      return this.challengesService.zzim(req.user, id);
  }

  // 챌린지 탈퇴
  @Patch('/cancel/:id')
  async cancel(@Request() req, @Param('id') id: string) {
    return this.challengesService.cancel(req.user, id);
  }

  // 챌린지 포스트목록
  @Get('/posts/:id')
  async posts(@Param('id') id:string) {
    return this.challengesService.getpost(id);
  }

  // 챌린지 검색
  @Get('/list/search')
  async searchC(@Query('title') title: string) {

    return this.challengesService.searchChallenge(title);
  }

  @Get('/aaaaa/eeee')
  async aa() {

    return this.challengesService.updateChallengeState();
  }
}