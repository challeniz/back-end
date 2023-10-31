import { ApiProperty } from '@nestjs/swagger';
import { ObjectId } from 'mongoose';

export class MypageInfoResponseDto {

    @ApiProperty({
        example: "64e8990b32d5e957d9faa2f7",
        description: "회원 mongoDB _id",
        required: true
    })
    _id: ObjectId;

    @ApiProperty({
        example: "관리자",
        description: "회원 이름",
        required: true
    })
    name: string;

    @ApiProperty({
        example: "12345678911",
        description: "회원 핸드폰 번호",
        required: true
    })
    phone: string;

    @ApiProperty({
        example: "admin@admin.com",
        description: "회원 이메일",
        required: true
    })
    email: string;

    @ApiProperty({
        example: "주니어챌리니",
        description: "회원 등급",
        required: true
    })
    grade: string;
}