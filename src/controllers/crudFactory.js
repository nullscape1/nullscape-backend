import httpStatus from 'http-status';
import { catchAsync } from '../utils/catchAsync.js';
import { ApiError } from '../middlewares/error.js';

export const createCrudControllers = (Model) => ({
  list: catchAsync(async (req, res) => {
    const { page = 1, limit = 20, sort = '-createdAt', q, status, resolved } = req.query;
    const maxLimit = 100; // Prevent excessive data requests
    const parsedLimit = Math.min(Number(limit) || 20, maxLimit);
    const parsedPage = Math.max(Number(page) || 1, 1);
    
    const filter = {};
    if (q) {
      const regex = new RegExp(String(q).trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      filter.$or = [{ name: regex }, { title: regex }, { description: regex }];
    }
    if (status) filter.status = status;
    if (typeof resolved !== 'undefined') filter.resolved = String(resolved) === 'true';
    
    const skip = (parsedPage - 1) * parsedLimit;
    
    // Optimize query with select fields (exclude sensitive/internal fields)
    const selectFields = '-__v';
    
    const [items, total] = await Promise.all([
      Model.find(filter)
        .select(selectFields)
        .sort(sort)
        .skip(skip)
        .limit(parsedLimit)
        .lean(), // Use lean() for better performance
      Model.countDocuments(filter),
    ]);
    
    res.setHeader('X-Total-Count', total);
    res.json({
      items,
      total,
      page: parsedPage,
      limit: parsedLimit,
      pages: Math.ceil(total / parsedLimit),
    });
  }),
  get: catchAsync(async (req, res) => {
    const item = await Model.findById(req.params.id).select('-__v').lean();
    if (!item) throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
    res.json(item);
  }),
  create: catchAsync(async (req, res) => {
    const item = await Model.create(req.body);
    res.status(httpStatus.CREATED).json(item);
  }),
  update: catchAsync(async (req, res) => {
    const item = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
    res.json(item);
  }),
  remove: catchAsync(async (req, res) => {
    const item = await Model.findByIdAndDelete(req.params.id);
    if (!item) throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
    res.json({ success: true });
  }),
});


