import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Badge } from "./badge.schema";
import { User } from "src/users/schema/user.schema";
import mongoose from "mongoose";

export type BadgeListDocument = BadgeList & Document;

@Schema({ versionKey: false })
export class BadgeList {

    @Prop({ required: true, trim: true })
    list: Array<Badge>;

    @Prop({type:mongoose.Schema.Types.ObjectId, ref: 'User', required: true, trim: true })
    user: User;

}

export const badgeListSchema = SchemaFactory.createForClass(BadgeList);
