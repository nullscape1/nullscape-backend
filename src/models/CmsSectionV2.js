import mongoose from 'mongoose';

const cmsSectionV2Schema = new mongoose.Schema(
  {
    pageId: { type: mongoose.Schema.Types.ObjectId, ref: 'CmsPageV2', required: true, index: true },
    type: { type: String, required: true, trim: true, index: true },
    name: { type: String, trim: true, default: '' },
    content: { type: mongoose.Schema.Types.Mixed, default: {} },
    order: { type: Number, default: 0, index: true },
    status: { type: String, enum: ['draft', 'published'], default: 'published', index: true },
  },
  { timestamps: true }
);

cmsSectionV2Schema.index({ pageId: 1, order: 1 }, { unique: false });

export const CmsSectionV2 = mongoose.model('CmsSectionV2', cmsSectionV2Schema);
