import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { PixelDuckSvg } from './Icons';
import { useMediaQuery } from '../src/hooks/useMediaQuery';

// 加载屏「同会话跳过」标记的存储键：二次访问直接进首页，避免重复等待。
export const LOADING_SKIP_KEY = 'dworld-loading-skipped';

/**
 * 启动页：短暂进度动画延后首屏内容出现，减少资源加载与动效初始化时的突兀感。
 * - 同一会话内二次访问直接跳过（sessionStorage 标记，判断已前移到 App 的 loading 初始值，
 *   本组件被渲染时一定是首次访问，不会播放一次无意义的退出动画）；
 * - 系统开启「减少动态效果」时不做逐帧进度，直接加速完成。
 * - 配色沿用 D-blog 的编辑部语言：纸面/void 底、zinc 进度槽、反相主色进度条
 *   （浅色深条、深色浅条），品牌字 ZCOOL KuaiLe 仅用于百分比数字这一处个性位。
 */
export const LoadingScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [percent, setPercent] = useState(0);
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  // 进度保存在 ref：useMediaQuery 实时监听偏好变化时 effect 会重跑，
  // 用 ref 续接进度可避免播放中途切换偏好导致进度归零。
  const currentRef = useRef(0);

  useEffect(() => {
    let completeTimeout: ReturnType<typeof setTimeout> | null = null;

    // 开启减少动态效果时用大步长快速完成，避免无意义的花式动画。
    const step = () => (reducedMotion ? 33 : Math.floor(Math.random() * 10) + 5);

    // 副作用（clearInterval / setTimeout）全部放在 setState 之外，updater 保持纯函数：
    // React 19 StrictMode 会双调用 updater，避免进度冻结或重复调度完成回调。
    const interval = setInterval(
      () => {
        currentRef.current = Math.min(currentRef.current + step(), 100);
        setPercent(currentRef.current);

        if (currentRef.current >= 100) {
          clearInterval(interval);
          if (!completeTimeout) {
            completeTimeout = setTimeout(onComplete, reducedMotion ? 60 : 300);
          }
        }
      },
      reducedMotion ? 20 : 60,
    );

    return () => {
      clearInterval(interval);
      if (completeTimeout) {
        clearTimeout(completeTimeout);
      }
    };
  }, [onComplete, reducedMotion]);

  return (
    <motion.div
      className="fixed inset-0 z-modal flex flex-col items-center justify-center overflow-hidden bg-paper dark:bg-void"
      exit={{ opacity: 0, scale: 1.04 }}
      transition={{ duration: reducedMotion ? 0.15 : 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="mb-10">
        {!reducedMotion && (
          <motion.div
            animate={{ x: [-15, 15, -15], rotate: [-8, 8, -8], y: [0, -12, 0] }}
            transition={{ repeat: Infinity, duration: 0.35, ease: 'linear' }}
            className="h-24 w-24"
          >
            <PixelDuckSvg className="h-full w-full" />
          </motion.div>
        )}
        {reducedMotion && (
          <div className="h-24 w-24">
            <PixelDuckSvg className="h-full w-full" />
          </div>
        )}
      </div>

      <div
        className="mb-4 h-1 w-48 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        aria-label="页面加载进度"
      >
        <motion.div
          className="h-full bg-zinc-900 dark:bg-zinc-100"
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center gap-2"
      >
        <span className="eyebrow font-mono normal-case tracking-[0.2em] text-zinc-400 dark:text-zinc-500">
          欢迎来到D的世界...
        </span>
        <span className="font-brand text-xl text-zinc-900 dark:text-zinc-50">{percent}%</span>
      </motion.div>
    </motion.div>
  );
};
