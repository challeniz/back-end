import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from 'src/users/dto/login-user.dto';
import { UsersService } from 'src/users/users.service';

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

        const payload = { sub: user.id, authority: user.authority };

        return { access_token: await this.jwtService.signAsync(payload),
          refresh_token: await this.jwtService.signAsync({ sub: payload.sub }, { secret: process.env.JWT_REFRESH_KEY}) };
      }

      async refresh(refresh_token: string) {
        const decodedRefresh = this.jwtService.verify(refresh_token, { secret: process.env.JWT_REFRESH_KEY});

        const userId = decodedRefresh.sub;
        const user = await this.usersService.userRefreshTokenMatch(refresh_token, userId);

        if(!user) {
          throw new BadRequestException("해당하는 유저가 없습니다. 토큰을 다시 확인해 주세요.");
        }

        const payload = { sub: user.id, authority: user.authority };

        return { access_token: await this.jwtService.signAsync(payload) };
      }
}
