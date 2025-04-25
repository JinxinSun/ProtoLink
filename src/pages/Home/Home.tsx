import React, { useState, useEffect } from 'react';
import { Card, Typography, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { FileUploader, UploadSuccess } from '../../components/Upload';
import './Home.css';

const { Title } = Typography;

interface UploadResult {
  id: string;
  shortLink: string;
  name: string;
  isOverwrite?: boolean;
}

const Home: React.FC = () => {
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const navigate = useNavigate();

  const handleUploadSuccess = (result: UploadResult) => {
    console.log('上传成功，结果：', result);
    // 确保结果包含所有必要字段
    if (!result.id || !result.shortLink || !result.name) {
      console.error('上传结果数据不完整:', result);
      message.error('上传成功但返回数据不完整');
      return;
    }
    
    // 设置上传结果状态
    setUploadResult(result);
    
    // 显示成功消息
    message.success(`原型"${result.name}"上传成功！`);
  };

  // 用于调试 - 检查状态是否正确设置
  useEffect(() => {
    if (uploadResult) {
      console.log('上传结果状态已更新:', uploadResult);
    }
  }, [uploadResult]);

  const handleUploadFail = (error: Error) => {
    console.error('上传失败:', error);
    message.error(`上传失败: ${error.message}`);
  };

  const handlePreview = () => {
    if (uploadResult) {
      navigate(`/preview/${uploadResult.id}`);
    }
  };

  return (
    <div className="home-container">
      <Card className="upload-card">
        <Title level={3} className="card-title">原型文件上传</Title>
        
        <FileUploader 
          onUploadSuccess={handleUploadSuccess}
          onUploadFail={handleUploadFail}
          maxSize={100} // 最大100MB
        />
        
        {uploadResult && (
          <UploadSuccess
            name={uploadResult.name}
            link={`${window.location.origin}/prototype/${uploadResult.shortLink}`}
            isOverwrite={uploadResult.isOverwrite}
            onPreview={handlePreview}
          />
        )}
      </Card>
    </div>
  );
};

export default Home; 