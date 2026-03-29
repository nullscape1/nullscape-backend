import httpStatus from 'http-status';
import { Testimonial } from '../models/Testimonial.js';
import { createCrudControllers, sanitizeUpdateBody } from './crudFactory.js';
import { catchAsync } from '../utils/catchAsync.js';
import { ApiError } from '../middlewares/error.js';
import { isValidObjectId } from '../utils/objectId.js';
import { parseCrudListQuery } from '../utils/listQuery.js';
import { parseListSort } from '../utils/sortQuery.js';

const base = createCrudControllers(Testimonial);

const SORT_FIELDS = new Set([
  'createdAt',
  'updatedAt',
  'featured',
  'rating',
  'clientName',
  'review',
]);

/**
 * List with search on clientName/review and default sort: featured first, then newest.
 */
const list = catchAsync(async (req, res) => {
  const { page: parsedPage, limit: parsedLimit, sort: sortRaw, q, status, resolved } =
    parseCrudListQuery(req.query);

  const filter = {};
  if (q) {
    const regex = new RegExp(String(q).trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    filter.$or = [{ clientName: regex }, { review: regex }];
  }
  if (status) filter.status = status;
  if (typeof resolved !== 'undefined') filter.resolved = resolved;

  const skip = (parsedPage - 1) * parsedLimit;
  const selectFields = '-__v';

  const hasSort = sortRaw != null && String(sortRaw).trim() !== '';

  let query = Testimonial.find(filter).select(selectFields);
  if (!hasSort) {
    query = query.sort({ featured: -1, createdAt: -1 });
  } else {
    const sort = parseListSort(sortRaw, '-createdAt', SORT_FIELDS);
    query = query.sort(sort);
  }

  const [items, total] = await Promise.all([
    query.skip(skip).limit(parsedLimit).lean(),
    Testimonial.countDocuments(filter),
  ]);

  res.setHeader('X-Total-Count', total);
  res.json({
    items,
    total,
    page: parsedPage,
    limit: parsedLimit,
    pages: Math.ceil(total / parsedLimit),
  });
});

export const TestimonialController = {
  ...base,
  list,
  update: catchAsync(async (req, res) => {
    const id = String(req.params.id || '').trim();
    if (!isValidObjectId(id)) throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid id');
    const doc = await Testimonial.findById(id);
    if (!doc) throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
    Object.assign(doc, sanitizeUpdateBody(req.body));
    await doc.save();
    res.json(doc.toObject({ versionKey: false }));
  }),
};
