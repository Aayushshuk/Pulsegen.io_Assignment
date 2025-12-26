import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const VideoSchema = new Schema({
  tenantId: { type: String, index: true, required: true },
  ownerId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
  title: String,
  originalName: String,
  storageKey: String,
  size: Number,
  duration: Number,
  status: { type: String, enum: ['UPLOADED','PROCESSING','SAFE','FLAGGED','FAILED'], default: 'UPLOADED' },
  processingProgress: { type: Number, default: 0 },
  sensitivityScore: Number,
  categories: [String]
}, { timestamps: true });

export default model('Video', VideoSchema);
