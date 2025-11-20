import { Router } from 'express';
import multer from 'multer';
import { auth, requireRoles } from '../../middlewares/auth.js';
import path from 'path';
import { v4 as uuid } from 'uuid';
import fs from 'fs';

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'src/uploads'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuid()}${ext}`);
  },
});

const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

const router = Router();
router.post('/', auth(), requireRoles('Admin', 'SuperAdmin', 'Editor'), upload.array('files', 10), (req, res) => {
  const files = (req.files || []).map((f) => ({
    filename: f.filename,
    url: `/uploads/${f.filename}`,
    size: f.size,
    mimetype: f.mimetype,
  }));
  res.json({ files });
});
router.get('/list', auth(), requireRoles('Admin', 'SuperAdmin', 'Editor'), (req, res, next) => {
  fs.readdir('src/uploads', (err, items) => {
    if (err) return next(err);
    const files = items.map((name) => ({
      filename: name,
      url: `/uploads/${name}`,
    }));
    return res.json({ files });
  });
});
router.delete('/:filename', auth(), requireRoles('Admin', 'SuperAdmin'), (req, res, next) => {
  const file = path.join('src/uploads', req.params.filename);
  fs.unlink(file, (err) => {
    if (err) return next(err);
    return res.json({ success: true });
  });
});

export default router;


