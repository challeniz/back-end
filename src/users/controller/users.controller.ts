import { Controller, Get, Post, Body, Param, Request, Delete } from '@nestjs/common';
import { UsersService } from '../service/users.service';
import { User } from '../schema/user.schema';
import { ObjectId } from 'mongoose';
import { LoginUserDto } from '../dto/login-user.dto';
import { AuthService } from 'src/auth/auth.service';

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
  @Delete('/withdrawal/:id')
  async withdrawal(@Param('id') id: ObjectId) {
    // param이 아니라 token에서 가져와야하나..
    return this.usersService.remove(id);
  }

  // 
  @Get('/mypageChall')
  async mypage(@Request() req) {
    
    return this.usersService.mypageChall(req.user);
  }

  @Get('/mypageInfo')
  async mypageInfo(@Request() req) {
    
    return req.user;
  }
  
}
