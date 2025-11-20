import mongoose from 'mongoose';

const inquirySchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['contact', 'quote', 'hire', 'newsletter', 'other'], default: 'contact', index: true },
    name: { type: String },
    email: { type: String, index: true },
    phone: { type: String },
    message: { type: String },
    resolved: { type: Boolean, default: false, index: true }
  },
  { timestamps: true }
);

// Compound indexes for common queries
inquirySchema.index({ resolved: 1, createdAt: -1 });
inquirySchema.index({ type: 1, createdAt: -1 });
inquirySchema.index({ email: 1, createdAt: -1 });

export const Inquiry = mongoose.model('Inquiry', inquirySchema);



