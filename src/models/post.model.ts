import { Schema, Document } from 'mongoose';
import { mongoose } from '../app/db';

export interface IBlogPost extends Document {

  author: string;
  title: string;
  createdAt: Date;
  lastModifiedAt: Date;
  lines: number;
  readTime: number;
  text: string;
  tags: string[];
  timestamp: number;
}

const blogPostSchema: Schema = new Schema({

  author: { type: String, required: true, unique: false },
  title: { type: String, required: true, unique: false },
  createdAt: { type: Date, required: true, unique: false },
  lastModifiedAt: { type: Date, required: false, unique: false },
  lines: { type: Number, required: true, unique: false },
  readTime: { type: Number, required: true, unique: false },
  text: { type: String, required: true, unique: false },
  tags: { type: [String], required: false, unique: false },
  timestamp: { type: Number, required: true, unique: true },
});

export default mongoose.model<IBlogPost>('BlogPost', blogPostSchema);
