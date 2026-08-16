import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// 全局样式入口：Tailwind 在构建期编译进产物，替代原 CDN 运行时方案。
import './src/index.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Could not find root element to mount to');
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
