import httpStatus from 'http-status';
import { catchAsync } from '../utils/catchAsync.js';
import { ApiError } from '../middlewares/error.js';
import { isValidObjectId } from '../utils/objectId.js';
import { parseListSort } from '../utils/sortQuery.js';
import { parseCrudListQuery } from '../utils/listQuery.js';

const LIST_SORT_FIELDS = new Set([
  'createdAt',
  'updatedAt',
  'name',
  'title',
  'order',
  'slug',
  'position',
  'publishedAt',
]);

export function sanitizeUpdateBody(body) {
  if (!body || typeof body !== 'object') return {};
  const { _id, __v, createdAt, updatedAt, ...rest } = body;
  return rest;
}

export const createCrudControllers = (Model) => ({
  list: catchAsync(async (req, res) => {
    const { page: parsedPage, limit: parsedLimit, sort: sortRaw, q, status, resolved } =
      parseCrudListQuery(req.query);
    const sort = parseListSort(sortRaw, '-createdAt', LIST_SORT_FIELDS);
    
    const filter = {};
    if (q) {
      const regex = new RegExp(String(q).trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      filter.$or = [{ name: regex }, { title: regex }, { description: regex }];
    }
    if (status) filter.status = status;
    if (typeof resolved !== 'undefined') filter.resolved = resolved;
    
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
    if (!isValidObjectId(req.params.id)) throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid id');
    const item = await Model.findById(req.params.id).select('-__v').lean();
    if (!item) throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
    res.json(item);
  }),
  create: catchAsync(async (req, res) => {
    const item = await Model.create(req.body);
    res.status(httpStatus.CREATED).json(item);
  }),
  update: catchAsync(async (req, res) => {
    if (!isValidObjectId(req.params.id)) throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid id');
    const updatePayload = sanitizeUpdateBody(req.body);
    const item = await Model.findByIdAndUpdate(req.params.id, updatePayload, { new: true });
    if (!item) throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
    res.json(item);
  }),
  remove: catchAsync(async (req, res) => {
    if (!isValidObjectId(req.params.id)) throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid id');
    const item = await Model.findByIdAndDelete(req.params.id);
    if (!item) throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
    res.json({ success: true });
  }),
});


