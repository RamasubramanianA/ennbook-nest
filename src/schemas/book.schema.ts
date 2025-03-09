import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Chapter } from './chapter.schema';

@Schema({ timestamps: true })
export class Book extends Document {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop()
  objective: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Chapter' }] })
  chapters: Types.ObjectId[];

  @Prop()
  createdBy: string;

  @Prop()
  modifiedBy: string;
}

export const BookSchema = SchemaFactory.createForClass(Book); 