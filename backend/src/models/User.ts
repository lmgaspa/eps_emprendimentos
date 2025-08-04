import mongoose, { Document, Schema } from 'mongoose';

export interface UserDocument extends Document {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'funcionário';
}

const UserSchema = new Schema<UserDocument>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['admin', 'funcionário'],
    default: 'funcionário'
  }
});

export default mongoose.model<UserDocument>('User', UserSchema);
