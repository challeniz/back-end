import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsString } from 'class-validator';
import mongoose, { Document  } from 'mongoose';
import { User } from 'src/users/schema/user.schema';
import { Review } from '../../review/schema/review.schema';
import { ApiProperty } from '@nestjs/swagger';

export type ChallengeDocument = Challenge & Document;

@Schema({ versionKey: false })
export class Challenge {

    @ApiProperty({
        example: "책읽기",
        description: "챌린지 이름",
        required: true
    })
    @IsString()
    @Prop({ required: true, trim: true })
    title: string;

    @ApiProperty({
        example: "[책 표지 또는 읽기 시작한 페이지]와 [마지막으로 읽은 페이지] 찍기 (총2장)",
        description: "챌린지 설명",
        required: true
    })
    @IsString()
    @Prop({ required: false, trim: true })
    description: string;

    @ApiProperty({
        example: "/challenge/book_1698325844656.jpeg",
        description: "챌린지 이미지 경로",
        required: true
    })
    @IsString()
    @Prop({ required: false, trim: true })
    mainImg: string;

    @ApiProperty({
        example: "2023-11-06T14:59:59.999+00:00",
        description: "챌린지 시작 날짜",
        required: true
    })
    @Prop({ required: false, trim: true })
    start_date: Date;

    @ApiProperty({
        example: "2024-01-01T14:59:59.999+00:00",
        description: "챌린지 종료 날짜",
        required: true
    })
    @Prop({ required: false, trim: true })
    end_date: Date;

    @ApiProperty({
        example: "모집 중",
        description: "챌린지 상태",
        required: true
    })
    @IsString()
    @Prop({ required: true, trim: true, default: '모집 중'})
    status: string;

    @ApiProperty({
        example: "[#디지털디톡스, #취미]",
        description: "챌린지 태그들",
        required: true
    })
    @Prop({ required: false, trim: true })
    tag: Array<string>;

    @ApiProperty({
        example: "65367dec32fe88147237be3d",
        description: "개설한 사람의 mongoDB에 저장된 _id",
        required: true
    })
    @Prop({type:mongoose.Schema.Types.ObjectId, ref: 'User', required: true, trim: true })
    user: User;

    @ApiProperty({
        example: "취미",
        description: "챌린지 카테고리",
        required: true
    })
    @IsString()
    @Prop({ required: true, trim: true })
    category: string;

    @ApiProperty({
        example: "[]",
        description: "이 챌린지에 신청한 사람들의 mongoDB에 저장된 _id들",
        required: true
    })
    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], required: false })
    users: Array<User>[];

    @ApiProperty({
        example: "[]",
        description: "이 챌린지를 찜한 사람들의 mongoDB에 저장된 _id들",
        required: true
    })
    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], required: false })
    like_users: Array<User>[];

    @ApiProperty({
        example: "2023-10-29T15:00:00.000+00:00",
        description: "챌린지 모집 시작 날짜",
        required: true
    })
    @Prop({ required: false, trim: true })
    recru_open_date: Date;

    @ApiProperty({
        example: "2023-11-05T14:59:59.999+00:00",
        description: "챌린지 모집 종료 날짜",
        required: true
    })
    @Prop({ required: false, trim: true })
    recru_end_date: Date;

    @ApiProperty({
        example: "[653a6e98c8f1516bfb601c37]",
        description: "챌린지 인증 목록 ",
        required: true
    })
    @Prop({ required: false, trim: true })
    post: Array<mongoose.Schema.Types.ObjectId>[];

    @ApiProperty({
        example: "2023-10-26T13:16:04.080+00:00",
        description: "챌린지 생성 날짜",
        required: true
    })
    @Prop({ default: Date.now })
    create_date: Date;

    @ApiProperty({
        example: "653a7183c8f1516bfb601dba",
        description: "챌린지 후기 목록",
        required: true
    })
    @Prop({ required: false })
    review: Array<Review>[];
}

export const challengeSchema = SchemaFactory.createForClass(Challenge);

