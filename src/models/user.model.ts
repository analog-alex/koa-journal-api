import { Schema, Document } from 'mongoose';
import { mongoose } from '../app/db';

export interface IUser extends Document {

  username: string;
  password: string;
  createdAt: Date;
  modifiedAt: Date;
  roles: string[];
  organization: string;
  profileText: string;
  country: string;
}

const userSchema: Schema = new Schema({

  username: { type: String, required: true, unique: true },
  password: { type: String, required: true, unique: false },
  createdAt: { type: Date, required: true, unique: false },
  modifiedAt: { type: Date, required: false, unique: false },
  roles: { type: [String], required: false, unique: false },
  organization: { type: String, required: false, unique: false },
  profileText: { type: String, required: false, unique: false },
  country: { type: String, required: false, unique: false },
});

export default mongoose.model<IUser>('User', userSchema);
