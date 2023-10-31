import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
    @ApiProperty({
        example: "admin@admin.com",
        description: "사용자 이메일",
        required: true
    })
    email: string;

    @ApiProperty({
        example: "test123123!!",
        description: "사용자 비밀번호",
        required: true
    })
    password: string;
}