import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose'

export type BlogSchemaDocument = HydratedDocument<Blog>;

@Schema({ timestamps: true, collection: 'blogs' })

export class Blog {

  @Prop({ required: true })
  type: number;    // 0: blog,  1: news

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  image: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'blogs', required: false })
  parentId: string;

}

export const BlogSchema = SchemaFactory.createForClass(Blog);