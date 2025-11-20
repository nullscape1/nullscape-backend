import mongoose from 'mongoose';

const subscriberSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    status: { type: String, enum: ['active', 'inactive'], default: 'active', index: true }
  },
  { timestamps: true }
);

// Compound indexes for common queries
subscriberSchema.index({ status: 1, createdAt: -1 });

export const Subscriber = mongoose.model('Subscriber', subscriberSchema);



