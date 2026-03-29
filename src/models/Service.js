import mongoose from 'mongoose';
import slugify from 'slugify';
import { ServiceCategory } from './ServiceCategory.js';

const serviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, index: true },
    icon: { type: String },
    description: { type: String },
    features: [{ type: String }],
    category: { type: String, index: true }, // Service category name (e.g., "AI & ML", "Cloud Computing")
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'ServiceCategory', index: true },
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
serviceSchema.index({ category: 1, status: 1 });

serviceSchema.pre('validate', function setSlug(next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

// Pre-save: keep category and categoryId in sync (runs on create + document.save())
serviceSchema.pre('save', async function syncCategoryFields(next) {
  try {
    if (this.isModified('category')) {
      const name = (this.category || '').trim();
      if (!name) {
        this.category = '';
        this.categoryId = null;
      } else {
        this.category = name;
        const categoryDoc = await ServiceCategory.findOne({ name });
        this.categoryId = categoryDoc ? categoryDoc._id : null;
      }
    }
    if (this.isModified('categoryId') && this.categoryId && !(this.category || '').trim()) {
      const categoryDoc = await ServiceCategory.findById(this.categoryId);
      if (categoryDoc) {
        this.category = categoryDoc.name;
      }
    }
  } catch (error) {
    console.warn('Service category sync:', error?.message || error);
  }
  next();
});

export const Service = mongoose.model('Service', serviceSchema);



