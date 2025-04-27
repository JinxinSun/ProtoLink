import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Button } from 'antd';
import FileUpload from '../../components/Upload';
import { uploadPrototype, UploadResponse } from '../../api/upload';
import LinkDisplay from '../../components/LinkDisplay';
import './index.css';

const HomePage: React.FC = () => {
  const navigate = useNavigate(); 
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResult, setUploadResult] = useState<UploadResponse | null>(null);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [successData, setSuccessData] = useState<{
    id: string;
    name: string;
    shortLink: string;
    isOverwrite?: boolean;
  } | null>(null);

  // 测试按钮 - 直接导航到成功页面
  const testNavigateToSuccess = () => {
    const testData = {
      id: 'test-id',
      name: '测试原型',
      shortLink: '123456',
      isOverwrite: false
    };
    setSuccessData(testData);
    setSuccessModalVisible(true);
  };

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
      
      // 上传成功后显示成功弹框
      if (result && result.id) {
        console.log('上传成功，准备显示成功弹框:', {
          id: result.id,
          name: result.name,
          shortLink: result.short_link,
          isOverwrite: result.is_overwrite
        });
        
        // 设置成功数据并显示弹框
        setSuccessData({
          id: result.id || 'unknown-id',
          name: result.name || '未命名原型',
          shortLink: result.short_link || '123456',
          isOverwrite: !!result.is_overwrite
        });
        setSuccessModalVisible(true);
      }
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

  // 处理预览按钮点击
  const handlePreview = () => {
    if (successData && successData.shortLink) {
      window.open(`/preview/${successData.shortLink}`, '_blank');
    }
  };
  
  // 处理原型管理按钮点击
  const handleManagement = () => {
    navigate('/management');
  };

  // 关闭成功弹框
  const closeSuccessModal = () => {
    setSuccessModalVisible(false);
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
          
          {uploadResult && !uploadResult.id && (
            <div className={`upload-result ${uploadResult.success ? 'success' : 'error'}`}>
              <p>{uploadResult.message}</p>
            </div>
          )}
        </div>
      </main>
      
      <footer className="home-footer">
        <p>ProtoLink © 2023 - 轻量级原型托管平台</p>
      </footer>

      {/* 上传成功弹框 */}
      <Modal
        title={null}
        open={successModalVisible}
        onCancel={closeSuccessModal}
        footer={null}
        width={550}
        centered
        className="success-modal"
        maskClosable={false}
      >
        {successData && (
          <div className="success-modal-content">
            <div className="success-header">
              <span className="success-icon">🎉</span>
              <h3>上传成功！</h3>
            </div>
            
            <div className="success-body">
              <p className="link-label">系统已生成可访问链接：</p>
              
              <div className="link-container">
                <input 
                  type="text" 
                  value={`${window.location.origin}/preview/${successData.shortLink}`}
                  readOnly
                  className="link-input"
                />
                <button 
                  className="copy-button"
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/preview/${successData.shortLink}`);
                    alert('链接已复制到剪贴板');
                  }}
                >
                  复制
                </button>
              </div>
              
              <div className="action-buttons">
                <button className="preview-button" onClick={handlePreview}>
                  查看预览
                </button>
                <button className="management-button" onClick={handleManagement}>
                  原型管理
                </button>
                <button className="return-button" onClick={closeSuccessModal}>
                  返回首页
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default HomePage; 