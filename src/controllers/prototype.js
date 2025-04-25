const shortLinkService = require('../services/shortlink');
const PrototypeModel = require('../models/prototype');

/**
 * 原型控制器 - 负责处理原型相关API请求
 */
class PrototypeController {
  /**
   * 生成原型访问链接
   * @param {Object} req - Express请求对象
   * @param {Object} res - Express响应对象
   * @returns {Promise<void>}
   */
  async generateLink(req, res) {
    try {
      const { name, filePath } = req.body;
      
      if (!name || !filePath) {
        return res.status(400).json({
          success: false,
          message: '缺少原型名称或文件路径'
        });
      }
      
      // 使用短链接服务生成或获取已有的短链接
      const shortLink = await shortLinkService.generateLink(name, filePath);
      
      // 构建完整的访问URL（实际项目中应从配置中获取base URL）
      const baseUrl = process.env.BASE_URL || 'https://protolink.company.com';
      const accessUrl = `${baseUrl}/preview/${shortLink}`;
      
      return res.status(200).json({
        success: true,
        data: {
          shortLink,
          accessUrl,
          name
        }
      });
    } catch (error) {
      console.error('Error generating link:', error);
      return res.status(500).json({
        success: false,
        message: '生成链接失败'
      });
    }
  }
  
  /**
   * 解析短链接，获取原型信息
   * @param {Object} req - Express请求对象
   * @param {Object} res - Express响应对象
   * @returns {Promise<void>}
   */
  async resolveLink(req, res) {
    try {
      const { shortLink } = req.params;
      
      if (!shortLink) {
        return res.status(400).json({
          success: false,
          message: '缺少短链接参数'
        });
      }
      
      // 解析短链接，获取原型信息
      const prototype = await shortLinkService.resolveLink(shortLink);
      
      return res.status(200).json({
        success: true,
        data: {
          id: prototype.id,
          name: prototype.name,
          filePath: prototype.filePath,
          shortLink: prototype.shortLink
        }
      });
    } catch (error) {
      console.error('Error resolving link:', error);
      
      if (error.message === 'Short link not found') {
        return res.status(404).json({
          success: false,
          message: '链接不存在或已失效'
        });
      }
      
      return res.status(500).json({
        success: false,
        message: '解析链接失败'
      });
    }
  }
}

module.exports = new PrototypeController(); 