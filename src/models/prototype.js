const { v4: uuidv4 } = require('uuid');
const db = require('../config/database');

/**
 * 原型数据模型 - 提供原型数据的存储和检索
 */
class PrototypeModel {
  /**
   * 创建新的原型记录
   * @param {Object} prototypeData - 原型数据对象
   * @param {string} prototypeData.name - 原型名称
   * @param {string} prototypeData.shortLink - 短链接码
   * @param {string} prototypeData.filePath - 文件路径
   * @returns {Promise<Object>} 创建的原型对象
   */
  async create(prototypeData) {
    try {
      const id = uuidv4();
      const now = new Date();
      
      const prototype = {
        id,
        name: prototypeData.name,
        short_link: prototypeData.shortLink,
        file_path: prototypeData.filePath,
        created_at: now,
        updated_at: now,
        metadata: {}
      };
      
      // 这里使用数据库操作保存原型数据
      // 使用假装的数据库操作 - 实际项目中应替换为真实的数据库操作
      await db.prototypes.save(prototype);
      
      return prototype;
    } catch (error) {
      console.error('Error creating prototype:', error);
      throw new Error('Failed to create prototype');
    }
  }
  
  /**
   * 根据原型名称查找原型
   * @param {string} name - 原型名称
   * @returns {Promise<Object|null>} 原型对象或null
   */
  async findByName(name) {
    try {
      // 使用假装的数据库操作 - 实际项目中应替换为真实的数据库操作
      const prototype = await db.prototypes.findOne({ name });
      
      if (!prototype) {
        return null;
      }
      
      return {
        id: prototype.id,
        name: prototype.name,
        shortLink: prototype.short_link,
        filePath: prototype.file_path,
        createdAt: prototype.created_at,
        updatedAt: prototype.updated_at
      };
    } catch (error) {
      console.error('Error finding prototype by name:', error);
      throw new Error('Failed to find prototype');
    }
  }
  
  /**
   * 根据短链接查找原型
   * @param {string} shortLink - 短链接码
   * @returns {Promise<Object|null>} 原型对象或null
   */
  async findByShortLink(shortLink) {
    try {
      // 使用假装的数据库操作 - 实际项目中应替换为真实的数据库操作
      const prototype = await db.prototypes.findOne({ short_link: shortLink });
      
      if (!prototype) {
        return null;
      }
      
      return {
        id: prototype.id,
        name: prototype.name,
        shortLink: prototype.short_link,
        filePath: prototype.file_path,
        createdAt: prototype.created_at,
        updatedAt: prototype.updated_at
      };
    } catch (error) {
      console.error('Error finding prototype by short link:', error);
      throw new Error('Failed to find prototype');
    }
  }
  
  /**
   * 根据ID查找原型
   * @param {string} id - 原型ID
   * @returns {Promise<Object|null>} 原型对象或null
   */
  async findById(id) {
    try {
      // 使用假装的数据库操作 - 实际项目中应替换为真实的数据库操作
      const prototype = await db.prototypes.findOne({ id });
      
      if (!prototype) {
        return null;
      }
      
      return {
        id: prototype.id,
        name: prototype.name,
        shortLink: prototype.short_link,
        filePath: prototype.file_path,
        createdAt: prototype.created_at,
        updatedAt: prototype.updated_at
      };
    } catch (error) {
      console.error('Error finding prototype by id:', error);
      throw new Error('Failed to find prototype');
    }
  }
  
  /**
   * 更新原型数据
   * @param {string} id - 原型ID
   * @param {Object} updateData - 要更新的数据
   * @returns {Promise<Object>} 更新后的原型对象
   */
  async update(id, updateData) {
    try {
      // 使用假装的数据库操作 - 实际项目中应替换为真实的数据库操作
      const prototype = await db.prototypes.findOne({ id });
      
      if (!prototype) {
        throw new Error('Prototype not found');
      }
      
      const updatedPrototype = {
        ...prototype,
        ...updateData,
        updated_at: new Date()
      };
      
      await db.prototypes.update(id, updatedPrototype);
      
      return {
        id: updatedPrototype.id,
        name: updatedPrototype.name,
        shortLink: updatedPrototype.short_link,
        filePath: updatedPrototype.file_path,
        createdAt: updatedPrototype.created_at,
        updatedAt: updatedPrototype.updated_at
      };
    } catch (error) {
      console.error('Error updating prototype:', error);
      throw new Error('Failed to update prototype');
    }
  }

  /**
   * 获取原型列表，支持分页
   * @param {number} page - 页码（从1开始）
   * @param {number} pageSize - 每页数量
   * @returns {Promise<{items: Array, total: number}>} 分页结果和总条数
   */
  async list(page = 1, pageSize = 10) {
    try {
      // 计算跳过的记录数
      const skip = (page - 1) * pageSize;
      
      // 使用假装的数据库操作 - 实际项目中应替换为真实的数据库操作
      const prototypes = await db.prototypes.find({}, { skip, limit: pageSize, sort: { created_at: -1 } });
      const total = await db.prototypes.count({});
      
      // 格式化返回结果
      const items = prototypes.map(prototype => ({
        id: prototype.id,
        name: prototype.name,
        shortLink: prototype.short_link,
        accessUrl: `${process.env.BASE_URL}/p/${prototype.short_link}`,
        filePath: prototype.file_path,
        createdAt: prototype.created_at,
        updatedAt: prototype.updated_at,
        previewUrl: `${process.env.BASE_URL}/preview/${prototype.short_link}`
      }));
      
      return {
        items,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize)
      };
    } catch (error) {
      console.error('Error listing prototypes:', error);
      throw new Error('Failed to list prototypes');
    }
  }
}

module.exports = new PrototypeModel(); 