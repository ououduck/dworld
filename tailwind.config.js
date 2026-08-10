/**
 * Tailwind CSS 构建期配置。
 * 由原 index.html 内联的 CDN 配置原样迁移而来，保证迁移前后视觉完全一致；
 * 同时开启构建期类名裁剪，产物仅包含实际用到的样式。
 */
export default {
  darkMode: 'class',
  // 扫描范围需覆盖所有可能出现 className 的源文件；
  // 包含 config.ts 是因为其内部以字符串形式配置了动态颜色类（如 text-blue-400）。
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#050505',
        surface: '#121212',
        'surface-highlight': '#1E1E1E',
      },
      fontFamily: {
        sans: ['SF Pro Display', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        display: ['Outfit', 'sans-serif'],
        brand: ['Zcool KuaiLe', 'cursive'],
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-out forwards',
        'slide-up': 'slideUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards',
        'meteor': 'meteor 5s linear infinite',
        'text-shimmer': 'text-shimmer 2.5s ease-out infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        meteor: {
          '0%': { transform: 'rotate(215deg) translateX(0)', opacity: '1' },
          '70%': { opacity: '1' },
          '100%': {
            transform: 'rotate(215deg) translateX(-500px)',
            opacity: '0',
          },
        },
        'text-shimmer': {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '100% 50%' },
        },
      },
    },
  },
};
