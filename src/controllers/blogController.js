import httpStatus from 'http-status';
import { BlogPost } from '../models/BlogPost.js';
import { createCrudControllers, sanitizeUpdateBody } from './crudFactory.js';
import { catchAsync } from '../utils/catchAsync.js';
import { ApiError } from '../middlewares/error.js';
import { isValidObjectId } from '../utils/objectId.js';

const base = createCrudControllers(BlogPost);

export const BlogController = {
  ...base,
  get: catchAsync(async (req, res) => {
    const value = String(req.params.id || '').trim();
    let item = null;
    if (isValidObjectId(value)) {
      item = await BlogPost.findById(value).select('-__v').lean();
    }
    if (!item) {
      item = await BlogPost.findOne({ slug: value }).select('-__v').lean();
    }
    if (!item) throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
    if (item.status !== 'published' && !req.user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
    }
    res.json(item);
  }),
  update: catchAsync(async (req, res) => {
    const id = String(req.params.id || '').trim();
    if (!isValidObjectId(id)) throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid id');
    const doc = await BlogPost.findById(id);
    if (!doc) throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
    Object.assign(doc, sanitizeUpdateBody(req.body));
    await doc.save();
    res.json(doc.toObject({ versionKey: false }));
  }),
};
