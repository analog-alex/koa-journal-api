import { Schema, Document } from 'mongoose';
import { mongoose } from '../app/db';

/* ==== inner class for comments list ==== */
export class Comment {

  public order: number;
  public author: string;
  public createdAt: Date;
  public text: string;
  public timestamp: number;
}
// --------

export interface ICommentsList extends Document {

  blogPostId: string;
  comments: Comment[];
}

const commentsSchema: Schema = new Schema({

  blogPostId: { type: String, required: true, unique: true },
  comments: { type: [Object], required: false, unique: false },
});

export default mongoose.model<ICommentsList>('CommentsList', commentsSchema);
