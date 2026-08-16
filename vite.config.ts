import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // loadEnv 合并 .env* 文件与进程环境变量中 VITE_ 前缀的键（.env 文件不会自动注入 process.env，
  // 直接读 process.env.VITE_BASE_PATH 会静默失效），详见 vite 源码 loadEnv 实现。
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [react()],
    // 使用相对资源路径，避免站点被部署到子目录时出现静态资源 404；
    // 也可通过环境变量 VITE_BASE_PATH 覆盖（见 .env.example），例如 GitHub Pages 的 /repo/。
    base: env.VITE_BASE_PATH || './',
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    build: {
      // 显式固定输出目录，便于部署脚本和托管平台约定产物位置。
      outDir: 'dist',
      // 当前项目未依赖线上调试 sourcemap，关闭后可减少构建产物体积。
      sourcemap: false,
      rollupOptions: {
        output: {
          // 将体积大且更新频率低的第三方库拆成独立 chunk：
          // 依赖升级时只有对应 vendor chunk 失效，主包与应用 chunk 可复用浏览器缓存。
          manualChunks: {
            'vendor-motion': ['framer-motion'],
            'vendor-icons': ['lucide-react'],
          },
        },
      },
    },
  };
});
