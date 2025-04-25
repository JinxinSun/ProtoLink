import React from 'react';
import { Alert, Space } from 'antd';
import LinkDisplay from '../LinkDisplay';
import './UploadSuccess.css';

interface UploadSuccessProps {
  name: string;
  link: string;
  isOverwrite?: boolean;
  onPreview?: () => void;
}

const UploadSuccess: React.FC<UploadSuccessProps> = ({
  name,
  link,
  isOverwrite = false,
  onPreview
}) => {
  return (
    <div className="upload-success-container">
      <Alert
        message={isOverwrite ? "原型覆盖上传成功！" : "原型上传成功！"}
        description={`原型「${name}」已${isOverwrite ? '覆盖' : ''}上传成功，可通过以下链接访问`}
        type="success"
        showIcon
        className="success-alert"
      />
      
      <Space direction="vertical" className="upload-info">
        <LinkDisplay 
          link={link} 
          onPreview={onPreview} 
        />
      </Space>
    </div>
  );
};

export default UploadSuccess; 