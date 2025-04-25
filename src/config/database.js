/**
 * 数据库配置模块
 * 注意：这是一个模拟的数据库操作模块，实际项目应替换为MongoDB/PostgreSQL等真实数据库
 */

// 模拟内存数据存储
const inMemoryDb = {
  prototypes: []
};

// 模拟原型数据操作
const prototypesCollection = {
  /**
   * 保存原型数据
   * @param {Object} prototype - 原型对象
   * @returns {Promise<Object>} 保存的原型对象
   */
  save: async (prototype) => {
    inMemoryDb.prototypes.push(prototype);
    return prototype;
  },
  
  /**
   * 查找单个原型
   * @param {Object} query - 查询条件
   * @returns {Promise<Object|null>} 查找到的原型或null
   */
  findOne: async (query) => {
    const keys = Object.keys(query);
    
    for (const prototype of inMemoryDb.prototypes) {
      let match = true;
      
      for (const key of keys) {
        if (prototype[key] !== query[key]) {
          match = false;
          break;
        }
      }
      
      if (match) {
        return { ...prototype };
      }
    }
    
    return null;
  },
  
  /**
   * 更新原型数据
   * @param {string} id - 原型ID
   * @param {Object} updatedPrototype - 更新后的原型对象
   * @returns {Promise<Object>} 更新后的原型对象
   */
  update: async (id, updatedPrototype) => {
    const index = inMemoryDb.prototypes.findIndex(p => p.id === id);
    
    if (index === -1) {
      throw new Error('Prototype not found');
    }
    
    inMemoryDb.prototypes[index] = { ...updatedPrototype };
    return updatedPrototype;
  },
  
  /**
   * 删除原型
   * @param {string} id - 原型ID
   * @returns {Promise<boolean>} 删除结果
   */
  delete: async (id) => {
    const index = inMemoryDb.prototypes.findIndex(p => p.id === id);
    
    if (index === -1) {
      return false;
    }
    
    inMemoryDb.prototypes.splice(index, 1);
    return true;
  },
  
  /**
   * 查找多个原型
   * @param {Object} query - 查询条件
   * @param {Object} options - 查询选项
   * @returns {Promise<Array<Object>>} 原型对象数组
   */
  find: async (query = {}, options = {}) => {
    // 简单实现，实际项目中应该支持更复杂的查询和分页
    return [...inMemoryDb.prototypes];
  }
};

module.exports = {
  prototypes: prototypesCollection
}; 