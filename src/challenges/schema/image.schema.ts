import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsString } from 'class-validator';
import { Document  } from 'mongoose';

export type ImageDocument = Image & Document;

@Schema({ versionKey: false })
export class Image {
    @Prop({ required: true, trim: true })
    data: Buffer;

    @IsString()
    @Prop({ required: true, trim: true })
    contentType: string;
}

export const imageSchema = SchemaFactory.createForClass(Image);

