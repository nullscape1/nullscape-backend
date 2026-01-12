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

// Pre-save hook to set categoryId if category name is provided
serviceSchema.pre('save', async function setCategoryId(next) {
  if (this.isModified('category') && this.category && !this.categoryId) {
    try {
      const categoryDoc = await ServiceCategory.findOne({ name: this.category });
      if (categoryDoc) {
        this.categoryId = categoryDoc._id;
      }
    } catch (error) {
      // If category not found, continue without setting categoryId
      console.warn(`Category "${this.category}" not found for service "${this.name}"`);
    }
  }
  // Also set category name if categoryId is provided but category name is not
  if (this.isModified('categoryId') && this.categoryId && !this.category) {
    try {
      const categoryDoc = await ServiceCategory.findById(this.categoryId);
      if (categoryDoc) {
        this.category = categoryDoc.name;
      }
    } catch (error) {
      console.warn(`Category ID "${this.categoryId}" not found for service "${this.name}"`);
    }
  }
  next();
});

export const Service = mongoose.model('Service', serviceSchema);



