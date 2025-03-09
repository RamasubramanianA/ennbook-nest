import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Heading } from './heading.schema';

@Schema({ timestamps: true })
export class Chapter extends Document {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop()
  objective: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Heading' }] })
  headings: Types.ObjectId[];

  @Prop([String])
  summary: string[];

  @Prop()
  createdBy: string;

  @Prop()
  modifiedBy: string;
}

export const ChapterSchema = SchemaFactory.createForClass(Chapter); 