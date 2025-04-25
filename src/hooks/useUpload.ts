import { useState } from 'react';
import { uploadPrototype, UploadResponse } from '../api/upload';

export interface UploadResult {
  id: string;
  shortLink: string; 
  name: string;
  isOverwrite?: boolean;
}

interface UploadOptions {
  onSuccess?: (result: UploadResult) => void;
  onError?: (error: Error) => void;
}

export interface UploadStatus {
  uploading: boolean;
  progress: number;
  error: Error | null;
  result: UploadResult | null;
  status: 'idle' | 'uploading' | 'success' | 'error';
}

const useUpload = (options?: UploadOptions) => {
  const [status, setStatus] = useState<UploadStatus>({
    uploading: false,
    progress: 0,
    error: null,
    result: null,
    status: 'idle'
  });

  const upload = async (files: File[] | FileList) => {
    if (!files.length) {
      return;
    }

    setStatus({
      uploading: true,
      progress: 0,
      error: null,
      result: null,
      status: 'uploading'
    });

    try {
      // 使用API进行上传
      const apiResult = await uploadPrototype(
        Array.from(files), 
        (progress) => {
          setStatus(prev => ({
            ...prev,
            progress
          }));
        }
      );
      
      // 处理API返回结果
      console.log('API上传成功，结果:', apiResult);
      
      // 转换为内部使用的结果格式
      const result: UploadResult = {
        id: apiResult.id,
        name: apiResult.name,
        shortLink: apiResult.shortLink,
        isOverwrite: apiResult.isOverwrite
      };
      
      setStatus({
        uploading: false,
        progress: 100,
        error: null,
        result,
        status: 'success'
      });

      if (options?.onSuccess) {
        console.log('调用onSuccess回调，数据:', result);
        options.onSuccess(result);
      }

      return result;
    } catch (error) {
      console.error('上传过程出错:', error);
      const err = error instanceof Error ? error : new Error('上传失败');
      
      setStatus({
        uploading: false,
        progress: 0,
        error: err,
        result: null,
        status: 'error'
      });

      if (options?.onError) {
        options.onError(err);
      }

      throw err;
    }
  };

  const reset = () => {
    setStatus({
      uploading: false,
      progress: 0,
      error: null,
      result: null,
      status: 'idle'
    });
  };

  return { 
    upload, 
    reset,
    ...status 
  };
};

export default useUpload; 