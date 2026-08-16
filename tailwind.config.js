/**
 * Tailwind CSS 构建期配置。
 * 由原 index.html 内联的 CDN 配置迁移而来，保证迁移前后视觉完全一致；
 * 同时开启构建期类名裁剪，产物仅包含实际用到的样式。
 * 注意：这里只保留实际使用到的主题配置，未使用的动画 / 颜色 / 字体栈已清理，
 * 避免产物中出现永远不会被引用的 CSS。
 */
export default {
  darkMode: 'class',
  // 扫描范围需覆盖所有可能出现 className 的源文件；
  // 包含 config/ 下的 JSON 是因为站点数据中配置了动态颜色类（如 text-blue-400），
  // 这些类名必须出现在扫描文件中，否则会被构建期裁剪掉。
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './*.{js,ts,jsx,tsx}',
    './config/**/*.json',
  ],
  // 跳转卡片颜色由 Pages CMS（config/site.config.json）选择，无法在构建期静态分析，
  // 因此把 .pages.yml 中开放的全部颜色选项加入 safelist，保证任意选项都不会被裁剪。
  safelist: [
    'text-blue-400',
    'text-purple-400',
    'text-green-400',
    'text-yellow-400',
    'text-pink-400',
    'text-cyan-400',
  ],
  theme: {
    extend: {
      fontFamily: {
        // 与 src/index.css 的 body 字体栈保持一致（Inter 优先，加载后无需回退）
        sans: ['Inter', 'SF Pro Display', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        brand: ['Zcool KuaiLe', 'cursive'],
      },
      animation: {
        meteor: 'meteor 5s linear infinite',
      },
      keyframes: {
        meteor: {
          '0%': { transform: 'rotate(215deg) translateX(0)', opacity: '1' },
          '70%': { opacity: '1' },
          '100%': {
            transform: 'rotate(215deg) translateX(-500px)',
            opacity: '0',
          },
        },
      },
    },
  },
};
