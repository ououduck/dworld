import { useCallback, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { useMediaQuery } from '../src/hooks/useMediaQuery';

type Theme = 'light' | 'dark';

/**
 * 存储键与取值和 D-blog 完全一致：'theme' = 'light' | 'dark'。
 * 区别在于本站默认浅色：index.html 的引导脚本只在显式保存过 'dark' 时才加 html.dark，
 * 不再读取系统偏好。仅显式点击才落盘。
 */
const THEME_STORAGE_KEY = 'theme';

/** 与 index.html 的 theme-color / src/index.css 的明暗底色保持一致。 */
const THEME_COLOR_META_CONTENT: Record<Theme, string> = {
  light: '#f2f0e9',
  dark: '#0a0a0a',
};

/** startViewTransition 尚未进入全部 TS 版本的 DOM lib，局部收窄避免全局 augmentation。 */
type TransitionDocument = Document & {
  startViewTransition?: (callback: () => void) => unknown;
};

/**
 * 明暗切换：与 D-blog 同款控件（44px 方形、rounded-icon、发丝边框、150ms 色彩过渡、
 * Sun/Moon 图标淡入淡出），主题过渡走原生 View Transitions。
 */
export const ThemeToggle = () => {
  // 引导脚本已在 React 挂载前决定 html.dark，这里以 DOM 现状为唯一事实来源初始化，
  // 无需再解析一次存储值（两处解析会随逻辑演进而漂移）。
  const [theme, setTheme] = useState<Theme>(() =>
    document.documentElement.classList.contains('dark') ? 'dark' : 'light',
  );
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  const toggleTheme = useCallback(() => {
    const next: Theme = theme === 'light' ? 'dark' : 'light';
    const root = document.documentElement;

    const applyChanges = () => {
      root.classList.toggle('dark', next === 'dark');
      // 浏览器工具栏取色跟随实际生效的主题，而非系统偏好。
      const meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute('content', THEME_COLOR_META_CONTENT[next]);
    };

    // 不支持 View Transitions 或用户要求减弱动效时直接应用，不做全局 CSS 过渡兜底。
    const startViewTransition = (root.ownerDocument as TransitionDocument).startViewTransition;
    if (!prefersReducedMotion && startViewTransition) {
      try {
        startViewTransition.call(root.ownerDocument, applyChanges);
      } catch {
        // 已有活动中的过渡（快速连点）时按规范同步抛 InvalidStateError：
        // 直接应用主题，避免异常冒泡导致整页崩溃且切换不生效。
        applyChanges();
      }
    } else {
      applyChanges();
    }

    setTheme(next);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // 浏览器存储不可用时，主题持久化为可选能力。
    }
  }, [prefersReducedMotion, theme]);

  const currentThemeLabel = theme === 'light' ? '浅色' : '深色';
  const nextThemeLabel = theme === 'light' ? '深色' : '浅色';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`切换外观主题，当前为${currentThemeLabel}，点击切换为${nextThemeLabel}`}
      className="group relative inline-flex h-11 w-11 items-center justify-center rounded-icon border border-zinc-300 bg-zinc-100 text-ink transition-colors hover:border-zinc-500 hover:bg-zinc-200 active:bg-zinc-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:border-zinc-500 dark:active:bg-zinc-700"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={prefersReducedMotion ? undefined : { opacity: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.15 }}
          className="inline-flex"
        >
          {theme === 'light' ? <Sun size={18} /> : <Moon size={18} />}
        </motion.span>
      </AnimatePresence>
      <span className="pointer-events-none absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded-control border border-zinc-700 bg-black px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
        {currentThemeLabel}
      </span>
    </button>
  );
};
