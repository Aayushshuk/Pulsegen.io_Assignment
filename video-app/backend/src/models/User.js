import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const UserSchema = new Schema({
  email: { type: String, unique: true, index: true, required: true },
  passwordHash: { type: String, required: true },
  name: String,
  tenantId: { type: String, index: true, required: true },
  role: { type: String, enum: ['VIEWER','EDITOR','ADMIN'], default: 'VIEWER' }
}, { timestamps: true });

export default model('User', UserSchema);
