import mongoose from 'mongoose';
import slugify from 'slugify';

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, index: true },
    description: { type: String },
    contentHtml: { type: String },
    thumbnail: { type: String },
    tags: [{ type: String, index: true }],
    category: { type: String, index: true }, // References BlogCategory name
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'BlogCategory', index: true },
    seoTitle: { type: String },
    seoDescription: { type: String },
    slug: { type: String, unique: true, index: true },
    status: { type: String, enum: ['draft', 'published'], default: 'draft', index: true },
    publishedAt: { type: Date, index: true, default: Date.now },
  },
  { timestamps: true }
);

// Set publishedAt when status changes to published
blogSchema.pre('save', function setPublishedAt(next) {
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

// Compound indexes for common queries
blogSchema.index({ status: 1, publishedAt: -1 });
blogSchema.index({ category: 1, status: 1 });
blogSchema.index({ tags: 1, status: 1 });

blogSchema.pre('validate', function setSlug(next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

export const BlogPost = mongoose.model('BlogPost', blogSchema);



