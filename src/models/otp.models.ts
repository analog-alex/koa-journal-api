import { Schema, Document } from 'mongoose';
import { mongoose } from '../app/db';

export interface IOtp extends Document {
  otp: string;
  createdAt: Date;
}

const otpSchema: Schema = new Schema({
  otp: { type: String, required: true, unique: false },
  createdAt: { type: Date, required: true, unique: false },
});

export default mongoose.model<IOtp>('Otp', otpSchema);
