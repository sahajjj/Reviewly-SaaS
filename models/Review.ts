import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {
  code: string;
  language: string;
  response: {
    bugs: Array<{ title: string; explanation: string; severity: string; fix: string }>;
    improvements: Array<{ title: string; explanation: string; severity: string; fix: string }>;
    security: Array<{ title: string; explanation: string; severity: string; fix: string }>;
    complexity: Array<{ title: string; explanation: string; severity: string }>;
  };
  userId?: mongoose.Types.ObjectId;
  createdAt: Date;
}

const ReviewSchema: Schema = new Schema({
  code: { type: String, required: true },
  language: { type: String, required: true },
  response: { type: Object, required: true },
  userId: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema);
