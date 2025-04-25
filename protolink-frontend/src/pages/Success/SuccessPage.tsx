import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Result } from 'antd';
import LinkDisplay from '../../components/LinkDisplay';
import './SuccessPage.css';

interface LocationState {
  id: string;
  name: string;
  shortLink: string;
  isOverwrite?: boolean;
}

const SuccessPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState;

  useEffect(() => {
    console.log('Success页面状态:', location.state);
  }, [location.state]);

  // 如果没有获取到状态，使用演示数据
  if (!state || !state.shortLink) {
    console.warn('未检测到上传状态数据，使用演示数据');
    
    // 使用示例数据而不是立即跳转，便于调试
    const demoLink = `${window.location.origin}/p/123456`;
    
    return (
      <div className="success-page">
        <Result
          status="success"
          title="上传成功!"
          subTitle="您的原型已成功上传"
        />
        
        <div className="success-content">
          <LinkDisplay link={demoLink} onPreview={() => window.open(demoLink, '_blank')} />
          
          <div className="action-buttons">
            <Button onClick={() => navigate('/')}>返回首页</Button>
            <Button type="primary" onClick={() => window.open(demoLink, '_blank')}>
              查看预览
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // 生成完整访问链接
  const fullLink = `${window.location.origin}/p/${state.shortLink}`;

  // 处理预览按钮点击
  const handlePreview = () => {
    window.open(`/p/${state.shortLink}`, '_blank');
  };

  // 返回首页
  const handleBackHome = () => {
    navigate('/');
  };

  return (
    <div className="success-page">
      <Result
        status="success"
        title="上传成功!"
        subTitle={`您的原型「${state.name || '未命名原型'}」已成功上传${state.isOverwrite ? '并覆盖了同名原型' : ''}`}
      />
      
      <div className="success-content">
        <LinkDisplay link={fullLink} onPreview={handlePreview} />
        
        <div className="action-buttons">
          <Button onClick={handleBackHome}>返回首页</Button>
          <Button type="primary" onClick={handlePreview}>
            查看预览
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage; 