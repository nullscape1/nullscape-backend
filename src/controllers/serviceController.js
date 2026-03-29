import mongoose from 'mongoose';
import httpStatus from 'http-status';
import { Service } from '../models/Service.js';
import { createCrudControllers, sanitizeUpdateBody } from './crudFactory.js';
import { catchAsync } from '../utils/catchAsync.js';
import { ApiError } from '../middlewares/error.js';
import { isValidObjectId } from '../utils/objectId.js';

const base = createCrudControllers(Service);

export const ServiceController = {
  ...base,
  // Use document.save() so validate + save hooks run (slug, categoryId sync).
  update: catchAsync(async (req, res) => {
    const id = String(req.params.id || '').trim();
    if (!isValidObjectId(id)) throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid id');
    const doc = await Service.findById(id);
    if (!doc) throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
    Object.assign(doc, sanitizeUpdateBody(req.body));
    await doc.save();
    const lean = doc.toObject({ versionKey: false });
    res.json(lean);
  }),
  // Backward compatible getter that supports both ObjectId and slug.
  get: catchAsync(async (req, res) => {
    const value = String(req.params.id || '').trim();
    let item = null;
    if (mongoose.Types.ObjectId.isValid(value)) {
      item = await Service.findById(value).select('-__v').lean();
    }
    if (!item) {
      item = await Service.findOne({ slug: value }).select('-__v').lean();
    }
    if (!item) throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
    res.json(item);
  }),
};



