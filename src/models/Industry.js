import mongoose from 'mongoose';
import slugify from 'slugify';

const industrySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, index: true },
    slug: { type: String, unique: true, index: true },
    category: { type: String, trim: true, default: '' },
    content: { type: mongoose.Schema.Types.Mixed, default: {} },
    seoTitle: { type: String, trim: true, default: '' },
    seoDescription: { type: String, trim: true, default: '' },
    status: { type: String, enum: ['draft', 'published'], default: 'draft', index: true },
  },
  { timestamps: true }
);

industrySchema.pre('validate', function setSlug(next) {
  if (!this.slug && this.name) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

export const Industry = mongoose.model('Industry', industrySchema);
