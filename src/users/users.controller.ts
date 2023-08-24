import { Controller, Get, Post, Body, Param, Request, Delete, Patch } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './schema/user.schema';
import { ObjectId } from 'mongoose';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthService } from 'src/auth/auth.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService, private readonly authService: AuthService) {}

  // 회원 가입
  @Post('/signup')
  async create(@Body() user: User){
    return this.usersService.create(user);
  }

  // 이메일 중복 확인
  @Post('/check')
  async doubleCheck(@Body('email') email: string) {
    return this.usersService.doubleCheck(email);
  }

  // 로그인
  @Post('/login')
  async login(@Body() loginUserDto: LoginUserDto) {

    return this.authService.jwtLogin(loginUserDto);
  }

  // 회원 탈퇴
  @Delete('/withdrawal')
  async withdrawal(@Request() req) {
    return this.usersService.remove(req.user);
  }

  // 회원 챌린지 조회
  @Get('/mypageChall')
  async mypage(@Request() req) {
    
    return this.usersService.mypageChall(req.user);
  }

  // 회원 정보 조회
  @Get('/mypageInfo')
  async mypageInfo(@Request() req) {
    const { name, phone, email } = req.user;
    
    return { name, phone, email };
  }

  // 회원 정보 수정
  @Patch('/mypageInfo')
  async mypageInfoUpdate(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    
    return this.usersService.updateInfo(req.user, updateUserDto);
  }
  
}
