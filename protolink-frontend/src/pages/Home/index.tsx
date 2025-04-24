import React, { useState } from 'react';
import FileUpload from '../../components/Upload';
import { uploadPrototype } from '../../api/upload';
import './index.css';

const HomePage: React.FC = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResult, setUploadResult] = useState<{
    success: boolean;
    id?: string;
    name?: string;
    path?: string;
    message?: string;
  } | null>(null);

  const handleFilesSelected = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    console.log('已选择文件夹:', files.length, '个文件');
    setIsUploading(true);
    setUploadProgress(0);
    setUploadResult(null);
    
    try {
      // 调用API上传文件
      const result = await uploadPrototype(files, (progress) => {
        setUploadProgress(progress);
      });
      
      // 处理上传结果
      setUploadResult(result);
      console.log('上传结果:', result);
    } catch (error) {
      console.error('上传过程出错:', error);
      setUploadResult({
        success: false,
        message: error instanceof Error ? error.message : '上传过程发生未知错误'
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="home-container">
      <header className="home-header">
        <h1>ProtoLink</h1>
        <p>轻松上传和分享 Axure 原型</p>
      </header>
      
      <main className="home-main">
        <div className="upload-section">
          <h2>上传原型</h2>
          <p>上传您的 Axure HTML 文件夹生成分享链接</p>
          
          <FileUpload onFilesSelected={handleFilesSelected} />
          
          {isUploading && (
            <div className="upload-status">
              <p>文件上传中...</p>
              <div className="upload-progress">
                <div 
                  className="upload-progress-bar"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="upload-percent">{uploadProgress}%</p>
            </div>
          )}
          
          {uploadResult && (
            <div className={`upload-result ${uploadResult.success ? 'success' : 'error'}`}>
              <p>{uploadResult.message}</p>
              {uploadResult.success && uploadResult.id && (
                <div className="upload-info">
                  <p>原型名称: {uploadResult.name || '未命名原型'}</p>
                  <p>原型ID: {uploadResult.id}</p>
                  {/* 短链接展示组件将在 TASK-2-2 中添加 */}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      
      <footer className="home-footer">
        <p>ProtoLink © 2023 - 轻量级原型托管平台</p>
      </footer>
    </div>
  );
};

export default HomePage; 