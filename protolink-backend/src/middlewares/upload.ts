import multer from 'multer';
import path from 'path';

/**
 * 文件上传中间件配置
 * 使用内存存储，后续由存储服务处理文件结构
 */
const uploadMiddleware = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, callback) => {
    // 接受所有文件，因为原型可能包含多种文件类型（HTML, JS, CSS, 图片等）
    callback(null, true);
  },
  limits: {
    // 文件大小限制：50MB
    fileSize: 50 * 1024 * 1024,
  }
});

export default uploadMiddleware; 