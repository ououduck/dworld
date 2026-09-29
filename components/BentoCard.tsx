import React from 'react';

type BentoCardProps = {
  children: React.ReactNode;
  className?: string;
  href?: string;
  onClick?: React.MouseEventHandler<HTMLDivElement | HTMLAnchorElement>;
};

/**
 * 站内卡片容器：外观对齐 D-blog 的内容卡配方（PostCard / CompactPostCard）——
 * 8px 圆角、1px 发丝边框、无投影，白底浮于米色纸面之上以拉开层级；
 * 悬停仅加深边框（150ms），不做位移，按压缩放交给 CSS 的 active:scale-[.98]
 * （触屏由 @media (hover: none) 关闭）。
 *
 * 是否传入链接决定元素类型；仅带 onClick 时（如域名复制卡）视为按钮，
 * 补充 role / tabIndex / 键盘触发，保证可访问性。
 */
export const BentoCard = ({ children, className = '', href, onClick }: BentoCardProps) => {
  // 只把 http(s) 链接渲染为可跳转容器：url 来自 CMS 可编辑的配置，防御性拦截
  // "javascript:..." 之类的危险 scheme（配合 CSP 纵深防御）。
  const isSafeHref = href ? /^https?:\/\//i.test(href) : false;
  const interactive = Boolean(onClick) && !isSafeHref;

  const surfaceClassName = `group relative rounded-surface border border-zinc-200 bg-white shadow-none transition-[border-color,background-color] duration-150 hover:border-zinc-400 focus-visible:border-zinc-500 active:scale-[.98] dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-600 dark:focus-visible:border-zinc-500 ${className}`;

  const keyboardProps = interactive
    ? {
        role: 'button',
        tabIndex: 0,
        onKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            // 键盘触发没有 MouseEvent 的坐标/按钮字段，调用方（复制卡）也不读这些字段，
            // 这里按 onClick 的签名收窄转换。
            onClick?.(event as unknown as React.MouseEvent<HTMLDivElement | HTMLAnchorElement>);
          }
        },
      }
    : {};

  if (isSafeHref) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClick}
        className={surfaceClassName}
      >
        {children}
      </a>
    );
  }

  return (
    <div onClick={onClick} {...keyboardProps} className={surfaceClassName}>
      {children}
    </div>
  );
};
