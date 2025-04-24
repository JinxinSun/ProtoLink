import express from 'express';
import uploadController from '../controllers/upload';
import uploadMiddleware from '../middlewares/upload';

const router = express.Router();

/**
 * 原型上传接口
 * POST /api/upload
 * 使用 multer 中间件处理 multipart/form-data 上传
 */
router.post(
  '/', 
  uploadMiddleware.array('files'), 
  uploadController.uploadPrototype
);

export default router; 