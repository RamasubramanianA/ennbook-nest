import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { TabType } from '../enums/article.enum';

@Schema()
export class Content {
  @Prop({ required: true })
  text: string;
}

@Schema({ timestamps: true, collection: 'Articles' })
export class Article extends Document {
  @Prop({ type: Content, required: true })
  contents: Content;

  @Prop({ type: String, enum: Object.values(TabType) })
  tab: TabType;
}

export const ArticleSchema = SchemaFactory.createForClass(Article); 