import mongoose from 'mongoose';

const cmsPageV2Schema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true, unique: true, index: true },
    seoTitle: { type: String, trim: true, default: '' },
    seoDescription: { type: String, trim: true, default: '' },
    seoKeywords: [{ type: String, trim: true }],
    schemaMarkup: { type: mongoose.Schema.Types.Mixed, default: null },
    status: { type: String, enum: ['draft', 'published'], default: 'draft', index: true },
    sectionOrder: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CmsSectionV2' }],
  },
  { timestamps: true }
);

cmsPageV2Schema.index({ status: 1, updatedAt: -1 });

export const CmsPageV2 = mongoose.model('CmsPageV2', cmsPageV2Schema);
