import mongoose from 'mongoose';
import slugify from 'slugify';

const caseStudySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, index: true },
    slug: { type: String, unique: true, index: true },
    industry: { type: String, trim: true, index: true },
    summary: { type: String, trim: true, default: '' },
    content: { type: mongoose.Schema.Types.Mixed, default: {} },
    featuredImage: { type: String, trim: true, default: '' },
    seoTitle: { type: String, trim: true, default: '' },
    seoDescription: { type: String, trim: true, default: '' },
    status: { type: String, enum: ['draft', 'published'], default: 'draft', index: true },
  },
  { timestamps: true }
);

caseStudySchema.pre('validate', function setSlug(next) {
  if (!this.slug && this.title) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

export const CaseStudy = mongoose.model('CaseStudy', caseStudySchema);
