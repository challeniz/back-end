import { Injectable, NestMiddleware, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NextFunction } from 'express';
import { NotFoundError } from 'rxjs';
import { UsersService } from 'src/users/service/users.service';

@Injectable()
export class RequiredMiddleware implements NestMiddleware {
    constructor(private readonly jwtService: JwtService, private readonly usersService:UsersService) {}
    
    async use(req: Request, res: Response, next: NextFunction) {

        const token = req.headers["authorization"]?.split(" ")[1] ?? "null";;

        if (token === "null") {
            throw new UnauthorizedException("서비스 요청이 있지만 인증 토큰이 없습니다.");
        }


        try {
            const decoded = this.jwtService.verify(token);

            const user = await this.usersService.findById(decoded.sub);

            if(user) {
                req['user'] = user;
            } else {
                throw new NotFoundException("토큰정보와 일치하는 사용자가 없습니다.");
            }
            
            next();
        } catch (error) {
            throw new UnauthorizedException("정상적인 토큰이 아닙니다. 다시 한 번 확인해 주세요.");
        }
    }
}