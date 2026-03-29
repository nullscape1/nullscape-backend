import httpStatus from 'http-status';
import { createCrudControllers } from './crudFactory.js';
import { ApiError } from '../middlewares/error.js';
import { catchAsync } from '../utils/catchAsync.js';
import { isValidObjectId } from '../utils/objectId.js';
import { CmsPageV2 } from '../models/CmsPageV2.js';
import { CmsSectionV2 } from '../models/CmsSectionV2.js';
import { CaseStudy } from '../models/CaseStudy.js';
import { Industry } from '../models/Industry.js';
import { GlobalSettingV2 } from '../models/GlobalSettingV2.js';
import { BlogPost } from '../models/BlogPost.js';

export const CmsPageV2Controller = createCrudControllers(CmsPageV2);
export const CmsSectionV2Controller = createCrudControllers(CmsSectionV2);
export const CaseStudyController = createCrudControllers(CaseStudy);
export const IndustryController = createCrudControllers(Industry);
export const GlobalSettingV2Controller = createCrudControllers(GlobalSettingV2);

export const getPageBySlug = catchAsync(async (req, res) => {
  const page = await CmsPageV2.findOne({ slug: req.params.slug, status: 'published' }).lean();
  if (!page) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Page not found');
  }

  const sections = await CmsSectionV2.find({
    pageId: page._id,
    status: 'published',
  })
    .sort({ order: 1, createdAt: 1 })
    .lean();

  res.json({ ...page, sections });
});

export const getGlobalSettings = catchAsync(async (_req, res) => {
  const settings = await GlobalSettingV2.find({}).lean();
  const mapped = settings.reduce((acc, item) => {
    acc[item.key] = item.value;
    return acc;
  }, {});
  res.json(mapped);
});

export const getBlogsPublic = catchAsync(async (req, res) => {
  const limit = Math.min(Number(req.query.limit || 12), 50);
  const items = await BlogPost.find({ status: 'published' })
    .sort({ publishedAt: -1, createdAt: -1 })
    .limit(limit)
    .lean();
  res.json({ items, total: items.length });
});

export const getCaseStudiesPublic = catchAsync(async (req, res) => {
  const limit = Math.min(Number(req.query.limit || 12), 50);
  const items = await CaseStudy.find({ status: 'published' })
    .sort({ updatedAt: -1 })
    .limit(limit)
    .lean();
  res.json({ items, total: items.length });
});

export const listSectionsByPage = catchAsync(async (req, res) => {
  const pageId = String(req.params.id || '').trim();
  if (!isValidObjectId(pageId)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid id');
  }
  const items = await CmsSectionV2.find({ pageId })
    .sort({ order: 1, createdAt: 1 })
    .lean();
  res.json({ items, total: items.length, page: 1, limit: items.length, pages: 1 });
});
