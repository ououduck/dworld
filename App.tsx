import React, { useState, useEffect } from 'react';
import { 
  Globe, ArrowUpRight, Github, Mail, Disc, 
  Activity, Check, Copy, Command, Server, 
  Code2, Zap 
} from 'lucide-react';
import { motion, AnimatePresence, useAnimation, Variants } from 'framer-motion';
import { MeteorBackground } from './components/MeteorBackground';
import { SITE_CONFIG } from './config';
import { QQIcon, PixelDuckSvg } from './components/Icons';

const IconMap: Record<string, React.ReactNode> = {
  Server: <Server size={18} />,
  Globe: <Globe size={18} />,
  Code2: <Code2 size={18} />,
  Disc: <Disc size={18} />,
  Activity: <Activity size={18} />,
  Zap: <Zap size={18} />,
};

// --- Sub-Components ---

const LoadingScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPercent(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + Math.floor(Math.random() * 10) + 5;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-[#050505] flex flex-col items-center justify-center overflow-hidden"
      exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
      transition={{ duration: 0.8, ease: "circOut" }}
    >
      <div className="relative mb-12">
        <motion.div
          animate={{ 
            x: [-15, 15, -15],
            rotate: [-8, 8, -8],
            y: [0, -12, 0]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 0.35,
            ease: "linear"
          }}
          className="w-24 h-24"
        >
          <PixelDuckSvg className="w-full h-full drop-shadow-[0_0_30px_rgba(252,211,77,0.6)]" />
        </motion.div>
        
        <motion.div 
          animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5], x: [20, 40, 60] }}
          transition={{ repeat: Infinity, duration: 0.35 }}
          className="absolute -bottom-2 -left-4 w-4 h-2 bg-white/20 rounded-full blur-sm"
        />
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

const RoamingDuck = () => {
  const controls = useAnimation();
  const [speech, setSpeech] = useState<string | null>(null);
  const [direction, setDirection] = useState<'left' | 'right'>('right');

  useEffect(() => {
    const walk = async () => {
      try {
        while(true) {
          setDirection('right');
          await controls.start({ 
            x: '80vw', 
            rotate: [0, 5, 0, -5, 0],
            transition: { duration: 12, ease: "linear" } 
          });
          setDirection('left');
          await controls.start({ 
            x: '5vw', 
            rotate: [0, 5, 0, -5, 0],
            transition: { duration: 12, ease: "linear" } 
          });
        }
      } catch (e) {}
    };
    walk();
  }, [controls]);

  const handleClick = () => {
    const phrases = ["嘎嘎！", "不准跑路！", "Quack!", "DWorld 永远的神", "你在看我吗？", "给点代码吃吃吧"];
    setSpeech(phrases[Math.floor(Math.random() * phrases.length)]);
    controls.start({ y: [0, -40, 0], transition: { duration: 0.4, ease: "backOut" } });
    setTimeout(() => setSpeech(null), 2500);
  };

  return (
    <motion.div animate={controls} className="fixed bottom-4 left-0 z-[40] pointer-events-none">
      <div className="relative pointer-events-auto cursor-pointer" onClick={handleClick}>
        <AnimatePresence>
          {speech && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, y: 10 }} 
              animate={{ opacity: 1, scale: 1, y: -20 }} 
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-xl px-4 py-1.5 rounded-2xl border border-white/20 text-xs font-medium whitespace-nowrap shadow-2xl"
            >
              <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white/10" />
              {speech}
            </motion.div>
          )}
        </AnimatePresence>
        <div style={{ transform: direction === 'right' ? 'scaleX(-1)' : 'scaleX(1)' }}>
          <PixelDuckSvg className="w-16 h-16 drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]" />
        </div>
      </div>
    </motion.div>
  );
};

const BentoCard = ({ children, className = "", href = "", onClick = undefined }: any) => {
  const Comp = href ? motion.a : motion.div;
  return (
    <Comp
      href={href || undefined}
      target={href ? "_blank" : undefined}
      onClick={onClick}
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      className={`group relative bg-[#0A0A0A] border border-white/[0.06] rounded-[2rem] overflow-hidden transition-all duration-500 hover:border-white/[0.15] hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      {children}
    </Comp>
  );
};

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setToast(`${label}已复制到剪贴板`);
    setTimeout(() => setToast(null), 2500);
  };

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

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-yellow-400 selection:text-black">
      <AnimatePresence mode="wait">
        {loading && <LoadingScreen key="loading" onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      {!loading && (
        <>
          <MeteorBackground number={15} />
          <RoamingDuck />
          
          <motion.main 
            variants={stagger} initial="hidden" animate="visible"
            className="relative z-10 max-w-5xl mx-auto px-6 py-12 md:py-32 space-y-12"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div variants={fadeInUp} className="md:col-span-2">
                <BentoCard className="p-10 md:p-14 flex flex-col md:flex-row items-center gap-10">
                  <div className="relative group/avatar">
                    <div className="w-32 h-32 rounded-[2.5rem] border-2 border-white/10 overflow-hidden ring-8 ring-white/[0.02] transform transition-transform group-hover/avatar:scale-105 duration-500">
                      <img 
                        src={SITE_CONFIG.profile.logo} 
                        className="w-full h-full object-cover" 
                        alt="Profile" 
                        onError={(e) => {
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

            <motion.div variants={fadeInUp} className="flex flex-wrap justify-center md:justify-start gap-4">
              <a href={SITE_CONFIG.socials.github} target="_blank" className="social-btn group">
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
                          {IconMap[site.icon]}
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
                          {IconMap[proj.icon]}
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

            <motion.footer variants={fadeInUp} className="pt-32 pb-16 flex flex-col items-center gap-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-px bg-gradient-to-r from-transparent to-white/10" />
                <PixelDuckSvg className="w-6 h-6 opacity-20 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer" />
                <div className="w-12 h-px bg-gradient-to-l from-transparent to-white/10" />
              </div>
              <div className="text-center space-y-3">
                <p className="text-[10px] font-mono font-medium tracking-[0.2em] text-white/20 uppercase">{SITE_CONFIG.footer.copyright}</p>
                <a href={SITE_CONFIG.footer.icpUrl} target="_blank" className="text-[10px] font-mono text-white/10 hover:text-white/40 transition-colors block">
                  {SITE_CONFIG.footer.icp}
                </a>
              </div>
            </motion.footer>
          </motion.main>
        </>
      )}

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

      <style>{`
        .social-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          height: 56px;
          padding: 0 28px;
          border-radius: 20px;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.05);
          font-size: 14px;
          font-weight: 600;
          color: rgba(255,255,255,0.5);
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .social-btn:hover {
          background: rgba(255,255,255,0.06);
          border-color: rgba(255,255,255,0.15);
          color: #fff;
          transform: translateY(-4px);
          box-shadow: 0 15px 30px -10px rgba(0,0,0,0.5);
        }
      `}</style>
    </div>
  );
};

export default App;