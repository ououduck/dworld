import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  // 使用相对资源路径，避免站点被部署到子目录时出现静态资源 404。
  base: './', 
  resolve: {
    alias: {
      // 与 TypeScript 路径别名保持一致，减少导入路径在开发和构建阶段的不一致。
      '@': path.resolve(__dirname, './'),
    },
  },
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  build: {
    // 显式固定输出目录，便于部署脚本和托管平台约定产物位置。
    outDir: 'dist',
    // 当前项目未依赖线上调试 sourcemap，关闭后可减少构建产物体积。
    sourcemap: false,
  },
});
