import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema(
  {
    clientName: { type: String, required: true },
    review: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, index: true },
    picture: { type: String },
    category: { type: String, enum: ['App', 'Web', 'AI', 'Other'], default: 'Web' },
    status: { type: String, enum: ['active', 'inactive'], default: 'active', index: true },
    featured: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

// Compound indexes for common queries
testimonialSchema.index({ status: 1, featured: 1 });
testimonialSchema.index({ status: 1, createdAt: -1 });
testimonialSchema.index({ rating: 1, status: 1 });

export const Testimonial = mongoose.model('Testimonial', testimonialSchema);



