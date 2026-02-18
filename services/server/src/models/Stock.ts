import mongoose, { Schema, Document } from 'mongoose';

export interface IStock extends Document {
  symbol: string;
  name: string;
  category: 'A股' | '港股' | '美股' | '期货' | '指数';
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  turnover: number;
  high: number;
  low: number;
  open: number;
  close: number;
  prevClose: number;
  pe: number;
  pb: number;
  marketCap: number;
  updatedAt: Date;
}

const StockSchema: Schema = new Schema({
  symbol: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  category: { type: String, enum: ['A股', '港股', '美股', '期货', '指数'], required: true },
  price: { type: Number, default: 0 },
  change: { type: Number, default: 0 },
  changePercent: { type: Number, default: 0 },
  volume: { type: Number, default: 0 },
  turnover: { type: Number, default: 0 },
  high: { type: Number, default: 0 },
  low: { type: Number, default: 0 },
  open: { type: Number, default: 0 },
  close: { type: Number, default: 0 },
  prevClose: { type: Number, default: 0 },
  pe: { type: Number, default: 0 },
  pb: { type: Number, default: 0 },
  marketCap: { type: Number, default: 0 },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model<IStock>('Stock', StockSchema);
