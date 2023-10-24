import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsString } from "class-validator";
import mongoose from "mongoose";
import { User } from "src/users/schema/user.schema";

export type PostDocument = Post & Document;

@Schema({ versionKey: false })
export class Post {
    @IsString()
    @Prop({ required: true, trim: true })
    img: string;

    @IsString()
    @Prop({ required: true, trim: true })
    description: string;

    @Prop({ required: true, trim: true, type: mongoose.Schema.Types.Date })
    post_date: Date;

    @Prop({ required: true })
    user: User;
}

export const postSchema = SchemaFactory.createForClass(Post);
