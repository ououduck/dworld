import React, { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import {
  Globe,
  ArrowUpRight,
  Github,
  Mail,
  Disc,
  Activity,
  Check,
  Copy,
  Command,
  Server,
  Code2,
  Zap,
} from 'lucide-react';
import { motion, AnimatePresence, MotionConfig, Variants } from 'framer-motion';
import { MeteorBackground } from './components/MeteorBackground';
import { BentoCard } from './components/BentoCard';
import { LoadingScreen, LOADING_SKIP_KEY } from './components/LoadingScreen';
import { ThemeToggle } from './components/ThemeToggle';
import { SITE_CONFIG } from './config';
import { QQIcon, PixelDuckSvg } from './components/Icons';

/**
 * 装饰组件（弹幕 / 漫游鸭子）拆包懒加载：
 * 它们不属于首屏交互必需内容，拆成独立 chunk 后主包更小、解析更快；
 * 加载屏播放期间足以完成这两个 chunk 的下载，用户无感知。
 */
const ColorBarrage = lazy(() => import('./components/ColorBarrage'));
const RoamingDuck = lazy(() => import('./components/RoamingDuck'));

/**
 * 将配置中的图标标识转换为实际图标节点，避免在配置文件里直接耦合 JSX。
 */
const IconMap: Record<string, React.ReactNode> = {
  Server: <Server size={18} />,
  Globe: <Globe size={18} />,
  Code2: <Code2 size={18} />,
  Disc: <Disc size={18} />,
  Activity: <Activity size={18} />,
  Zap: <Zap size={18} />,
};

const FALLBACK_ICON = <Command size={18} />;

/**
 * 跳转卡片图标配色：CMS 存语义 key，这里映射为成对的明暗类名。
 * 类名以字面量形式存在于源码中，Tailwind 构建期可直接扫描收集，
 * 不再需要把 Tailwind 类名暴露给 CMS、也不必维护 safelist。
 * 新增配色 = 在此加一行 + 在 .pages.yml 的 options 里加同名 key。
 */
const ACCENT_CLASS: Record<string, string> = {
  sky: 'text-sky-600 dark:text-sky-400',
  emerald: 'text-emerald-600 dark:text-emerald-400',
  violet: 'text-violet-600 dark:text-violet-400',
  amber: 'text-amber-600 dark:text-amber-400',
  rose: 'text-rose-600 dark:text-rose-400',
  cyan: 'text-cyan-600 dark:text-cyan-400',
};

const NEUTRAL_ACCENT = 'text-zinc-500 dark:text-zinc-400';

const iconAccent = (color: string) => ACCENT_CLASS[color] ?? NEUTRAL_ACCENT;

const App: React.FC = () => {
  // 同会话二次访问直接跳过加载屏：初始值在首帧渲染前判断，避免
  // 「先渲染加载屏再退出」导致仍会播放一次退出动画。
  const [loading, setLoading] = useState(() => {
    try {
      return !sessionStorage.getItem(LOADING_SKIP_KEY);
    } catch {
      // sessionStorage 不可用（如隐私模式）时按首次访问处理。
      return true;
    }
  });
  const [toast, setToast] = useState<string | null>(null);
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // 头像回退标记：外部头像源失败时回退到占位图，且只回退一次，避免 onError 循环。
  const avatarFallbackUsed = useRef(false);

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  const showToast = (message: string) => {
    setToast(message);

    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }

    toastTimeoutRef.current = setTimeout(() => {
      setToast(null);
    }, 2500);
  };

  // 复制后立即给出统一提示，避免用户无法确认点击是否生效。
  const handleCopy = async (text: string, label: string) => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        // 非安全上下文等场景下 clipboard API 不可用，回退到隐藏 textarea + execCommand。
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.setAttribute('readonly', 'true');
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        try {
          textArea.select();
          const copied = document.execCommand('copy');
          if (!copied) {
            throw new Error('Fallback copy command failed');
          }
        } finally {
          // execCommand 抛异常时也要移除 textarea，避免残留隐藏节点。
          document.body.removeChild(textArea);
        }
      }

      showToast(`${label}已复制到剪贴板`);
    } catch {
      showToast(`${label}复制失败，请手动复制`);
    }
  };

  // 通过容器级交错动画统一管理各区块的入场节奏，避免逐个元素手动配置。
  const stagger: Variants = {
    visible: { transition: { staggerChildren: 0.07 } },
  };

  // 位移与时长收敛到 D-blog 的量级：编辑部式排版靠克制的淡入，不做弹跳。
  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.45,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      },
    },
  };

  // 根据访问域名切换备案信息，兼容 `www` 等前缀场景；未匹配时回退到默认配置。
  const currentHostname = typeof window !== 'undefined' ? window.location.hostname : '';
  const matchedIcpConfig = SITE_CONFIG.footer.icpConfigs.find(
    (config) => currentHostname === config.domain || currentHostname.endsWith(`.${config.domain}`),
  );

  const displayIcp = matchedIcpConfig ? matchedIcpConfig.icp : SITE_CONFIG.footer.defaultIcp;
  const displayIcpUrl = matchedIcpConfig
    ? matchedIcpConfig.icpUrl
    : SITE_CONFIG.footer.defaultIcpUrl;

  const handleLoadingComplete = useCallback(() => {
    setLoading(false);
    // 首次加载完成后打标记，同一会话后续访问直接跳过加载屏。
    try {
      sessionStorage.setItem(LOADING_SKIP_KEY, '1');
    } catch {
      // sessionStorage 不可用时忽略，不影响功能。
    }
  }, []);

  return (
    // MotionConfig reducedMotion="user"：系统开启「减少动态效果」时，
    // framer-motion 的 JS 驱动动画（如在线状态点脉冲）自动停用，
    // 与弹幕 / 鸭子等组件各自的显式处理保持一致。
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen">
        {/* 启动页先独占视图，避免首屏内容与入场动画同时出现造成视觉干扰。 */}
        <AnimatePresence mode="wait">
          {loading && <LoadingScreen key="loading" onComplete={handleLoadingComplete} />}
        </AnimatePresence>

        {!loading && (
          <>
            <MeteorBackground number={15} />
            <Suspense fallback={null}>
              <ColorBarrage />
            </Suspense>
            <Suspense fallback={null}>
              <RoamingDuck />
            </Suspense>

            <motion.main
              variants={stagger}
              initial="hidden"
              animate="visible"
              className="relative z-10 mx-auto max-w-page px-6 pb-16"
            >
              {/* 顶栏：与 D-blog 导航同层（发丝下边框 + 右侧 44px 主题按钮） */}
              <motion.header
                variants={fadeInUp}
                className="flex items-center justify-between border-b border-zinc-200/90 py-6 dark:border-zinc-800/90"
              >
                {/* min-w-0 + truncate：品牌文案变长后在窄屏也不会挤出横向滚动条。 */}
                <div className="flex min-w-0 items-center gap-2.5">
                  {/* logo.png 为白底不透明图，落在米色纸面上会显出方块，
                      故套一层发丝边框当作有意的图标砖（与站点卡片的图标位同款语言）。 */}
                  <img
                    src={`${import.meta.env.BASE_URL}logo.png`}
                    alt=""
                    width={36}
                    height={36}
                    decoding="async"
                    fetchPriority="high"
                    className="h-9 w-9 flex-none rounded-micro border border-zinc-200 bg-white object-cover dark:border-zinc-700"
                  />
                  <span className="truncate font-serif text-base font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                    D的世界
                    <span className="mx-1.5 font-normal text-zinc-400 dark:text-zinc-500" aria-hidden="true">
                      -
                    </span>
                    {SITE_CONFIG.identity.domain}
                  </span>
                </div>
                <ThemeToggle />
              </motion.header>

              <div className="grid grid-cols-1 gap-6 py-12 md:grid-cols-3 md:py-16">
                <motion.div variants={fadeInUp} className="md:col-span-2">
                  <BentoCard className="flex flex-col items-center gap-8 p-8 md:flex-row md:p-10">
                    <div className="relative">
                      <div className="h-32 w-32 overflow-hidden rounded-icon border border-zinc-200 dark:border-zinc-800">
                        {/* 外部头像源偶尔不稳定，这里回退到占位图以保证卡片始终完整；只回退一次防止 onError 循环。
                            首屏关键图保持默认 eager 加载，仅开启异步解码避免阻塞渲染。 */}
                        <img
                          src={SITE_CONFIG.profile.logo}
                          className="h-full w-full object-cover"
                          alt="跑路的duck 头像"
                          // 容器固定 128px，width/height 声明与之一致，配合 decoding/fetchPriority 减少 CLS 与解码阻塞。
                          width={128}
                          height={128}
                          decoding="async"
                          // 不向头像 CDN（q1.qlogo.cn）泄露来源站点信息。
                          referrerPolicy="no-referrer"
                          // 头像位于首屏顶部，属于 LCP 候选元素，优先加载。
                          fetchPriority="high"
                          onError={(e) => {
                            if (avatarFallbackUsed.current) {
                              return;
                            }
                            avatarFallbackUsed.current = true;
                            (e.target as HTMLImageElement).src =
                              'https://ui-avatars.com/api/?name=Duck&background=FCD34D&color=000';
                          }}
                        />
                      </div>
                      <motion.span
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white dark:border-zinc-900 ${
                          SITE_CONFIG.profile.status === 'online' ? 'bg-emerald-500' : 'bg-zinc-400'
                        }`}
                        aria-hidden="true"
                      />
                    </div>

                    <div className="space-y-4 text-center md:text-left">
                      <div className="flex items-center justify-center gap-3 md:justify-start">
                        <h1 className="font-serif text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 md:text-5xl">
                          {SITE_CONFIG.profile.name}
                        </h1>
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-zinc-200 text-[#0969da] dark:border-zinc-800 dark:text-[#58a6ff]">
                          <Check size={14} />
                          <span className="sr-only">已认证</span>
                        </span>
                      </div>
                      <p className="text-base leading-relaxed text-zinc-500 dark:text-zinc-400 md:text-lg">
                        {SITE_CONFIG.profile.description}
                      </p>
                      <div className="flex flex-wrap justify-center gap-2 pt-1 md:justify-start">
                        {SITE_CONFIG.profile.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center rounded-micro border border-zinc-300 bg-zinc-100 px-2 py-0.5 text-[11px] font-medium leading-none text-zinc-600 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </BentoCard>
                </motion.div>

                <motion.div variants={fadeInUp}>
                  <BentoCard
                    className="flex h-full flex-col justify-between p-8"
                    onClick={() => handleCopy(SITE_CONFIG.identity.domain, '站点域名')}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-2">
                        <span className="eyebrow block">Domain Address</span>
                        <span className="inline-flex items-center rounded-micro border border-zinc-300 px-2 py-0.5 text-[11px] font-medium text-zinc-600 dark:border-zinc-600 dark:text-zinc-400">
                          {SITE_CONFIG.identity.label}
                        </span>
                      </div>
                      <Copy
                        size={18}
                        className="text-zinc-400 transition-colors group-hover:text-zinc-700 dark:text-zinc-500 dark:group-hover:text-zinc-200"
                      />
                    </div>
                    <div className="space-y-3 pt-6">
                      <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                        {SITE_CONFIG.identity.memorySentence}
                        <br />
                        <span className="font-medium text-zinc-700 dark:text-zinc-200">
                          {SITE_CONFIG.identity.memoryDetail}
                        </span>
                      </p>
                      <div className="break-all font-mono text-xl font-bold tracking-tight text-zinc-900 transition-colors group-hover:text-black dark:text-zinc-50 dark:group-hover:text-white">
                        {SITE_CONFIG.identity.domain}
                      </div>
                    </div>
                  </BentoCard>
                </motion.div>
              </div>

              {/* 联系方式保留一行横向排布，便于快速复制或跳转，不挤占首屏纵向空间。 */}
              <motion.div
                variants={fadeInUp}
                className="flex flex-wrap justify-center gap-3 md:justify-start"
              >
                <a
                  href={SITE_CONFIG.socials.github}
                  target="_blank"
                  className="social-btn group"
                  rel="noreferrer"
                >
                  <Github size={18} className="group-hover:rotate-12 transition-transform" />
                  <span>GitHub</span>
                </a>
                <button
                  type="button"
                  onClick={() => handleCopy(SITE_CONFIG.socials.qq, 'QQ')}
                  className="social-btn group"
                >
                  <QQIcon className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  <span>QQ</span>
                </button>
                <a href={`mailto:${SITE_CONFIG.socials.email}`} className="social-btn group">
                  <Mail size={18} className="group-hover:-translate-y-1 transition-transform" />
                  <span>电子邮箱</span>
                </a>
              </motion.div>

              <div className="grid grid-cols-1 gap-10 pt-12 md:grid-cols-2 md:pt-16">
                {/* 两列内容共享同一布局规则，新增站点或项目时能继续保持信息密度平衡。 */}
                <motion.section variants={fadeInUp} className="space-y-4">
                  <div className="flex items-center gap-3 px-1">
                    <span className="eyebrow">我的站点</span>
                    <span className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" aria-hidden="true" />
                  </div>
                  <div className="space-y-3">
                    {SITE_CONFIG.sites.map((site) => (
                      <BentoCard
                        key={site.title}
                        href={site.url}
                        className="flex items-center justify-between gap-4 p-5"
                      >
                        <div className="flex min-w-0 items-center gap-4">
                          <div
                            className={`flex h-11 w-11 flex-none items-center justify-center rounded-icon border border-zinc-200 bg-zinc-100/70 dark:border-zinc-800 dark:bg-zinc-800/70 ${iconAccent(site.color)}`}
                          >
                            {IconMap[site.icon] ?? FALLBACK_ICON}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="truncate text-sm font-semibold text-zinc-800 group-hover:text-black dark:text-zinc-200 dark:group-hover:text-white">
                                {site.title}
                              </h3>
                              <span className="eyebrow flex-none normal-case tracking-normal">
                                {site.en}
                              </span>
                            </div>
                            <p className="mt-0.5 line-clamp-1 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                              {site.desc}
                            </p>
                          </div>
                        </div>
                        <ArrowUpRight
                          size={18}
                          className="flex-none text-zinc-400 transition-colors group-hover:text-zinc-700 dark:group-hover:text-zinc-200"
                        />
                      </BentoCard>
                    ))}
                  </div>
                </motion.section>

                <motion.section variants={fadeInUp} className="space-y-4">
                  <div className="flex items-center gap-3 px-1">
                    <span className="eyebrow">开源项目</span>
                    <span className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" aria-hidden="true" />
                  </div>
                  <div className="space-y-3">
                    {SITE_CONFIG.projects.map((proj) => (
                      <BentoCard
                        key={proj.title}
                        href={proj.url}
                        className="flex items-center justify-between gap-4 p-5"
                      >
                        <div className="flex min-w-0 items-center gap-4">
                          <div
                            className={`flex h-11 w-11 flex-none items-center justify-center rounded-icon border border-zinc-200 bg-zinc-100/70 dark:border-zinc-800 dark:bg-zinc-800/70 ${NEUTRAL_ACCENT}`}
                          >
                            {IconMap[proj.icon] ?? FALLBACK_ICON}
                          </div>
                          <div className="min-w-0">
                            <h3 className="truncate text-sm font-semibold text-zinc-800 group-hover:text-black dark:text-zinc-200 dark:group-hover:text-white">
                              {proj.title}
                            </h3>
                            <p className="mt-0.5 line-clamp-1 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                              {proj.desc}
                            </p>
                          </div>
                        </div>
                        <span className="flex-none rounded-micro border border-zinc-300 bg-zinc-100 px-1.5 py-0.5 font-mono text-[11px] leading-none text-zinc-600 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                          {proj.tag}
                        </span>
                      </BentoCard>
                    ))}
                  </div>
                </motion.section>
              </div>

              {/* 页脚保留极简视觉收尾，仅在存在备案信息时输出链接以兼顾不同部署域名。 */}
              <motion.footer
                variants={fadeInUp}
                className="site-footer mt-16 flex flex-col items-center gap-4 border-t border-zinc-200/90 pt-10 text-center dark:border-zinc-800/90"
              >
                <PixelDuckSvg className="h-5 w-5 opacity-40 grayscale transition-all hover:opacity-100 hover:grayscale-0" />
                <p className="font-mono text-[11px] tracking-wide text-zinc-400 uppercase dark:text-zinc-500">
                  {SITE_CONFIG.footer.copyright}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
                  {displayIcp && (
                    <a
                      href={displayIcpUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="font-mono text-[11px] text-zinc-400 transition-colors hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-200"
                    >
                      {displayIcp}
                    </a>
                  )}
                  <a
                    href="./privacy.html"
                    className="font-mono text-[11px] text-zinc-400 transition-colors hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-200"
                  >
                    隐私说明
                  </a>
                </div>
              </motion.footer>
            </motion.main>
          </>
        )}

        {/* 吐司以非阻塞方式反馈复制结果，避免额外弹窗打断浏览。 */}
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 8, opacity: 0 }}
              transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
              role="status"
              aria-live="polite"
              className="editorial-overlay fixed bottom-[max(1.5rem,env(safe-area-inset-bottom))] left-1/2 z-nested flex -translate-x-1/2 items-center gap-3 px-4 py-3 shadow-xl shadow-black/10 dark:shadow-black/30"
            >
              <span className="h-2 w-2 flex-none rounded-full bg-emerald-500" aria-hidden="true" />
              <span className="text-xs font-medium">{toast}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
};

export default App;
