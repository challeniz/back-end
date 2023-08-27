import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsEmail, IsPhoneNumber, IsString } from 'class-validator';
import mongoose, { Document  } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ versionKey: false })
export class User {
    @IsString()
    @Prop({ required: true, trim: true })
    name: string;

    @IsEmail()
    @Prop({ required: true, trim: true })
    email: string;

    @Prop({ required: true, trim: true })
    password: string;

    @IsPhoneNumber()
    @Prop({ required: true, trim: true })
    phone: string;

    @Prop({ required: true, trim: true, default: '신입챌리니즈'})
    grade: string;

    @Prop({ required: true, trim: true, default: false })
    authority: boolean;

    @Prop({ required: true, trim: true, default: new Date(), type: mongoose.Schema.Types.Date })
    reg_date: Date;

}

export const userSchema = SchemaFactory.createForClass(User);