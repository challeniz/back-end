import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsEmail, IsPhoneNumber, IsString } from 'class-validator';
import mongoose, { Document  } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type UserDocument = User & Document;

@Schema({ versionKey: false })
export class User {
    @ApiProperty({
        example: "테스트",
        description: "사용자 이름",
        required: true
    })
    @IsString()
    @Prop({ required: true, trim: true })
    name: string;

    @ApiProperty({
        example: "admin@naver.com",
        description: "사용자 이메일(아이디)",
        required: true
    })
    @IsEmail()
    @Prop({ required: true, trim: true })
    email: string;

    @ApiProperty({
        example: "test123123!!",
        description: "사용자 비밀번호",
        required: true
    })
    @Prop({ required: true, trim: true })
    password: string;

    @ApiProperty({
        example: "01011112222",
        description: "사용자 핸드폰 번호",
        required: true
    })
    @IsPhoneNumber()
    @Prop({ required: true, trim: true })
    phone: string;

    @Prop({ required: true, trim: true, default: '신입챌리니'})
    grade: string;

    @Prop({ required: true, trim: true, default: false })
    authority: boolean;

    @Prop({ required: true, trim: true, default: new Date(), type: mongoose.Schema.Types.Date })
    reg_date: Date;

    @Prop({ required: false, trim: true, default: "/users/--3.png" })
    img: string;

    @Prop({ required: true, trim: true, default: 0})
    verifiCount: number;

    @Prop({ required: false, trim: true })
    refreshToken: string;

    @Prop({ required: false, trim: true })
    refreshTokenDate: Date;
}

export const userSchema = SchemaFactory.createForClass(User);
