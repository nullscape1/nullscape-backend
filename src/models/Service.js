import mongoose from 'mongoose';
import slugify from 'slugify';

const serviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, index: true },
    icon: { type: String },
    description: { type: String },
    features: [{ type: String }],
    seoMetaTitle: { type: String },
    seoMetaDescription: { type: String },
    slug: { type: String, unique: true, index: true },
    status: { type: String, enum: ['active', 'inactive'], default: 'active', index: true },
    order: { type: Number, default: 0, index: true },
  },
  { timestamps: true }
);

// Compound indexes for common queries
serviceSchema.index({ status: 1, order: 1 });
serviceSchema.index({ status: 1, createdAt: -1 });

serviceSchema.pre('validate', function setSlug(next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

export const Service = mongoose.model('Service', serviceSchema);



