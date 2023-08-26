import { Controller, Get, Post, Body, Patch, Param, Delete, Request } from '@nestjs/common';
import { ChallengesService } from './challenges.service';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { UpdateChallengeDto } from './dto/update-challenge.dto';

@Controller('challenges')
export class ChallengesController {
  constructor(private readonly challengesService: ChallengesService) {}

  // 챌린지 생성
  @Post('/create')
  async create(@Request() req, @Body() createChallengeDto: CreateChallengeDto) {
    return this.challengesService.create(req.user, createChallengeDto);
  }

  // 챌린지 목록
  @Get('')
  async findAll() {
    return this.challengesService.findAll();
  }

  // 챌린지 상세
  @Get('/:id')
  async findOne(@Param('id') id: string) {
    return this.challengesService.findOne(id);
  }

  // 챌린지 수정
  @Patch(':id')
  async update(@Request() req, @Param('id') id: string, @Body() updateChallengeDto: UpdateChallengeDto) {
    return this.challengesService.update(req.user, id, updateChallengeDto);
  }

  // 챌린지 삭제 + 기간 확인
  @Delete(':id')
  async remove(@Param('id') id: string) {

    return this.challengesService.remove(id);
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

}