import React from 'react';
import { motion } from 'framer-motion';
import { SITE_CONFIG } from '../config';

const DEFAULT_BARRAGE_COLORS = ['#facc15', '#38bdf8', '#c084fc', '#34d399', '#fb7185', '#f97316', '#60a5fa', '#a3e635'];

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

/**
 * 按文案估算胶囊宽度：中文字符按 1 个单位、ASCII 按 0.56 个单位估算，
 * 用于在规划轨道间距时避免同轨道弹幕相互追赶重叠。
 */
const estimateBarrageWidth = (label: string, viewportWidth: number, scale: number) => {
  const fontSize = viewportWidth < 640 ? 12 : 14;
  const horizontalPadding = viewportWidth < 640 ? 24 : 32;
  const textWidth = Array.from(label).reduce((width, character) => {
    if (character === ' ') {
      return width + 0.35;
    }

    return width + (/^[\u0000-\u00ff]$/.test(character) ? 0.56 : 1);
  }, 0) * fontSize;

  return (textWidth + horizontalPadding + 2) * scale;
};

/**
 * 监听系统「减少动态效果」偏好，用户开启时组件直接不渲染，
 * 避免无意义的持续滚动动画占用 CPU / GPU。
 */
const usePrefersReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(() => (
    typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ));

  React.useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setPrefersReducedMotion(media.matches);
    media.addEventListener('change', onChange);

    return () => media.removeEventListener('change', onChange);
  }, []);

  return prefersReducedMotion;
};

/**
 * 彩色弹幕层：按配置文案在固定轨道上持续横向滚动。
 * - 根据文案宽度与视口宽度动态规划轨道数量和间距，避免同轨道弹幕重叠；
 * - 纯装饰层，整层对屏幕阅读器隐藏（aria-hidden）；
 * - 开启「减少动态效果」时整体停用（见 usePrefersReducedMotion）。
 */
const ColorBarrage = () => {
  const barrage = SITE_CONFIG.barrage;
  const [viewportWidth, setViewportWidth] = React.useState(() => (
    typeof window === 'undefined' ? 1280 : Math.max(320, window.innerWidth)
  ));

  React.useEffect(() => {
    const handleResize = () => setViewportWidth(Math.max(320, window.innerWidth));
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const prefersReducedMotion = usePrefersReducedMotion();

  const barrageTracks = React.useMemo(() => {
    if (!barrage?.enabled || !barrage.items?.length) {
      return [];
    }

    const requestedLaneCount = clamp(Math.floor(barrage.rows || 1), 1, 6);
    const topOffset = clamp(barrage.topOffset ?? 96, 56, 220);
    const pillHeight = viewportWidth < 640 ? 30 : 36;
    const rowGap = clamp(Math.max(barrage.rowGap ?? 52, pillHeight + 10), 38, 80);
    const minDuration = clamp(barrage.speed?.min ?? 18, 12, 36);
    const maxDuration = clamp(Math.max(minDuration, barrage.speed?.max ?? minDuration), minDuration, 42);
    const travelDistance = viewportWidth * 2.72;
    const horizontalGap = clamp(viewportWidth * 0.08, 48, 96);
    const entries = barrage.items
      .map((item, index) => {
        const label = typeof item === 'string' ? item.trim() : item.text?.trim();
        if (!label) {
          return null;
        }

        const scale = 0.96 + (index % 3) * 0.03;
        return {
          index,
          label,
          color: typeof item === 'string'
            ? DEFAULT_BARRAGE_COLORS[index % DEFAULT_BARRAGE_COLORS.length]
            : item.color || DEFAULT_BARRAGE_COLORS[index % DEFAULT_BARRAGE_COLORS.length],
          scale,
          width: estimateBarrageWidth(label, viewportWidth, scale)
        };
      })
      .filter((entry): entry is NonNullable<typeof entry> => entry !== null);

    if (entries.length === 0) {
      return [];
    }

    // 轨道总负载过高时自动增加轨道，优先保证同轨道弹幕有足够的横向空间。
    const totalTrackWidth = entries.reduce((width, entry) => width + entry.width + horizontalGap, 0);
    const laneCapacity = travelDistance * 0.78;
    const laneCount = clamp(Math.max(requestedLaneCount, Math.ceil(totalTrackWidth / laneCapacity)), 1, 6);
    const lanes = Array.from({ length: laneCount }, () => ({
      load: 0,
      entries: [] as typeof entries
    }));

    entries.forEach(entry => {
      const lane = lanes.reduce((lightest, current) => current.load < lightest.load ? current : lightest, lanes[0]);
      lane.entries.push(entry);
      lane.load += entry.width + horizontalGap;
    });

    const durationRange = maxDuration - minDuration;
    return lanes.flatMap((lane, laneIndex) => {
      const duration = minDuration + (durationRange === 0 ? 0 : (laneIndex * 3) % (durationRange + 1));
      let offset = 0;

      return lane.entries.map(entry => {
        // 负 delay 让弹幕进入视口时就已处于轨道中间位置，营造“已有弹幕在滚动”的连贯感。
        const delay = -(offset / travelDistance) * duration;
        offset += entry.width + horizontalGap;

        return {
          id: `${entry.label}-${entry.index}`,
          label: entry.label,
          color: entry.color,
          top: topOffset + laneIndex * rowGap,
          duration,
          delay,
          scale: entry.scale
        };
      });
    });
  }, [barrage, viewportWidth]);

  if (!barrage?.enabled || barrageTracks.length === 0 || prefersReducedMotion) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[30] overflow-hidden pointer-events-none" aria-hidden="true">
      {barrageTracks.map(track => (
        <motion.div
          key={track.id}
          className="absolute left-0 whitespace-nowrap will-change-transform"
          style={{ top: `${track.top}px` }}
          initial={{ x: '112vw' }}
          animate={{ x: '-160vw' }}
          transition={{
            duration: track.duration,
            delay: track.delay,
            ease: 'linear',
            repeat: Infinity,
            repeatType: 'loop'
          }}
        >
          {/* 胶囊背景已近不透明，去掉 backdrop-blur 可显著降低移动端持续滚动的重绘开销 */}
          <span
            className="inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-semibold tracking-wide shadow-[0_10px_30px_rgba(0,0,0,0.35)] sm:px-4 sm:py-2 sm:text-sm"
            style={{
              color: track.color,
              borderColor: `${track.color}55`,
              background: `linear-gradient(135deg, ${track.color}22, rgba(10, 10, 10, 0.82))`,
              boxShadow: `0 10px 30px ${track.color}22`,
              transform: `scale(${track.scale})`
            }}
          >
            {track.label}
          </span>
        </motion.div>
      ))}
      {/* 顶部渐隐遮罩，让弹幕从顶部进入时柔和过渡，不突兀露出 */}
      <div className="absolute inset-x-0 top-0 -z-10 h-36 bg-gradient-to-b from-[#050505] via-[#050505]/70 to-transparent" />
    </div>
  );
};

export default ColorBarrage;
