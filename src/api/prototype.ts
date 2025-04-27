import axios from 'axios';

// API基础URL
const API_BASE_URL = '/api';

/**
 * 原型数据接口
 */
export interface PrototypeData {
  id: string;
  name: string;
  path: string;
  shortLink: string;
  createdAt?: string;
}

/**
 * 通过短链接获取原型信息
 * @param shortLink 短链接
 * @returns 原型数据
 */
export const getPrototypeByShortLink = async (shortLink: string): Promise<PrototypeData> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/prototype/link/${shortLink}`);
    
    if (response.data && response.data.success && response.data.data) {
      return {
        id: response.data.data.id,
        name: response.data.data.name,
        path: response.data.data.path,
        shortLink: response.data.data.short_link || shortLink,
        createdAt: response.data.data.created_at
      };
    }
    
    throw new Error(response.data.message || '获取原型数据失败');
  } catch (error) {
    console.error('获取原型数据失败:', error);
    throw error;
  }
};

/**
 * 获取原型列表（预留，用于原型管理功能）
 * @param page 页码
 * @param pageSize 每页数量
 * @returns 原型列表和总数
 */
export const getPrototypeList = async (
  page: number = 1,
  pageSize: number = 10
): Promise<{ items: PrototypeData[], total: number }> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/prototype/list`, {
      params: { page, pageSize }
    });
    
    if (response.data && response.data.success && response.data.data) {
      return {
        items: response.data.data.items.map((item: any) => ({
          id: item.id,
          name: item.name,
          path: item.path,
          shortLink: item.short_link,
          createdAt: item.created_at
        })),
        total: response.data.data.total
      };
    }
    
    return { items: [], total: 0 };
  } catch (error) {
    console.error('获取原型列表失败:', error);
    return { items: [], total: 0 };
  }
}; 