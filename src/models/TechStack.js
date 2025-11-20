import mongoose from 'mongoose';

const techStackSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true, index: true },
    icon: { type: String },
    category: { type: String, enum: ['Frontend', 'Backend', 'Database', 'Cloud', 'Mobile', 'DevOps', 'Other'], default: 'Other', index: true },
    description: { type: String },
    order: { type: Number, default: 0, index: true },
    status: { type: String, enum: ['active', 'inactive'], default: 'active', index: true },
  },
  { timestamps: true }
);

// Compound indexes for common queries
techStackSchema.index({ status: 1, category: 1 });
techStackSchema.index({ status: 1, order: 1 });

export const TechStack = mongoose.model('TechStack', techStackSchema);


