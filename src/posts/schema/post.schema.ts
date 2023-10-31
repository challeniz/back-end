import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsString } from "class-validator";
import mongoose from "mongoose";
import { User } from "src/users/schema/user.schema";
import { ApiProperty } from '@nestjs/swagger';

export type PostDocument = Post & Document;

@Schema({ versionKey: false })
export class Post {

    @ApiProperty({
        example: "/posts/book_1698325844656.jpeg",
        description: "인증 이미지 경로",
        required: true
    })
    @IsString()
    @Prop({ required: true, trim: true })
    img: string;

    @ApiProperty({
        example: "인증인증인증내용",
        description: "인증 내용",
        required: true
    })
    @IsString()
    @Prop({ required: true, trim: true })
    description: string;

    @ApiProperty({
        example: "2023-09-01T20:53:17.526Z",
        description: "인증한 날짜",
        required: true
    })
    @Prop({ required: true, trim: true, type: mongoose.Schema.Types.Date })
    post_date: Date;

    @ApiProperty({
        description: "인증한 사람",
        required: true,
        type: User
    })
    @Prop({ required: true })
    user: User;
}

export const postSchema = SchemaFactory.createForClass(Post);
