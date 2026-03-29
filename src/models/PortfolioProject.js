import mongoose from 'mongoose';
import slugify from 'slugify';
import { PortfolioCategory } from './PortfolioCategory.js';

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

portfolioSchema.pre('save', async function syncPortfolioCategoryFields(next) {
  try {
    if (this.isModified('category')) {
      const name = (this.category || '').trim();
      if (!name) {
        this.category = '';
        this.categoryId = null;
      } else {
        this.category = name;
        const cat = await PortfolioCategory.findOne({ name });
        this.categoryId = cat ? cat._id : null;
      }
    }
    if (this.isModified('categoryId') && this.categoryId && !(this.category || '').trim()) {
      const cat = await PortfolioCategory.findById(this.categoryId);
      if (cat) this.category = cat.name;
    }
  } catch (e) {
    console.warn('Portfolio category sync:', e?.message || e);
  }
  next();
});

export const PortfolioProject = mongoose.model('PortfolioProject', portfolioSchema);



