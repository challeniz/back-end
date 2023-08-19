import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
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
  @Get('/check')
  async doubleCheck(@Body('email') email: string) {
    return this.usersService.doubleCheck(email);
  }

  // 로그인
  @Post('/login')
  async login(@Body() loginUserDto: LoginUserDto) {

    return this.authService.jwtLogin(loginUserDto);
  }

  
  @Get('/mypage')
  async findOne(@Param('id') id: ObjectId) {
    
  }
  

  @Patch(':id')
  async update(@Param('id') id: ObjectId) {
    return this.usersService.update(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: ObjectId) {
    return this.usersService.remove(id);
  }
}
