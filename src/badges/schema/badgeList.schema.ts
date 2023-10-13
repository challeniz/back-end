import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Badge } from "./badge.schema";
import { User } from "src/users/schema/user.schema";

export type BadgeListDocument = BadgeList & Document;

@Schema({ versionKey: false })
export class BadgeList {

    @Prop({ required: true, trim: true })
    list: Array<Badge>;

    @Prop({ required: true, trim: true, ref: 'User' })
    user: User;

}

export const badgeListSchema = SchemaFactory.createForClass(BadgeList);
