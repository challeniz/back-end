import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsString } from "class-validator";
import mongoose from "mongoose";
import { Challenge } from "src/challenges/schema/challenge.schema";
import { Image } from "src/challenges/schema/image.schema";
import { User } from "src/users/schema/user.schema";

export type PostDocument = Post & Document;

@Schema({ versionKey: false })
export class Post {
    @IsString()
    @Prop({ required: true, trim: true })
    Img: Image;

    @IsString()
    @Prop({ required: true, trim: true })
    description: string;

    @Prop({ required: true, trim: true, default: new Date(), type: mongoose.Schema.Types.Date })
    post_date: Date;

    @Prop({ required: true })
    user: User;
}

export const postSchema = SchemaFactory.createForClass(Post);
