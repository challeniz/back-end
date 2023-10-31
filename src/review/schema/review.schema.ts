import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsString } from 'class-validator';
import mongoose, { Document  } from 'mongoose';
import { User } from 'src/users/schema/user.schema';
import { ApiProperty } from '@nestjs/swagger';

export type ReviewDocument = Review & Document;

@Schema({ versionKey: false })
export class Review {

    @ApiProperty({
        example: "환경을 지키는데 노력을 정말 많이 해야할꺼같아요~",
        description: "리뷰 내용",
        required: true
    })
    @IsString()
    @Prop({ required: true, trim: true })
    content: string;

    @ApiProperty({
        example: "653a7183c8f1516bfb601dba",
        description: "작성자 ObjectId",
        required: true
    })
    @Prop({type:mongoose.Schema.Types.ObjectId, ref: 'User', required: true, trim: true })
    user: User;

    @ApiProperty({
        example: "4",
        description: "리뷰 별점",
        required: true
    })
    @Prop({ required: true, trim: true })
    star: number;

    @ApiProperty({
        example: "2023-10-26T14:02:43.907+00:00",
        description: "리뷰 쓴 날짜",
        required: true
    })
    @Prop({ default: Date.now })
    create_date: Date;
}

export const reviewSchema = SchemaFactory.createForClass(Review);

