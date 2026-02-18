import mongoose, { Schema, Document } from 'mongoose';

export interface IWatchlistItem extends Document {
  userId: string;
  symbol: string;
  name: string;
  addedAt: Date;
  groupId?: string;
  notes?: string;
}

const WatchlistSchema: Schema = new Schema({
  userId: { type: String, required: true, index: true },
  symbol: { type: String, required: true, index: true },
  name: { type: String, required: true },
  addedAt: { type: Date, default: Date.now },
  groupId: { type: String, default: 'default' },
  notes: { type: String, default: '' },
});

WatchlistSchema.index({ userId: 1, symbol: 1 }, { unique: true });

export default mongoose.model<IWatchlistItem>('Watchlist', WatchlistSchema);
