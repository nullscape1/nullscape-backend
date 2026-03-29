import httpStatus from 'http-status';
import { PortfolioProject } from '../models/PortfolioProject.js';
import { createCrudControllers, sanitizeUpdateBody } from './crudFactory.js';
import { catchAsync } from '../utils/catchAsync.js';
import { ApiError } from '../middlewares/error.js';
import { isValidObjectId } from '../utils/objectId.js';

const base = createCrudControllers(PortfolioProject);

export const PortfolioController = {
  ...base,
  get: catchAsync(async (req, res) => {
    const value = String(req.params.id || '').trim();
    let item = null;
    if (isValidObjectId(value)) {
      item = await PortfolioProject.findById(value).select('-__v').lean();
    }
    if (!item) {
      item = await PortfolioProject.findOne({ slug: value }).select('-__v').lean();
    }
    if (!item) throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
    res.json(item);
  }),
  update: catchAsync(async (req, res) => {
    const id = String(req.params.id || '').trim();
    if (!isValidObjectId(id)) throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid id');
    const doc = await PortfolioProject.findById(id);
    if (!doc) throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
    Object.assign(doc, sanitizeUpdateBody(req.body));
    await doc.save();
    res.json(doc.toObject({ versionKey: false }));
  }),
};
