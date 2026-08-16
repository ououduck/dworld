import React from 'react';
import { motion } from 'framer-motion';

type BentoCardProps = {
  children: React.ReactNode;
  className?: string;
  href?: string;
  onClick?: React.MouseEventHandler<HTMLDivElement | HTMLAnchorElement>;
};

/**
 * 统一站内卡片的视觉风格，并根据是否传入链接自动切换为可跳转容器。
 * 仅带 onClick 时（如域名复制卡）视为按钮：补充 role / tabIndex / 键盘触发，保证可访问性。
 */
export const BentoCard = ({ children, className = '', href, onClick }: BentoCardProps) => {
  // 只把 http(s) 链接渲染为可跳转容器：url 来自 CMS 可编辑的配置，防御性拦截
  // "javascript:..." 之类的危险 scheme（配合 CSP 纵深防御）。
  const isSafeHref = href ? /^https?:\/\//i.test(href) : false;
  const Comp = isSafeHref ? motion.a : motion.div;
  const interactive = Boolean(onClick) && !isSafeHref;

  const keyboardProps = interactive
    ? {
        role: 'button',
        tabIndex: 0,
        // 用 HTMLElement 级事件类型，保证同时兼容 motion.a / motion.div 两套 props。
        onKeyDown: (event: React.KeyboardEvent<HTMLElement>) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onClick?.(event as unknown as React.MouseEvent<HTMLDivElement>);
          }
        },
      }
    : {};

  return (
    <Comp
      href={isSafeHref ? href : undefined}
      target={isSafeHref ? '_blank' : undefined}
      rel={isSafeHref ? 'noopener noreferrer' : undefined}
      onClick={onClick}
      {...keyboardProps}
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      className={`group relative bg-[#0A0A0A] border border-white/[0.06] rounded-[2rem] overflow-hidden transition-all duration-500 hover:border-white/[0.15] hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      {children}
    </Comp>
  );
};
