import httpStatus from 'http-status';
import { BlogCategory } from '../models/BlogCategory.js';
import { BlogPost } from '../models/BlogPost.js';
import { createCrudControllers, sanitizeUpdateBody } from './crudFactory.js';
import { catchAsync } from '../utils/catchAsync.js';
import { ApiError } from '../middlewares/error.js';
import { isValidObjectId } from '../utils/objectId.js';

const base = createCrudControllers(BlogCategory);

export const BlogCategoryController = {
  ...base,
  update: catchAsync(async (req, res) => {
    const id = String(req.params.id || '').trim();
    if (!isValidObjectId(id)) throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid id');
    const doc = await BlogCategory.findById(id);
    if (!doc) throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
    const previousName = doc.name;
    Object.assign(doc, sanitizeUpdateBody(req.body));
    if (doc.isModified('name') && doc.name && doc.name !== previousName) {
      await BlogPost.updateMany({ category: previousName }, { $set: { category: doc.name } });
    }
    await doc.save();
    res.json(doc.toObject({ versionKey: false }));
  }),
  remove: catchAsync(async (req, res) => {
    const id = String(req.params.id || '').trim();
    if (!isValidObjectId(id)) throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid id');
    const doc = await BlogCategory.findById(id);
    if (!doc) throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
    const name = doc.name;
    await BlogCategory.findByIdAndDelete(id);
    await BlogPost.updateMany(
      { $or: [{ category: name }, { categoryId: doc._id }] },
      { $set: { category: '', categoryId: null } }
    );
    res.json({ success: true });
  }),
};
