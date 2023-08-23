import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsString } from "class-validator";
import { Challenge } from "src/challenges/schema/challenge.schema";
import { User } from "src/users/schema/user.schema";

export type PostDocument = Post & Document;

@Schema({ versionKey: false })
export class Post {
    @IsString()
    @Prop({ required: true, trim: true })
    Img: string;

    @IsString()
    @Prop({ required: true, trim: true })
    description: string;

    @Prop({ required: true, trim: true })
    post_date: Date;

    @Prop({ required: true, trim: true })
    user: User;

    @Prop({ required: true, trim: true })
    challenge: Challenge;
}

export const postSchema = SchemaFactory.createForClass(Post);
