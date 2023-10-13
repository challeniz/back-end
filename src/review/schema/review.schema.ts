import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsString } from 'class-validator';
import mongoose, { Document  } from 'mongoose';
import { User } from 'src/users/schema/user.schema';

export type ReviewDocument = Review & Document;

@Schema({ versionKey: false })
export class Review {
    @IsString()
    @Prop({ required: true, trim: true })
    content: string;

    // 작성한 사람
    @Prop({type:mongoose.Schema.Types.ObjectId, ref: 'User', required: true, trim: true })
    user: User;

    @Prop({ required: true, trim: true })
    star: number;

    @Prop({ default: Date.now })
    create_date: Date;
}

export const reviewSchema = SchemaFactory.createForClass(Review);

