import React, { useRef, useState } from 'react';
import { Upload, Button, message, Alert } from 'antd';
import { UploadOutlined, InboxOutlined } from '@ant-design/icons';
import useUpload from '../../hooks/useUpload';
import ProgressBar from '../ProgressBar/ProgressBar';
import './FileUploader.css';

interface FileUploaderProps {
  onUploadSuccess?: (result: { id: string, shortLink: string, name: string, isOverwrite?: boolean }) => void;
  onUploadFail?: (error: Error) => void;
  maxSize?: number; // 最大上传大小(MB)
}

const FileUploader: React.FC<FileUploaderProps> = ({
  onUploadSuccess,
  onUploadFail,
  maxSize = 100 // 默认100MB
}) => {
  const uploadRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  
  const { 
    upload, 
    reset,
    uploading, 
    progress, 
    status, 
    error 
  } = useUpload({
    onSuccess: (result) => {
      console.log('上传成功，获取到结果:', result);
      message.success(`原型"${result.name}"上传成功！`);
      setSelectedFiles([]);
      if (onUploadSuccess) {
        console.log('调用父组件onUploadSuccess回调:', result);
        onUploadSuccess(result);
      }
    },
    onError: (err) => {
      message.error(`上传失败: ${err.message}`);
      if (onUploadFail) {
        onUploadFail(err);
      }
    }
  });

  const handleSelectFile = () => {
    if (uploadRef.current) {
      uploadRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileArray = Array.from(files);
      setSelectedFiles(fileArray);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    
    if (e.dataTransfer.items) {
      const items = e.dataTransfer.items;
      const fileArray: File[] = [];
      
      for (let i = 0; i < items.length; i++) {
        if (items[i].kind === 'file') {
          const file = items[i].getAsFile();
          if (file) fileArray.push(file);
        }
      }
      
      if (fileArray.length > 0) {
        setSelectedFiles(fileArray);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      message.warning('请先选择要上传的文件！');
      return;
    }

    try {
      await upload(selectedFiles);
    } catch (err) {
      // 错误已在useUpload中处理
      console.error('上传处理出错:', err);
    }
  };

  const getUploadStatus = () => {
    switch (status) {
      case 'uploading':
        return 'active';
      case 'success':
        return 'success';
      case 'error':
        return 'exception';
      default:
        return 'normal';
    }
  };

  return (
    <div className="file-uploader">
      <div
        className={`upload-area ${dragOver ? 'drag-over' : ''}`}
        onClick={handleSelectFile}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          ref={uploadRef}
          type="file"
          webkitdirectory="true"
          directory="true"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        <InboxOutlined className="upload-icon" />
        <p className="upload-text">将 Axure HTML 文件夹拖到此处，或点击选择</p>
        <p className="upload-hint">支持 Axure 生成的 HTML 文件夹</p>
      </div>

      {selectedFiles.length > 0 && (
        <div className="file-list">
          <p>已选择 {selectedFiles.length} 个文件</p>
          {selectedFiles.slice(0, 3).map((file, index) => (
            <div key={index} className="file-item">
              {file.name}
            </div>
          ))}
          {selectedFiles.length > 3 && (
            <div className="file-item">...等 {selectedFiles.length - 3} 个文件</div>
          )}
        </div>
      )}

      {error && (
        <Alert
          message="上传失败"
          description={error.message}
          type="error"
          showIcon
          closable
          className="error-alert"
        />
      )}

      {(uploading || progress > 0) && (
        <ProgressBar
          percent={progress}
          status={getUploadStatus()}
          fileName={selectedFiles.length > 0 ? `上传中 (${selectedFiles.length} 个文件)` : undefined}
        />
      )}

      <div className="upload-actions">
        <Button
          type="primary"
          onClick={handleUpload}
          loading={uploading}
          disabled={selectedFiles.length === 0 || uploading}
        >
          {uploading ? '上传中...' : '开始上传'}
        </Button>
        <Button
          onClick={() => {
            setSelectedFiles([]);
            reset();
          }}
          disabled={uploading}
        >
          取消
        </Button>
      </div>
    </div>
  );
};

export default FileUploader; 