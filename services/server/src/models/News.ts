import mongoose, { Schema, Document } from 'mongoose';

export interface INews extends Document {
  title: string;
  content: string;
  summary?: string;
  source: string;
  url?: string;
  imageUrl?: string;
  category: '个股' | '大盘' | '行业' | '政策' | '国际' | '公司';
  relatedStocks?: string[];
  publishTime: Date;
  isHot: boolean;
  viewCount: number;
}

const NewsSchema: Schema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  summary: { type: String },
  source: { type: String, required: true },
  url: { type: String },
  imageUrl: { type: String },
  category: { type: String, enum: ['个股', '大盘', '行业', '政策', '国际', '公司'], required: true },
  relatedStocks: [{ type: String }],
  publishTime: { type: Date, default: Date.now, index: true },
  isHot: { type: Boolean, default: false },
  viewCount: { type: Number, default: 0 },
});

export default mongoose.model<INews>('News', NewsSchema);
