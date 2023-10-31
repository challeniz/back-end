import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseInterceptors, UploadedFile, Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ChallengesService } from './challenges.service';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { UpdateChallengeDto } from './dto/update-challenge.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiConsumes, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { Challenge } from './schema/challenge.schema';
import { findMainResponseDto } from './dto/find-main-response.dto';

@Controller('challenges')
@ApiTags('Challenges')
export class ChallengesController {
  constructor(private readonly challengesService: ChallengesService) {}

  @Post('/create')
  @ApiOperation({
    summary: "챌린지 생성",
    description: "새로운 챌린지의 정보를 DB에 저장"
  })
  @ApiBearerAuth('access-token')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiBody({ type: CreateChallengeDto })
  @ApiResponse({ status: 201, description: '챌린지 생성 완료', type: Challenge})
  async create(@Request() req, @Body() createChallengeDto: CreateChallengeDto, @UploadedFile() file: Express.Multer.File) {

    return this.challengesService.create(req.user, createChallengeDto, file);
  }

  @ApiOperation({
    summary: "챌린지 목록 - 메인페이지",
    description: "ongoingChallenge: 진행중인 챌린지, orderByUsersChallenge: 모집 인원이 많은 순서대로 챌린지, orderByDateChallenge: 최근 만들어진 챌린지"
  })
  @Get('')
  @ApiResponse({ status: 200, description: '챌린지 조회', type: findMainResponseDto})
  async findMain() {

    return this.challengesService.findAll();
  }

  @ApiOperation({
    summary: "챌린지 목록",
    description: "챌린지 둘러보기의 API"
  })
  @Get('/list') 
  @ApiResponse({ status: 200, description: '챌린지 조회', type: [Challenge]})
  async findAll() {
    return this.challengesService.findList();
  }

  @ApiOperation({
    summary: "챌린지 상세 조회",
    description: "챌린지 상세"
  })
  @ApiParam({ name: 'id', type: 'string' , example: '653a6554c8f1516bfb601714'})
  @ApiResponse({ status: 200, description: '챌린지 상세 조회', type: Challenge})
  @Get('/:id')
  async findOne(@Param('id') id: string) {
    return this.challengesService.findOne(id);
  }

  @ApiOperation({
    summary: "챌린지 수정",
    description: "챌린지 수정"
  })
  @Patch(':id')
  @ApiParam({ name: 'id', type: 'string' , example: '653a6554c8f1516bfb601714'})
  @UseInterceptors(FileInterceptor('file'))
  @ApiBearerAuth('access-token')
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateChallengeDto })
  @ApiResponse({ status: 200, description: '챌린지 수정이 성공하면 수정된 챌린지 반환', type: Challenge})
  async update(@Request() req, @Param('id') id: string, @Body() updateChallengeDto: UpdateChallengeDto, @UploadedFile() file?: Express.Multer.File) {
    return this.challengesService.update(req.user, id, updateChallengeDto, file);
  }

  @ApiOperation({
    summary: "챌린지 삭제",
    description: "챌린지 삭제할때 기간과 생성자 확인"
  })
  @ApiBearerAuth('access-token')
  @ApiParam({ name: 'id', type: 'string' , example: '653a6554c8f1516bfb601714'})
  @ApiResponse({ status: 200, description: '삭제가 성공하면 챌린지 삭제완료 반환' })
  @Delete(':id')
  async remove(@Request() req, @Param('id') id: string) {

    return this.challengesService.remove(req.user, id);
  }

  @ApiOperation({
    summary: "챌린지 신청 정보 가져오기",
    description: "챌린지 신청할 때 신청자 정보 가져오기"
  })
  @ApiBearerAuth('access-token')
  @ApiParam({ name: 'id', type: 'string', description: '챌린지의 _id', example: '653a6554c8f1516bfb601714'})
  @ApiResponse({ status: 200, schema: {
    properties: {
      challenge: { type: 'Challenge' },
      name: { type: 'string', example: '테스트' },
      phone: { type: 'string', example: '000-1111-2222' },
      email: { type: 'string', example: 'admin@naver.com' }
    }
  } })
  @Get('/subscription/:id')
  async getsub(@Request() req, @Param('id') id: string) {

   return this.challengesService.getsub(req.user, id);
  }
  
  @ApiOperation({
    summary: "챌린지 신청",
    description: "챌린지 신청"
  })
  @ApiBearerAuth('access-token')
  @ApiParam({ name: 'id', type: 'string' , description: '챌린지의 _id', example: '653a6554c8f1516bfb601714'})
  @Patch('/subscription/:id')
  async subscription(@Request() req, @Param('id') id: string) {

    return this.challengesService.subscription(req.user, id);
  }

  @ApiOperation({
    summary: "챌린지 찜하기",
    description: "챌린지 찜한 사람 목록에 추가"
  })
  @ApiBearerAuth('access-token')
  @ApiParam({ name: 'id', type: 'string' , description: '챌린지의 _id', example: '653a6554c8f1516bfb601714'})
  @Patch('/zzim/:id')
  @ApiResponse({ status: 200, description: '찜이 안되어있으면 찜 완료가 리턴, 찜이 되어있으면 찜 취소가 리턴' })
  async zzim(@Request() req, @Param('id') id: string) {
      return this.challengesService.zzim(req.user, id);
  }

  @ApiOperation({
    summary: "챌린지 탈퇴",
    description: "챌린지 신청 목록에서 삭제"
  })
  @ApiBearerAuth('access-token')
  @ApiParam({ name: 'id', type: 'string' , description: '챌린지의 _id', example: '653a6554c8f1516bfb601714'})
  @Patch('/cancel/:id')
  @ApiResponse({ status: 200, description: '성공하면 챌린지 신청 취소 완료가 리턴, 챌린지가 시작되고 탈퇴를 호출하면 예외 발생' })
  async cancel(@Request() req, @Param('id') id: string) {
    return this.challengesService.cancel(req.user, id);
  }

  @ApiOperation({
    summary: "챌린지 인증 목록 조회",
    description: "챌린지 인증 목록 조회"
  })
  @ApiParam({ name: 'id', type: 'string' , description: '챌린지의 _id', example: '653a6554c8f1516bfb601714'})
  @Get('/posts/:id')
  @ApiResponse({ status: 200, type: Challenge })
  async posts(@Param('id') id:string) {
    return this.challengesService.getpost(id);
  }

  @ApiOperation({
    summary: "챌린지 검색",
    description: "쿼리를 받아 해당되는 챌린지들 리턴"
  })
  @ApiQuery({ name: 'title', required: true, description: '검색할 단어' })
  @Get('/list/search')
  @ApiResponse({ status: 200, type: [Challenge] })
  async searchC(@Query('title') title: string) {

    return this.challengesService.searchChallenge(title);
  }
}