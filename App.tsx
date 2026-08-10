import React, { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { 
  Globe, ArrowUpRight, Github, Mail, Disc, 
  Activity, Check, Copy, Command, Server, 
  Code2, Zap 
} from 'lucide-react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { MeteorBackground } from './components/MeteorBackground';
import { SITE_CONFIG } from './config';
import { QQIcon, PixelDuckSvg } from './components/Icons';

/**
 * 装饰组件（弹幕 / 漫游鸭子）拆包懒加载：
 * 它们不属于首屏交互必需内容，拆成独立 chunk 后主包更小、解析更快；
 * 加载屏播放期间足以完成这两个 chunk 的下载，用户无感知。
 */
const ColorBarrage = lazy(() => import('./components/ColorBarrage'));
const RoamingDuck = lazy(() => import('./components/RoamingDuck'));

// 加载屏“同会话跳过”标记的存储键：二次访问直接进首页，避免重复等待。
const LOADING_SKIP_KEY = 'dworld-loading-skipped';

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
const BentoCard = ({ children, className = '', href, onClick }: BentoCardProps) => {
  const Comp = href ? motion.a : motion.div;
  const interactive = Boolean(onClick) && !href;

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
      href={href}
      target={href ? '_blank' : undefined}
      rel={href ? 'noopener noreferrer' : undefined}
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

/**
 * 启动页：短暂进度动画延后首屏内容出现，减少资源加载与动效初始化时的突兀感。
 * - 同一会话内二次访问直接跳过（sessionStorage 标记）；
 * - 系统开启「减少动态效果」时不做逐帧进度，直接加速完成。
 */
const LoadingScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [percent, setPercent] = useState(0);
  const [reducedMotion] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  useEffect(() => {
    // 同一会话二次访问：直接跳过加载屏，保留首访的仪式感。
    try {
      if (sessionStorage.getItem(LOADING_SKIP_KEY)) {
        onComplete();
        return;
      }
    } catch {
      // sessionStorage 不可用（如隐私模式）时忽略，按正常流程播放。
    }

    let completeTimeout: ReturnType<typeof setTimeout> | null = null;

    // 开启减少动态效果时用大步长快速完成，避免无意义的花式动画。
    const step = reducedMotion ? 33 : () => Math.floor(Math.random() * 10) + 5;

    const interval = setInterval(() => {
      setPercent(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          if (!completeTimeout) {
            completeTimeout = setTimeout(onComplete, reducedMotion ? 60 : 300);
          }
          return 100;
        }
        return Math.min(prev + (typeof step === 'number' ? step : step()), 100);
      });
    }, reducedMotion ? 20 : 60);

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
      exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
      transition={{ duration: reducedMotion ? 0.15 : 0.8, ease: "circOut" }}
    >
      <div className="relative mb-12">
        {!reducedMotion && (
          <motion.div
            animate={{ x: [-15, 15, -15], rotate: [-8, 8, -8], y: [0, -12, 0] }}
            transition={{ repeat: Infinity, duration: 0.35, ease: "linear" }}
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

      <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden mb-4">
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
        <span className="text-yellow-400 font-brand text-xl">
          {Math.min(percent, 100)}%
        </span>
      </motion.div>

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-yellow-500/5 rounded-full blur-[120px]" />
      </div>
    </motion.div>
  );
};

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
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
        textArea.select();
        const copied = document.execCommand('copy');
        document.body.removeChild(textArea);

        if (!copied) {
          throw new Error('Fallback copy command failed');
        }
      }

      showToast(`${label}已复制到剪贴板`);
    } catch {
      showToast(`${label}复制失败，请手动复制`);
    }
  };

  // 通过容器级交错动画统一管理各区块的入场节奏，避免逐个元素手动配置。
  const stagger: Variants = {
    visible: { transition: { staggerChildren: 0.1 } }
  };

  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.8, 
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number]
      } 
    }
  };

  // 根据访问域名切换备案信息，兼容 `www` 等前缀场景；未匹配时回退到默认配置。
  const currentHostname = typeof window !== 'undefined' ? window.location.hostname : '';
  const matchedIcpConfig = SITE_CONFIG.footer.icpConfigs.find(config =>
    currentHostname === config.domain || currentHostname.endsWith(`.${config.domain}`)
  );

  const displayIcp = matchedIcpConfig ? matchedIcpConfig.icp : SITE_CONFIG.footer.defaultIcp;
  const displayIcpUrl = matchedIcpConfig ? matchedIcpConfig.icpUrl : SITE_CONFIG.footer.defaultIcpUrl;

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
    <div className="min-h-screen bg-[#050505] text-white selection:bg-yellow-400 selection:text-black">
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
            variants={stagger} initial="hidden" animate="visible"
            className="relative z-10 max-w-5xl mx-auto px-6 py-12 md:py-32 space-y-12"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div variants={fadeInUp} className="md:col-span-2">
                <BentoCard className="p-10 md:p-14 flex flex-col md:flex-row items-center gap-10">
                  <div className="relative group/avatar">
                    <div className="w-32 h-32 rounded-[2.5rem] border-2 border-white/10 overflow-hidden ring-8 ring-white/[0.02] transform transition-transform group-hover/avatar:scale-105 duration-500">
                      {/* 外部头像源偶尔不稳定，这里回退到占位图以保证卡片始终完整；只回退一次防止 onError 循环。
                          首屏关键图保持默认 eager 加载，仅开启异步解码避免阻塞渲染。 */}
                      <img 
                        src={SITE_CONFIG.profile.logo} 
                        className="w-full h-full object-cover" 
                        alt="跑路的duck 头像" 
                        decoding="async"
                        onError={(e) => {
                          if (avatarFallbackUsed.current) {
                            return;
                          }
                          avatarFallbackUsed.current = true;
                          (e.target as HTMLImageElement).src = "https://ui-avatars.com/api/?name=Duck&background=FCD34D&color=000";
                        }}
                      />
                    </div>
                    <motion.div 
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-4 border-[#0A0A0A] ${SITE_CONFIG.profile.status === 'online' ? 'bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.5)]' : 'bg-gray-500'}`} 
                    />
                  </div>
                  <div className="text-center md:text-left space-y-4">
                    <div className="flex items-center justify-center md:justify-start gap-4">
                      <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50">
                        {SITE_CONFIG.profile.name}
                      </h1>
                      <div className="bg-blue-500/10 p-1.5 rounded-full border border-blue-500/20">
                        <Check size={20} className="text-blue-400" />
                      </div>
                    </div>
                    <p className="text-white/40 text-xl font-medium tracking-wide">
                      {SITE_CONFIG.profile.description}
                    </p>
                    <div className="flex flex-wrap justify-center md:justify-start gap-2.5 pt-2">
                      {SITE_CONFIG.profile.tags.map(tag => (
                        <span key={tag} className="text-[10px] font-mono font-bold border border-white/10 px-3 py-1 rounded-full bg-white/[0.03] text-white/60 hover:bg-white/10 transition-colors cursor-default">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </BentoCard>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <BentoCard className="h-full p-10 flex flex-col justify-between" onClick={() => handleCopy(SITE_CONFIG.identity.domain, '站点域名')}>
                  <div className="flex justify-between items-start">
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-mono text-white/30 uppercase tracking-[0.3em] block">Domain Address</span>
                      <span className="inline-flex items-center text-[10px] text-yellow-500/90 font-bold px-3 py-1 bg-yellow-500/10 rounded-full border border-yellow-500/20">
                        {SITE_CONFIG.identity.label}
                      </span>
                    </div>
                    <Copy size={18} className="text-white/10 group-hover:text-yellow-400 transition-colors" />
                  </div>
                  <div className="space-y-4">
                    <p className="text-[11px] text-white/30 font-mono leading-relaxed">
                      {SITE_CONFIG.identity.memorySentence}<br/>
                      <span className="text-white/60 font-medium">{SITE_CONFIG.identity.memoryDetail}</span>
                    </p>
                    <div className="text-2xl font-mono font-bold text-white/90 group-hover:text-yellow-400 transition-colors tracking-tight">
                      {SITE_CONFIG.identity.domain}
                    </div>
                  </div>
                </BentoCard>
              </motion.div>
            </div>

            {/* 联系方式保留一行横向排布，便于快速复制或跳转，不挤占首屏纵向空间。 */}
            <motion.div variants={fadeInUp} className="flex flex-wrap justify-center md:justify-start gap-4">
              <a href={SITE_CONFIG.socials.github} target="_blank" className="social-btn group" rel="noreferrer">
                <Github size={18} className="group-hover:rotate-12 transition-transform"/>
                <span>GitHub</span>
              </a>
              <button onClick={() => handleCopy(SITE_CONFIG.socials.qq, 'QQ')} className="social-btn group">
                <QQIcon className="w-4 h-4 group-hover:scale-110 transition-transform"/>
                <span>QQ</span>
              </button>
              <a href={`mailto:${SITE_CONFIG.socials.email}`} className="social-btn group">
                <Mail size={18} className="group-hover:-translate-y-1 transition-transform"/>
                <span>电子邮箱</span>
              </a>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-8">
              {/* 两列内容共享同一布局规则，新增站点或项目时能继续保持信息密度平衡。 */}
              <motion.section variants={fadeInUp} className="space-y-6">
                <div className="flex items-center gap-4 px-4">
                  <div className="w-8 h-px bg-white/20" />
                  <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">我的站点</h2>
                </div>
                <div className="space-y-4">
                  {SITE_CONFIG.sites.map(site => (
                    <BentoCard key={site.title} href={site.url} className="p-6 flex items-center justify-between group">
                      <div className="flex items-center gap-6">
                        <div className={`p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] transform transition-transform group-hover:scale-110 duration-500 ${site.color}`}>
                          {IconMap[site.icon] ?? FALLBACK_ICON}
                        </div>
                        <div>
                          <div className="flex items-center gap-3">
                            <h3 className="text-base font-bold text-white/90">{site.title}</h3>
                            <span className="text-[9px] font-mono font-bold text-white/20 px-1.5 py-0.5 border border-white/5 rounded-md">{site.en}</span>
                          </div>
                          <p className="text-sm text-white/40 mt-1.5 line-clamp-1">{site.desc}</p>
                        </div>
                      </div>
                      <ArrowUpRight size={20} className="text-white/5 group-hover:text-white/80 transition-all group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </BentoCard>
                  ))}
                </div>
              </motion.section>

              <motion.section variants={fadeInUp} className="space-y-6">
                <div className="flex items-center gap-4 px-4">
                  <div className="w-8 h-px bg-white/20" />
                  <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">开源项目</h2>
                </div>
                <div className="space-y-4">
                  {SITE_CONFIG.projects.map(proj => (
                    <BentoCard key={proj.title} href={proj.url} className="p-6 flex items-center justify-between group">
                      <div className="flex items-center gap-6">
                        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] text-purple-400 group-hover:text-purple-300 transition-colors">
                          {IconMap[proj.icon] ?? FALLBACK_ICON}
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-white/90">{proj.title}</h3>
                          <p className="text-sm text-white/40 mt-1.5 line-clamp-1">{proj.desc}</p>
                        </div>
                      </div>
                      <span className="text-[9px] font-mono font-bold text-purple-400/50 bg-purple-400/5 px-2.5 py-1.5 rounded-lg border border-purple-400/10">
                        {proj.tag}
                      </span>
                    </BentoCard>
                  ))}
                </div>
              </motion.section>
            </div>

            {/* 页脚保留极简视觉收尾，仅在存在备案信息时输出链接以兼顾不同部署域名。 */}
            <motion.footer variants={fadeInUp} className="pt-32 pb-16 flex flex-col items-center gap-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-px bg-gradient-to-r from-transparent to-white/10" />
                <PixelDuckSvg className="w-6 h-6 opacity-20 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer" />
                <div className="w-12 h-px bg-gradient-to-l from-transparent to-white/10" />
              </div>
              <div className="text-center space-y-3">
                <p className="text-[10px] font-mono font-medium tracking-[0.2em] text-white/20 uppercase">
                  {SITE_CONFIG.footer.copyright}
                </p>
                {displayIcp && (
                  <a href={displayIcpUrl} target="_blank" rel="noreferrer" className="text-[10px] font-mono text-white/10 hover:text-white/40 transition-colors block">
                    {displayIcp}
                  </a>
                )}
              </div>
            </motion.footer>
          </motion.main>
        </>
      )}

      {/* 吐司以非阻塞方式反馈复制结果，避免额外弹窗打断浏览。 */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ y: 50, opacity: 0, scale: 0.9 }} 
            animate={{ y: 0, opacity: 1, scale: 1 }} 
            exit={{ y: 20, opacity: 0, scale: 0.9 }}
            className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[200] px-8 py-4 bg-[#111]/80 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center gap-4"
          >
            <div className="w-2 h-2 rounded-full bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.8)]" />
            <span className="text-xs font-bold tracking-wide">{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
