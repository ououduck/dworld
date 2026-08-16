import { useEffect, useState } from 'react';
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
 */
export const LoadingScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [percent, setPercent] = useState(0);
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  useEffect(() => {
    let completeTimeout: ReturnType<typeof setTimeout> | null = null;

    // 开启减少动态效果时用大步长快速完成，避免无意义的花式动画。
    const step = reducedMotion ? 33 : () => Math.floor(Math.random() * 10) + 5;

    // 进度用闭包变量推进，updater 保持纯函数：
    // React 19 StrictMode 会双调用 updater，副作用（clearInterval/setTimeout）放在
    // updater 外可避免进度冻结或重复调度完成回调。
    let current = 0;
    const interval = setInterval(
      () => {
        current = Math.min(current + (typeof step === 'number' ? step : step()), 100);
        setPercent(current);

        if (current >= 100) {
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
      className="fixed inset-0 z-[100] bg-[#050505] flex flex-col items-center justify-center overflow-hidden"
      exit={{ opacity: 0, scale: 1.1, filter: 'blur(20px)' }}
      transition={{ duration: reducedMotion ? 0.15 : 0.8, ease: 'circOut' }}
    >
      <div className="relative mb-12">
        {!reducedMotion && (
          <motion.div
            animate={{ x: [-15, 15, -15], rotate: [-8, 8, -8], y: [0, -12, 0] }}
            transition={{ repeat: Infinity, duration: 0.35, ease: 'linear' }}
            className="w-24 h-24"
          >
            <PixelDuckSvg className="w-full h-full drop-shadow-[0_0_30px_rgba(252,211,77,0.6)]" />
          </motion.div>
        )}
        {reducedMotion && (
          <div className="w-24 h-24">
            <PixelDuckSvg className="w-full h-full drop-shadow-[0_0_30px_rgba(252,211,77,0.6)]" />
          </div>
        )}

        {!reducedMotion && (
          <motion.div
            animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5], x: [20, 40, 60] }}
            transition={{ repeat: Infinity, duration: 0.35 }}
            className="absolute -bottom-2 -left-4 w-4 h-2 bg-white/20 rounded-full blur-sm"
          />
        )}
      </div>

      <div
        className="w-48 h-1 bg-white/10 rounded-full overflow-hidden mb-4"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        aria-label="页面加载进度"
      >
        <motion.div
          className="h-full bg-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.5)]"
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center gap-2"
      >
        <span className="text-white/40 font-mono text-[10px] tracking-widest uppercase">
          欢迎来到D的世界...
        </span>
        <span className="text-yellow-400 font-brand text-xl">{percent}%</span>
      </motion.div>

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-yellow-500/5 rounded-full blur-[120px]" />
      </div>
    </motion.div>
  );
};
