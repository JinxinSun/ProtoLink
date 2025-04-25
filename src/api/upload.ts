import axios from 'axios';

// API基础URL
const API_BASE_URL = '/api';

/**
 * 上传响应数据结构
 */
export interface UploadResponse {
  id: string;
  name: string;
  shortLink: string;
  isOverwrite?: boolean;
  path?: string;
  message?: string;
}

/**
 * 上传原型文件到服务器
 * @param files 要上传的文件列表
 * @param onProgress 进度回调函数
 * @returns 上传结果
 */
export const uploadPrototype = async (
  files: File[],
  onProgress?: (percent: number) => void
): Promise<UploadResponse> => {
  try {
    // 创建FormData对象
    const formData = new FormData();
    
    // 提取原型名称（从第一个文件的相对路径获取顶级目录名）
    let prototypeName = '未命名原型';
    if (files.length > 0 && files[0].webkitRelativePath) {
      const pathParts = files[0].webkitRelativePath.split('/');
      if (pathParts.length > 0) {
        prototypeName = pathParts[0];
        formData.append('name', prototypeName);
      }
    }
    
    // 添加所有文件到FormData
    files.forEach(file => {
      // 使用完整的webkitRelativePath作为文件标识符
      // 这样后端可以恢复完整的文件目录结构
      if (file.webkitRelativePath) {
        formData.append('files', file, file.webkitRelativePath);
      } else {
        // 如果不存在相对路径，则使用文件名
        formData.append('files', file, file.name);
      }
    });
    
    // 发送上传请求
    const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          // 计算上传进度百分比
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(percentCompleted);
        }
      },
    });
    
    // 处理响应数据
    console.log('上传响应数据:', response.data);
    
    if (response.data.data) {
      // 适配服务器返回格式 {success, message, data: {id, name, short_link, ...}}
      return {
        id: response.data.data.id,
        name: response.data.data.name || prototypeName,
        shortLink: response.data.data.short_link,
        isOverwrite: response.data.data.is_overwrite,
        path: response.data.data.path,
        message: response.data.message
      };
    }
    
    // 假设是直接返回的数据格式
    return {
      id: response.data.id,
      name: response.data.name || prototypeName,
      shortLink: response.data.shortLink || response.data.short_link,
      isOverwrite: response.data.isOverwrite || response.data.is_overwrite,
      message: response.data.message
    };
  } catch (error) {
    console.error('上传失败:', error);
    throw error;
  }
}; 