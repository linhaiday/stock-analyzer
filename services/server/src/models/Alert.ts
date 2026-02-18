import mongoose, { Schema, Document } from 'mongoose';

export interface IAlert extends Document {
  userId: string;
  symbol: string;
  name: string;
  type: 'price' | 'percent' | 'volume';
  condition: 'above' | 'below';
  targetValue: number;
  isActive: boolean;
  isTriggered: boolean;
  triggerTime?: Date;
  createTime: Date;
  notifyMethod: 'app' | 'email' | 'sms';
}

const AlertSchema: Schema = new Schema({
  userId: { type: String, required: true, index: true },
  symbol: { type: String, required: true, index: true },
  name: { type: String, required: true },
  type: { type: String, enum: ['price', 'percent', 'volume'], required: true },
  condition: { type: String, enum: ['above', 'below'], required: true },
  targetValue: { type: Number, required: true },
  isActive: { type: Boolean, default: true },
  isTriggered: { type: Boolean, default: false },
  triggerTime: { type: Date },
  createTime: { type: Date, default: Date.now },
  notifyMethod: { type: String, enum: ['app', 'email', 'sms'], default: 'app' },
});

export default mongoose.model<IAlert>('Alert', AlertSchema);
