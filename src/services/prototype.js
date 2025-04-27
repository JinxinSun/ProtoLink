const prototypeModel = require('../models/prototype');

/**
 * 原型服务 - 提供原型相关的业务逻辑
 */
class PrototypeService {
  /**
   * 获取原型列表，支持分页
   * @param {number} page - 页码（从1开始）
   * @param {number} pageSize - 每页数量
   * @returns {Promise<{items: Array, total: number, page: number, pageSize: number, totalPages: number}>} 分页结果
   */
  async listPrototypes(page = 1, pageSize = 10) {
    // 参数验证和处理
    const validPage = Math.max(1, parseInt(page, 10) || 1);
    const validPageSize = Math.min(100, Math.max(1, parseInt(pageSize, 10) || 10));
    
    // 调用模型层获取数据
    const result = await prototypeModel.list(validPage, validPageSize);
    
    // 格式化返回结果，去除不需要暴露的字段
    const formattedItems = result.items.map(item => ({
      id: item.id,
      name: item.name,
      shortLink: item.shortLink,
      accessUrl: item.accessUrl,
      previewUrl: item.previewUrl,
      createdAt: item.createdAt
    }));
    
    return {
      items: formattedItems,
      total: result.total,
      page: validPage,
      pageSize: validPageSize,
      totalPages: result.totalPages
    };
  }
  
  /**
   * 根据ID获取原型详情
   * @param {string} id - 原型ID
   * @returns {Promise<Object>} 原型详情
   */
  async getPrototypeById(id) {
    // 这里可以添加更多的业务逻辑
    // 例如：访问统计、权限检查等
    return prototypeModel.findById(id);
  }
}

module.exports = new PrototypeService(); 