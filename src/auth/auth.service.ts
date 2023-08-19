import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from 'src/users/dto/login-user.dto';
import { UsersService } from 'src/users/service/users.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
      ) {}
    
      async jwtLogin(loginUserDto: LoginUserDto) {
        const { email, password } = loginUserDto;
        const user = await this.usersService.findByEmail(email);
        if (!user) {
          throw new UnauthorizedException('이메일과 비밀번호를 확인해주세요.');
        }

        const isPasswordValidated: boolean = await bcrypt.compare(password, user.password);
        if (!isPasswordValidated) {
          throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
        }

        const id = user.id;
        const authority = user.authority;

        const secretKey = process.env.JWT_SECRET_KEY;
        return { token: this.jwtService.sign({ id, authority }) };
      }
}
