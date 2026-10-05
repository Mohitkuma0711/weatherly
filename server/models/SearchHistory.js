import mongoose from 'mongoose';

const searchHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  country: {
    type: String,
    required: true,
    trim: true
  },
  temperature: {
    type: Number,
    required: true
  },
  weatherCondition: {
    type: String,
    required: true,
    trim: true
  },
  weatherIcon: {
    type: String,
    trim: true
  },
  searchedAt: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  timestamps: true
});

searchHistorySchema.index({ userId: 1, searchedAt: -1 });

export default mongoose.model('SearchHistory', searchHistorySchema);