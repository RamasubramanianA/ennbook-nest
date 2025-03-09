import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Article } from './article.schema';

type LeanHeading = {
  _id: Types.ObjectId;
  subHeadings?: Types.ObjectId[];
};

@Schema({ timestamps: true, collection: 'Headings' })
export class Heading extends Document {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop()
  objective: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Heading' }] })
  subHeadings: Types.ObjectId[];

  @Prop({ type: Types.ObjectId, ref: 'Article' })
  article: Types.ObjectId;

  @Prop()
  createdBy: string;

  @Prop()
  modifiedBy: string;
}

export const HeadingSchema = SchemaFactory.createForClass(Heading);

// Add validation to prevent circular references
HeadingSchema.pre('save', async function(next) {
  try {
    const visited = new Set<string>();
    const checkCircular = async (headingId: Types.ObjectId) => {
      const headingIdStr = headingId.toString();
      if (visited.has(headingIdStr)) {
        throw new Error('Circular reference detected in subHeadings');
      }
      visited.add(headingIdStr);
      
      const heading = await this.model('Heading').findById(headingId).lean() as LeanHeading;
      
      if (heading?.subHeadings?.length) {
        for (const subHeadingId of heading.subHeadings) {
          await checkCircular(subHeadingId);
        }
      }
    };

    if (this.subHeadings?.length) {
      for (const subHeadingId of this.subHeadings) {
        await checkCircular(subHeadingId);
      }
    }
    next();
  } catch (error) {
    next(error);
  }
}); 