import mongoose from 'mongoose';

const seoSchema = new mongoose.Schema(
  {
    metaTitle: { type: String },
    metaDescription: { type: String },
    keywords: [{ type: String }],
    ogImage: { type: String },
    robotsTxt: { type: String }
  },
  { timestamps: true }
);

export const SEOSettings = mongoose.model('SEOSettings', seoSchema);



