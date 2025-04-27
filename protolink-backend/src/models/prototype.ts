import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';

/**
 * 原型数据模型
 * 管理原型的元数据和存储位置
 */
class PrototypeModel {
  private prototypesData: Map<string, PrototypeItem>;
  private dataFilePath: string;
  
  constructor() {
    this.prototypesData = new Map();
    // 数据文件存储路径
    this.dataFilePath = path.join(process.cwd(), 'data', 'prototypes.json');
    this.loadData();
  }
  
  /**
   * 加载原型数据
   */
  private loadData(): void {
    try {
      // 确保目录存在
      const dataDir = path.dirname(this.dataFilePath);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      
      // 读取数据文件
      if (fs.existsSync(this.dataFilePath)) {
        const data = fs.readFileSync(this.dataFilePath, 'utf8');
        const prototypes = JSON.parse(data) as PrototypeItem[];
        
        // 将数据转换为Map结构
        prototypes.forEach(prototype => {
          this.prototypesData.set(prototype.id, prototype);
        });
        
        console.log(`已加载 ${prototypes.length} 个原型记录`);
      } else {
        // 文件不存在，创建空数据文件
        this.saveData();
        console.log('创建了新的原型数据文件');
      }
    } catch (error) {
      console.error('加载原型数据失败:', error);
    }
  }
  
  /**
   * 保存原型数据到文件
   */
  private saveData(): void {
    try {
      const data = JSON.stringify(Array.from(this.prototypesData.values()), null, 2);
      fs.writeFileSync(this.dataFilePath, data, 'utf8');
    } catch (error) {
      console.error('保存原型数据失败:', error);
    }
  }
  
  /**
   * 创建新原型记录
   * @param prototype 原型信息
   * @returns 创建的原型
   */
  createPrototype(prototype: Omit<PrototypeItem, 'id' | 'created_at' | 'updated_at'>): PrototypeItem {
    const id = uuidv4();
    const now = new Date().toISOString();
    
    const newPrototype: PrototypeItem = {
      id,
      ...prototype,
      created_at: now,
      updated_at: now
    };
    
    this.prototypesData.set(id, newPrototype);
    this.saveData();
    
    return newPrototype;
  }
  
  /**
   * 通过ID获取原型
   * @param id 原型ID
   * @returns 原型信息
   */
  getPrototypeById(id: string): PrototypeItem | null {
    return this.prototypesData.get(id) || null;
  }
  
  /**
   * 通过短链接获取原型
   * @param shortLink 短链接
   * @returns 原型信息
   */
  getPrototypeByShortLink(shortLink: string): PrototypeItem | null {
    for (const prototype of this.prototypesData.values()) {
      if (prototype.short_link === shortLink) {
        return prototype;
      }
    }
    return null;
  }
  
  /**
   * 通过名称查找原型
   * @param name 原型名称
   * @returns 原型信息
   */
  getPrototypeByName(name: string): PrototypeItem | null {
    for (const prototype of this.prototypesData.values()) {
      if (prototype.name === name) {
        return prototype;
      }
    }
    return null;
  }
  
  /**
   * 更新原型记录
   * @param id 原型ID
   * @param updates 更新内容
   * @returns 更新后的原型
   */
  updatePrototype(id: string, updates: Partial<Omit<PrototypeItem, 'id' | 'created_at'>>): PrototypeItem | null {
    const prototype = this.getPrototypeById(id);
    if (!prototype) {
      return null;
    }
    
    const updatedPrototype = {
      ...prototype,
      ...updates,
      updated_at: new Date().toISOString()
    };
    
    this.prototypesData.set(id, updatedPrototype);
    this.saveData();
    
    return updatedPrototype;
  }
  
  /**
   * 删除原型
   * @param id 原型ID
   * @returns 是否成功删除
   */
  deletePrototype(id: string): boolean {
    const success = this.prototypesData.delete(id);
    if (success) {
      this.saveData();
    }
    return success;
  }
  
  /**
   * 获取所有原型
   * @returns 原型列表
   */
  getAllPrototypes(): PrototypeItem[] {
    return Array.from(this.prototypesData.values());
  }

  /**
   * 分页获取原型列表
   * @param page 页码，从1开始
   * @param pageSize 每页数量
   * @returns 分页结果
   */
  listPrototypes(page: number = 1, pageSize: number = 10): { items: PrototypeItem[], total: number } {
    const allPrototypes = this.getAllPrototypes();
    // 按创建时间降序排列
    allPrototypes.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    
    const total = allPrototypes.length;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const items = allPrototypes.slice(start, end);
    
    return { items, total };
  }
}

/**
 * 原型数据结构
 */
export interface PrototypeItem {
  id: string;
  name: string;
  file_path: string;
  short_link?: string;
  created_at: string;
  updated_at: string;
  metadata?: Record<string, any>;
}

export default new PrototypeModel(); 