import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage, SuccessPage } from './pages';
import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/success" element={<SuccessPage />} />
          {/* 其他路由将在后续任务中添加 */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
