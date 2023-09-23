import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsNumber, IsString } from "class-validator";

export type BadgeDocument = Badge & Document;

@Schema({ versionKey: false })
export class Badge {
    constructor(name: string, count: number, obtain:boolean, img: string) {
        this.name = name;
        this.count = count;
        this.obtain = obtain;
        this.img = img;
    }

    @IsString()
    @Prop({ required: true, trim: true })
    name: string;

    @IsNumber()
    @Prop({ required: true, trim: true, default: 0 })
    count: number;

    @IsString()
    @Prop({ required: true, trim: true, default: false })
    obtain: boolean;

    @IsString()
    @Prop({ required: true, trim: true })
    img: string;
}

export const badgeSchema = SchemaFactory.createForClass(Badge);
