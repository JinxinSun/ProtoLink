import React, { useState } from 'react';
import { Input, Button, message } from 'antd';
import { CopyOutlined, CheckOutlined } from '@ant-design/icons';
import './LinkDisplay.css';

interface LinkDisplayProps {
  link: string;
  onPreview?: () => void;
}

const LinkDisplay: React.FC<LinkDisplayProps> = ({ link, onPreview }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(link);
      message.success('链接已复制到剪贴板');
      setCopied(true);
      
      // 重置复制图标状态
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      message.error('复制失败，请手动复制');
      console.error('复制失败:', err);
    }
  };

  return (
    <div className="link-display-container">
      <div className="link-header">
        <span className="link-title">系统已生成可访问链接:</span>
      </div>
      
      <div className="link-content">
        <Input 
          value={link}
          readOnly
          className="link-input"
          addonAfter={
            <Button 
              type="text" 
              icon={copied ? <CheckOutlined /> : <CopyOutlined />} 
              onClick={copyToClipboard}
              className={`copy-button ${copied ? 'copied' : ''}`}
            />
          }
        />
      </div>
      
      <div className="link-actions">
        {onPreview && (
          <Button type="primary" onClick={onPreview}>
            查看预览
          </Button>
        )}
      </div>
    </div>
  );
};

export default LinkDisplay; 