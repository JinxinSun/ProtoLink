import React, { useState, useRef, DragEvent, ChangeEvent } from 'react';
import './FileUpload.css';

// 引用已经在全局types中定义的扩展HTMLInputElement

interface FileUploadProps {
  onFilesSelected: (files: FileList | null) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFilesSelected }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.items) {
      // 检查是否包含目录
      const containsDirectory = Array.from(e.dataTransfer.items).some(
        item => item.webkitGetAsEntry()?.isDirectory
      );
      
      if (containsDirectory) {
        onFilesSelected(e.dataTransfer.files);
      } else {
        alert('请上传包含 Axure HTML 的文件夹');
      }
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFilesSelected(files);
    }
  };

  const handleSelectClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="file-upload-container">
      <div 
        className={`upload-area ${isDragging ? 'dragging' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleSelectClick}
      >
        <div className="upload-icon">
          <svg viewBox="0 0 24 24" width="48" height="48" stroke="currentColor" strokeWidth="1" fill="none">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="17 8 12 3 7 8"></polyline>
            <line x1="12" y1="3" x2="12" y2="15"></line>
          </svg>
        </div>
        <h3>将 Axure HTML 文件夹拖拽到此处</h3>
        <p>或点击选择文件夹</p>
        
        {/* @ts-ignore - directory和webkitdirectory属性在标准类型定义中不存在 */}
        <input 
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="file-input"
          directory=""
          webkitdirectory=""
        />
      </div>
    </div>
  );
};

export default FileUpload; 