import axios from 'axios';

// API基础URL，实际项目中通常从环境变量获取
const API_BASE_URL = 'http://localhost:3000/api';

/**
 * 上传文件夹到服务器
 * @param files 要上传的文件列表
 * @param onProgress 进度回调函数
 * @returns 上传结果
 */
export const uploadPrototype = async (
  files: FileList,
  onProgress?: (percent: number) => void
): Promise<{ success: boolean; id?: string; name?: string; path?: string; message?: string }> => {
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
    Array.from(files).forEach(file => {
      // 使用完整的webkitRelativePath作为文件标识符
      // 这样后端可以恢复完整的文件目录结构
      if (file.webkitRelativePath) {
        formData.append('files', file, encodeURIComponent(file.webkitRelativePath));
      } else {
        // 如果不存在相对路径，则使用文件名
        formData.append('files', file, encodeURIComponent(file.name));
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
    
    return {
      success: true,
      name: prototypeName,
      ...response.data.data,
      message: response.data.message,
    };
  } catch (error) {
    console.error('上传失败:', error);
    
    // 处理错误响应
    if (axios.isAxiosError(error) && error.response) {
      return {
        success: false,
        message: error.response.data.message || '上传失败',
      };
    }
    
    return {
      success: false,
      message: error instanceof Error ? error.message : '未知错误',
    };
  }
}; 