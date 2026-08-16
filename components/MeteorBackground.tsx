import React from 'react';

type MeteorStyle = {
  left: string;
  animationDelay: string;
  animationDuration: string;
};

/**
 * 流星背景：随机生成若干条流星，在左上角按固定角度周期性划过。
 * - 流星位置与动画参数通过 useState 惰性初始化只生成一次，避免每次渲染重新随机导致闪烁；
 * - 纯装饰层，pointer-events-none 不拦截交互；
 * - 系统开启「减少动态效果」时整体不渲染（见 CSS 中 .animate-meteor 的隐藏规则兜底）。
 */
export const MeteorBackground = ({ number = 15 }: { number?: number }) => {
  // 流星参数用 useState 惰性初始化：只在首次挂载时生成一次随机值，
  // 后续重渲染保持稳定，同时避免渲染期调用不纯函数（React 纯度约束）。
  const [meteorStyles] = React.useState<MeteorStyle[]>(() =>
    Array.from({ length: number }, () => ({
      left: `${Math.floor(Math.random() * 800) - 400}px`,
      animationDelay: `${(Math.random() * 0.6 + 0.2).toFixed(2)}s`,
      animationDuration: `${Math.floor(Math.random() * 8) + 2}s`,
    })),
  );

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {meteorStyles.map((style, idx) => (
        <span
          key={`meteor-${idx}`}
          className={
            'animate-meteor absolute h-0.5 w-0.5 rounded-[9999px] bg-slate-500 shadow-[0_0_0_1px_#ffffff10] rotate-[215deg] ' +
            "before:content-[''] before:absolute before:top-1/2 before:transform before:-translate-y-[50%] before:w-[50px] before:h-[1px] before:bg-gradient-to-r before:from-[#64748b] before:to-transparent"
          }
          style={{
            top: 0,
            ...style,
          }}
        />
      ))}
    </div>
  );
};
