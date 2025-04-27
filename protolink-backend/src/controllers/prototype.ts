import { Request, Response } from 'express';
import prototypeModel from '../models/prototype';
import path from 'path';

/**
 * 原型控制器 - 处理原型相关API请求
 */
class PrototypeController {
  /**
   * 解析短链接获取原型信息
   * @param req 请求对象
   * @param res 响应对象
   */
  async resolveLink(req: Request, res: Response): Promise<void> {
    try {
      const { shortLink } = req.params;
      
      if (!shortLink) {
        res.status(400).json({
          success: false,
          message: '缺少短链接参数'
        });
        return;
      }
      
      console.log(`接收到短链接请求: ${shortLink}`);
      
      // 通过shortLink查找原型记录
      const prototype = prototypeModel.getPrototypeByShortLink(shortLink);
      
      if (!prototype) {
        console.log(`找不到对应短链接 ${shortLink} 的原型`);
        res.status(404).json({
          success: false,
          message: '找不到请求的原型'
        });
        return;
      }
      
      console.log(`找到原型:`, prototype);
      
      // 返回原型信息
      res.status(200).json({
        success: true,
        data: {
          id: prototype.id,
          name: prototype.name,
          path: prototype.id, // 使用ID作为路径，因为文件保存在以ID命名的目录中
          short_link: prototype.short_link,
          created_at: prototype.created_at
        }
      });
    } catch (error) {
      console.error('解析链接失败:', error);
      res.status(500).json({
        success: false,
        message: '服务器处理请求失败'
      });
    }
  }

  /**
   * 获取原型列表
   * @param req 请求对象
   * @param res 响应对象
   */
  async listPrototypes(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 10;
      
      const prototypes = prototypeModel.listPrototypes(page, pageSize);
      
      res.status(200).json({
        success: true,
        data: {
          items: prototypes.items,
          total: prototypes.total
        }
      });
    } catch (error) {
      console.error('获取原型列表失败:', error);
      res.status(500).json({
        success: false,
        message: '服务器处理请求失败'
      });
    }
  }
}

export default new PrototypeController(); 