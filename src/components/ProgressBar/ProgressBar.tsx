import React from 'react';
import { Progress } from 'antd';
import './ProgressBar.css';

interface ProgressBarProps {
  percent: number;
  status?: 'success' | 'exception' | 'active' | 'normal';
  fileName?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  percent, 
  status = 'normal',
  fileName 
}) => {
  return (
    <div className="progress-container">
      {fileName && <div className="file-name">{fileName}</div>}
      <Progress 
        percent={percent} 
        status={status}
        showInfo={true}
      />
    </div>
  );
};

export default ProgressBar; 