import { Controller, Get, Post, Body, Request, Delete, Patch, UseInterceptors, UploadedFile } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './schema/user.schema';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthService } from 'src/auth/auth.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBody, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { LoginUserResponseDto } from './dto/login-user-response.dto';
import { MypageResponseDto } from './dto/mypage-response.dto';
import { MypageInfoResponseDto } from './dto/mypage-Info-response.dto';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService, private readonly authService: AuthService) {}

  @Post('/signup')
  @ApiOperation({
    summary: "회원 가입",
    description: "새로운 회원의 정보를 DB에 저장"
  })
  @ApiBody({ type: User })
  @ApiResponse({ status: 201, description: '회원가입 완료'})
  async create(@Body() user: User){
    return this.usersService.create(user);
  }
 
  @Post('/check')
  @ApiOperation({
    summary: "이메일 중복 확인",
    description: "이메일 중복이 존재한다면 true, 아니면 false를 리턴"
  })
  @ApiBody({
    schema: {
      properties: {
        email: { example: "admin@naver.com"}
      }
    }
  })
  async doubleCheck(@Body('email') email: string) {
    return this.usersService.doubleCheck(email);
  }

  @Post('/login')
  @ApiOperation({
    summary: "로그인",
    description: "로그인이 성공한다면 access_token과 refresh_token 리턴"
  })
  @ApiBody({ type: LoginUserDto })
  @ApiResponse({ status: 201, description: '로그인 성공', type: LoginUserResponseDto })
  async login(@Body() loginUserDto: LoginUserDto) {
    const tokens = await this.authService.jwtLogin(loginUserDto);
    const result = this.usersService.setRefreshToken(tokens.refresh_token, loginUserDto);

    return tokens;
  }

  @Delete('/withdrawal')
  @ApiOperation({
    summary: "회원 탈퇴",
    description: "DB에서 회원정보 삭제"
  })
  @ApiBearerAuth('access-token')
  async withdrawal(@Request() req) {
    return this.usersService.remove(req.user);
  }

  @ApiOperation({
    summary: "회원 챌린지 조회",
    description: "회원의 생성한 챌린지, 신청한 챌린지, 찜한 챌린지, 완료된 챌린지 조회"
  })
  @Get('/mypageChall')
  @ApiBearerAuth('access-token')
  @ApiResponse({ status: 200, 
    description: 'updateActiveChallenge: 신청한 챌린지, zzimChallenge: 찜한 챌린지, updateCreateChallenge: 생성한 챌린지, finishChallenge: 신청한 챌린지 중 완료된 챌린지',
     type: MypageResponseDto })
  async mypage(@Request() req) {
    
    return this.usersService.mypageChall(req.user);
  }

  @ApiOperation({
    summary: "회원 정보 조회",
    description: "DB에 저장된 회원 정보 불러오기"
  })
  @ApiBearerAuth('access-token')
  @Get('/mypageInfo')
  @ApiResponse({ status: 200, 
    description: '_id: mongoDB에 저장된 _id, name: 이름, phone: 전화번호, email: 이메일, grade: 등급',
     type: MypageInfoResponseDto })
  async mypageInfo(@Request() req) {
    const { _id, name, phone, email, grade } = req.user;
    
    return { _id, name, phone, email, grade };
  }

  @ApiOperation({
    summary: "회원 정보 수정",
    description: "DB에 저장된 회원 정보 수정"
  })
  @ApiBearerAuth('access-token')
  @Patch('/mypageInfo')
  @ApiResponse({ status: 200, 
    description: '_id: mongoDB에 저장된 _id, name: 이름, phone: 전화번호, email: 이메일, grade: 등급',
     type: MypageInfoResponseDto })
  @UseInterceptors(FileInterceptor('file'))
  async mypageInfoUpdate(@Request() req, @Body() updateUserDto: UpdateUserDto, @UploadedFile() file?: Express.Multer.File) {
    
    return this.usersService.updateInfo(req.user, updateUserDto, file);
  }

  @ApiOperation({
    summary: "로그아웃",
    description: "DB에 저장된 회원의 refreshtoken 내용 삭제 및 유효기간 삭제"
  })
  @ApiBearerAuth('access-token')
  @Patch('/logout') 
  async logout(@Request() req) {
    this.usersService.logout(req.user);

    return "로그아웃 완료";
  }

  @ApiOperation({
    summary: "토큰 재발급",
    description: "refreshtoken으로 accesstoken 재발급"
  })
  @ApiBearerAuth('access-token')
  @Patch('/refresh')
  @ApiResponse({ status: 200, description: '재발급 성공', type: LoginUserResponseDto })
  async refresh(@Request() req) {
    return this.authService.refresh(req.refresh_token);
  }  
}
