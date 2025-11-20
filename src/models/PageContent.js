import mongoose from 'mongoose';

const sectionSchema = new mongoose.Schema(
  {
    key: { type: String, required: true }, // e.g. home.banner, about.section1
    content: { type: mongoose.Schema.Types.Mixed, default: {} }
  },
  { _id: false }
);

const pageContentSchema = new mongoose.Schema(
  {
    page: { type: String, required: true }, // home, about, services, contact, faq, footer, header, legal
    sections: [sectionSchema]
  },
  { timestamps: true }
);

pageContentSchema.index({ page: 1 }, { unique: true });

export const PageContent = mongoose.model('PageContent', pageContentSchema);



