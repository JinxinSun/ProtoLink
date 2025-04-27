import { Request, Response } from 'express';
import StorageService from '../services/storage';
import prototypeModel from '../models/prototype';

// 初始化存储服务
const storageService = new StorageService();

/**
 * 上传控制器 - 处理原型文件上传请求
 */
class UploadController {
  /**
   * 处理原型文件上传
   * @param req 请求对象
   * @param res 响应对象
   */
  async uploadPrototype(req: Request, res: Response): Promise<void> {
    try {
      // 检查请求是否包含文件
      if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
        res.status(400).json({
          success: false,
          message: '未检测到上传文件'
        });
        return;
      }

      // 获取原型名称（从请求参数或使用默认名称）
      const prototypeName = req.body.name || '未命名原型';
      
      // 检查是否为覆盖上传（注意此处只是预检，实际操作在Storage Service中）
      const existingPrototype = prototypeModel.getPrototypeByName(prototypeName);
      const isOverwrite = !!existingPrototype;

      // 使用存储服务保存文件
      const result = await storageService.savePrototype(req.files as Express.Multer.File[], prototypeName);
      
      // 获取完整的原型信息
      const prototype = prototypeModel.getPrototypeById(result.id);

      // 返回成功响应
      res.status(201).json({
        success: true,
        message: isOverwrite ? '原型覆盖上传成功' : '原型上传成功',
        data: {
          id: result.id,
          name: prototypeName,
          path: result.path,
          short_link: prototype?.short_link,
          is_overwrite: isOverwrite
        }
      });
    } catch (error) {
      console.error('上传处理失败:', error);
      res.status(500).json({
        success: false,
        message: '服务器处理上传失败',
        error: error instanceof Error ? error.message : '未知错误'
      });
    }
  }
}

export default new UploadController(); 