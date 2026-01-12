import mongoose from 'mongoose';
import slugify from 'slugify';

const portfolioSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, index: true },
    category: { type: String, required: true, index: true }, // Now references PortfolioCategory name
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'PortfolioCategory', index: true },
    clientName: { type: String },
    timeline: { type: String },
    problem: { type: String },
    solution: { type: String },
    description: { type: String }, // HTML content for description
    techStack: [{ type: String, index: true }],
    screenshots: [{ type: String }],
    seoTitle: { type: String },
    seoDescription: { type: String },
    slug: { type: String, unique: true, index: true },
    status: { type: String, enum: ['active', 'inactive'], default: 'active', index: true },
    featured: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

// Compound indexes for common queries
portfolioSchema.index({ status: 1, createdAt: -1 });
portfolioSchema.index({ category: 1, status: 1 });
portfolioSchema.index({ featured: 1, status: 1 });

portfolioSchema.pre('validate', function setSlug(next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

export const PortfolioProject = mongoose.model('PortfolioProject', portfolioSchema);



