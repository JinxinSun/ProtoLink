const crypto = require('crypto');
const PrototypeModel = require('../models/prototype');

/**
 * 短链接服务 - 负责生成和解析原型的访问链接
 */
class ShortLinkService {
  /**
   * 根据原型名称生成或获取已有的短链接
   * @param {string} prototypeName - 原型名称
   * @param {string} filePath - 文件保存路径
   * @returns {Promise<string>} 短链接字符串
   */
  async generateLink(prototypeName, filePath) {
    try {
      // 先查找是否已存在同名原型
      const existingPrototype = await PrototypeModel.findByName(prototypeName);
      
      if (existingPrototype) {
        // 如果存在，则更新文件路径，复用短链接
        await PrototypeModel.update(existingPrototype.id, { filePath });
        return existingPrototype.shortLink;
      } else {
        // 如果不存在，则生成新的短链接
        const shortLink = this._generateShortCode(prototypeName);
        
        // 创建新的原型记录
        await PrototypeModel.create({
          name: prototypeName,
          shortLink,
          filePath
        });
        
        return shortLink;
      }
    } catch (error) {
      console.error('Error generating short link:', error);
      throw new Error('Failed to generate short link');
    }
  }
  
  /**
   * 解析短链接，返回对应的原型记录
   * @param {string} shortLink - 短链接字符串
   * @returns {Promise<object>} 原型记录对象
   */
  async resolveLink(shortLink) {
    try {
      const prototype = await PrototypeModel.findByShortLink(shortLink);
      if (!prototype) {
        throw new Error('Short link not found');
      }
      return prototype;
    } catch (error) {
      console.error('Error resolving short link:', error);
      throw new Error('Failed to resolve short link');
    }
  }
  
  /**
   * 根据原型名称生成短链接码
   * @private
   * @param {string} prototypeName - 原型名称
   * @returns {string} 短链接字符串
   */
  _generateShortCode(prototypeName) {
    // 使用原型名称和随机值生成基于哈希的短码
    const randomSalt = crypto.randomBytes(8).toString('hex');
    const hash = crypto.createHash('sha256')
      .update(`${prototypeName}-${randomSalt}-${Date.now()}`)
      .digest('hex');
      
    // 取哈希的前8位作为短码
    return hash.substring(0, 8);
  }
}

module.exports = new ShortLinkService(); 