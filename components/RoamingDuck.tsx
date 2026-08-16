import React from 'react';
import { AnimatePresence, motion, useAnimation } from 'framer-motion';
import { PixelDuckSvg } from './Icons';

/**
 * 底部漫游鸭子：彩蛋角色在页面底部持续左右往返移动，点击后弹出随机吐槽气泡。
 * - 行走通过 framer-motion 的 controls 串行 await，保证「先向右走完、再向左走回」的连贯循环；
 * - 纯装饰元素，整层 pointer-events-none，仅鸭子本体可点击；
 * - 系统开启「减少动态效果」时不再漫游，点击仅保留气泡反馈。
 */
const RoamingDuck = () => {
  const controls = useAnimation();
  const [speech, setSpeech] = React.useState<string | null>(null);
  const [direction, setDirection] = React.useState<'left' | 'right'>('right');
  const speechTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  // 通过 matchMedia 判断交互环境：
  // - hover: hover —— 桌面指针设备才有「持续漫游」的视觉预期；
  // - prefers-reduced-motion: reduce —— 用户开启减少动态效果时停止漫游动画。
  // 两种情况都让鸭子保持静止，仅保留点击气泡反馈。
  const canRoam = React.useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(hover: hover)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  );

  React.useEffect(() => {
    if (!canRoam) {
      return;
    }

    let isActive = true;

    const walk = async () => {
      while (isActive) {
        setDirection('right');
        await controls.start({
          x: '80vw',
          rotate: [0, 5, 0, -5, 0],
          transition: { duration: 12, ease: 'linear' },
        });

        if (!isActive) {
          break;
        }

        setDirection('left');
        await controls.start({
          x: '5vw',
          rotate: [0, 5, 0, -5, 0],
          transition: { duration: 12, ease: 'linear' },
        });
      }
    };

    void walk();

    return () => {
      isActive = false;
      controls.stop();
      if (speechTimeoutRef.current) {
        clearTimeout(speechTimeoutRef.current);
      }
    };
  }, [canRoam, controls]);

  const handleClick = () => {
    const phrases = [
      '嘎嘎！',
      '不准跑路！',
      'Quack!',
      'DWorld 永远的神',
      '你在看我吗？',
      '给点代码吃吃吧',
    ];
    setSpeech(phrases[Math.floor(Math.random() * phrases.length)]);

    // 鸭子静止时（触屏或减少动态效果），点击用一次弹跳模拟“被戳了一下”的反馈。
    if (!canRoam) {
      controls.start({ y: [0, -40, 0], transition: { duration: 0.4, ease: 'backOut' } });
    }

    if (speechTimeoutRef.current) {
      clearTimeout(speechTimeoutRef.current);
    }

    speechTimeoutRef.current = setTimeout(() => {
      setSpeech(null);
    }, 2500);
  };

  return (
    <motion.div
      animate={controls}
      // w-12 sm:w-16：窄屏缩小鸭子尺寸，避免其超出视口或遮挡内容
      className="fixed bottom-4 left-0 z-[40] pointer-events-none w-12 sm:w-16"
    >
      <div
        role="button"
        aria-label="戳一下鸭子"
        tabIndex={0}
        // 键盘用户可通过 Enter / 空格触发相同的气泡反馈，与鼠标点击保持一致。
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            handleClick();
          }
        }}
        onClick={handleClick}
        className="relative pointer-events-auto cursor-pointer focus:outline-none focus-visible:rounded-2xl focus-visible:ring-2 focus-visible:ring-yellow-400/60"
      >
        <AnimatePresence>
          {speech && (
            <div className="absolute -top-8 left-1/2 -translate-x-1/2">
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: -8 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative bg-white/10 backdrop-blur-xl px-4 py-1.5 rounded-2xl border border-white/20 text-xs font-medium whitespace-nowrap shadow-2xl"
              >
                <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white/10" />
                {speech}
              </motion.div>
            </div>
          )}
        </AnimatePresence>
        <div style={{ transform: direction === 'right' ? 'scaleX(-1)' : 'scaleX(1)' }}>
          <PixelDuckSvg className="w-12 h-12 sm:w-16 sm:h-16 drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]" />
        </div>
      </div>
    </motion.div>
  );
};

export default RoamingDuck;
