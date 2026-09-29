/**
 * Tailwind CSS 构建期配置。
 *
 * 主题值与 D-blog（blog.pldduck.com）保持同一套词汇：同名颜色（paper / ink / void）、
 * 同名圆角档位（micro / control / icon / surface / overlay / media）、
 * 同名 z-index 档位、相同的 sans / serif / mono 字体栈。
 * 目的是让两个站点用同一份设计语言书写，而不是各有一套近似但不同名的 token。
 *
 * 明暗：与 D-blog 一致采用「浅色为默认、html.dark 覆盖」的 class 策略，
 * 组件写 `paper 底色 + dark:zinc-900 覆盖`，不依赖 CSS 变量。
 */
export default {
  darkMode: 'class',
  // 扫描范围需覆盖所有可能出现 className 的源文件。
  // 不扫描 config/ 下的 JSON：站点数据由 PagesCMS 可编辑，把 CMS 文本当作类名候选
  // 会让编辑内容直接影响产物 CSS。装饰色一律走语义 key + App.tsx 的 ACCENT_CLASS 字面量，
  // 弹幕颜色走内联 style，两者都不需要 JSON 扫描。
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        paper: '#f2f0e9',
        ink: '#1c1917',
        void: '#0a0a0a',
      },
      fontFamily: {
        // 与 D-blog 同源：中文阅读优先系统最优无衬线，不加载 Inter。
        sans: [
          '"Microsoft YaHei"',
          '"PingFang SC"',
          '"HarmonyOS Sans SC"',
          '"MiSans"',
          '"Alibaba PuHuiTi"',
          '"Noto Sans SC"',
          '"Source Han Sans SC"',
          '"Noto Sans CJK SC"',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          '"Plus Jakarta Sans"',
          '"Noto Sans"',
          'sans-serif',
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          '"Noto Color Emoji"',
        ],
        // 衬线：Playfair Display 随站点异步加载，中文回退思源宋体/宋体。
        serif: [
          '"Playfair Display"',
          '"Noto Serif SC"',
          '"Source Han Serif SC"',
          '"Source Han Serif CN"',
          '"Songti SC"',
          '"STSong"',
          '"Microsoft YaHei"',
          '"SimSun"',
          '"Times New Roman"',
          'Times',
          'serif',
        ],
        mono: [
          '"JetBrains Mono"',
          '"Fira Code"',
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Monaco',
          'Consolas',
          '"Liberation Mono"',
          '"Courier New"',
          'monospace',
        ],
        // D的世界自有品牌字（站名 / 加载屏），D-blog 无对应物，属刻意保留的个性位。
        brand: ['"ZCOOL KuaiLe"', 'cursive'],
      },
      borderRadius: {
        micro: '4px',
        control: '6px',
        icon: '8px',
        surface: '8px',
        overlay: '12px',
        media: '8px',
      },
      zIndex: {
        floating: '40',
        nav: '50',
        'nav-panel': '85',
        popover: '70',
        modal: '100',
        nested: '110',
        viewer: '120',
      },
      maxWidth: {
        // D-blog 正文栏宽度 46rem；引导页信息密度更高，沿用其更宽的容器档位。
        page: '64rem',
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
  plugins: [],
};
