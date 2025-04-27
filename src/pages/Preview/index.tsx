import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Spin, Button, message } from 'antd';
import { FullscreenOutlined, FullscreenExitOutlined } from '@ant-design/icons';
import axios from 'axios';
import './styles.css';

// 定义页面组件传入参数接口
interface PreviewPageParams {
  shortLink?: string;
}

// 定义从API获取的原型数据接口
interface PrototypeData {
  id: string;
  name: string;
  path: string;
}

/**
 * 原型预览页面组件
 * 通过iframe加载上传的HTML原型文件
 */
const PreviewPage: React.FC = () => {
  // 获取路由参数中的shortLink
  const { shortLink } = useParams<PreviewPageParams>();
  
  // 状态管理
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [prototypeData, setPrototypeData] = useState<PrototypeData | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  
  // iframe引用
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // 获取原型数据
  useEffect(() => {
    const fetchPrototypeData = async () => {
      if (!shortLink) {
        setError('无效的访问链接');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // 通过API获取原型信息
        const response = await axios.get(`/api/prototype/link/${shortLink}`);
        
        if (response.data && response.data.data) {
          setPrototypeData(response.data.data);
        } else {
          setError('找不到请求的原型');
        }
      } catch (err) {
        console.error('获取原型数据失败:', err);
        setError('获取原型数据失败，请检查链接是否有效');
      } finally {
        setLoading(false);
      }
    };

    fetchPrototypeData();
  }, [shortLink]);

  // iframe加载事件处理
  const handleIframeLoad = () => {
    setLoading(false);
  };

  // iframe加载错误处理
  const handleIframeError = () => {
    setLoading(false);
    setError('原型加载失败，请检查原型文件是否完整');
  };

  // 切换全屏模式
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      if (iframeRef.current && iframeRef.current.requestFullscreen) {
        iframeRef.current.requestFullscreen()
          .then(() => setIsFullscreen(true))
          .catch(err => {
            message.error('无法进入全屏模式: ' + err.message);
          });
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
          .then(() => setIsFullscreen(false))
          .catch(err => {
            message.error('无法退出全屏模式: ' + err.message);
          });
      }
    }
  };

  // 监听fullscreenchange事件
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // 根据加载状态和错误状态渲染不同内容
  return (
    <div className="prototype-preview-container">
      {/* 标题区域 */}
      <div className="preview-header">
        <h1>{prototypeData?.name || '原型预览'}</h1>
        <Button
          icon={isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
          onClick={toggleFullscreen}
          title={isFullscreen ? '退出全屏' : '全屏预览'}
        >
          {isFullscreen ? '退出全屏' : '全屏预览'}
        </Button>
      </div>

      {/* 加载状态 */}
      {loading && (
        <div className="loading-container">
          <Spin size="large" tip="正在加载原型..." />
        </div>
      )}

      {/* 错误状态 */}
      {error && (
        <div className="error-container">
          <p className="error-message">{error}</p>
        </div>
      )}

      {/* iframe预览区域 */}
      {prototypeData && (
        <div className="iframe-container">
          <iframe
            ref={iframeRef}
            src={`/prototypes/${prototypeData.path}/index.html`}
            onLoad={handleIframeLoad}
            onError={handleIframeError}
            title={prototypeData.name}
            sandbox="allow-scripts allow-same-origin allow-forms"
            className="prototype-iframe"
          />
        </div>
      )}
    </div>
  );
};

export default PreviewPage;