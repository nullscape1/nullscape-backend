import mongoose from 'mongoose';
import slugify from 'slugify';
import { BlogCategory } from './BlogCategory.js';

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
    publishedAt: { type: Date, index: true },
  },
  { timestamps: true }
);

// Set publishedAt only when the post becomes published (drafts must not get a fake publish date)
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

blogSchema.pre('save', async function syncBlogCategoryFields(next) {
  try {
    if (this.isModified('category')) {
      const name = (this.category || '').trim();
      if (!name) {
        this.category = '';
        this.categoryId = null;
      } else {
        this.category = name;
        const cat = await BlogCategory.findOne({ name });
        this.categoryId = cat ? cat._id : null;
      }
    }
    if (this.isModified('categoryId') && this.categoryId && !(this.category || '').trim()) {
      const cat = await BlogCategory.findById(this.categoryId);
      if (cat) this.category = cat.name;
    }
  } catch (e) {
    console.warn('Blog category sync:', e?.message || e);
  }
  next();
});

export const BlogPost = mongoose.model('BlogPost', blogSchema);



