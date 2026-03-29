import httpStatus from 'http-status';
import { PortfolioCategory } from '../models/PortfolioCategory.js';
import { PortfolioProject } from '../models/PortfolioProject.js';
import { createCrudControllers, sanitizeUpdateBody } from './crudFactory.js';
import { catchAsync } from '../utils/catchAsync.js';
import { ApiError } from '../middlewares/error.js';
import { isValidObjectId } from '../utils/objectId.js';

const base = createCrudControllers(PortfolioCategory);

export const PortfolioCategoryController = {
  ...base,
  update: catchAsync(async (req, res) => {
    const id = String(req.params.id || '').trim();
    if (!isValidObjectId(id)) throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid id');
    const doc = await PortfolioCategory.findById(id);
    if (!doc) throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
    const previousName = doc.name;
    Object.assign(doc, sanitizeUpdateBody(req.body));
    if (doc.isModified('name') && doc.name && doc.name !== previousName) {
      await PortfolioProject.updateMany({ category: previousName }, { $set: { category: doc.name } });
    }
    await doc.save();
    res.json(doc.toObject({ versionKey: false }));
  }),
  remove: catchAsync(async (req, res) => {
    const id = String(req.params.id || '').trim();
    if (!isValidObjectId(id)) throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid id');
    const doc = await PortfolioCategory.findById(id);
    if (!doc) throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
    const name = doc.name;
    await PortfolioCategory.findByIdAndDelete(id);
    await PortfolioProject.updateMany(
      { $or: [{ category: name }, { categoryId: doc._id }] },
      { $set: { category: '', categoryId: null } }
    );
    res.json({ success: true });
  }),
};
