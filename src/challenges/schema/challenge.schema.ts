import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsEmail, IsPhoneNumber, IsString } from 'class-validator';
import mongoose, { Document  } from 'mongoose';
import { Post } from 'src/posts/schema/post.schema';
import { User } from 'src/users/schema/user.schema';
import { Image } from './image.schema';

export type ChallengeDocument = Challenge & Document;

@Schema({ versionKey: false })
export class Challenge {
    @IsString()
    @Prop({ required: true, trim: true })
    title: string;

    @IsString()
    @Prop({ required: false, trim: true })
    description: string;

    @IsString()
    @Prop({ required: false, trim: true })
    mainImg: string;

    @Prop({ required: false, trim: true })
    start_date: Date;

    @Prop({ required: false, trim: true })
    end_date: Date;

    @IsString()
    @Prop({ required: true, trim: true, default: '모집 중'})
    status: string;

    @Prop({ required: false, trim: true })
    tag: Array<String>;

    // 개설한 사람
    @Prop({type:mongoose.Schema.Types.ObjectId, ref: 'User', required: true, trim: true })
    user: User;

    @IsString()
    @Prop({ required: true, trim: true })
    category: string;

    // 신청한 사람들
    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], required: false })
    users: Array<User>[];

    // 찜한 사람들
    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], required: false })
    like_users: Array<User>[];

    // 모집 기간
    @Prop({ required: false, trim: true })
    recru_open_date: Date;

    @Prop({ required: false, trim: true })
    recru_end_date: Date;

    // 인증 리스트
    @Prop({ required: false, trim: true })
    post: Array<mongoose.Schema.Types.ObjectId>[];
}

export const challengeSchema = SchemaFactory.createForClass(Challenge);

