/**
 * 网站核心配置数据
 */
export const SITE_CONFIG = {
  profile: {
    name: "跑路的duck",
    logo: "http://q1.qlogo.cn/g?b=qq&nk=2472652060&s=100",
    description: "一只游手好闲的鸭子",
    tags: ["没实力", "爱跑路"],
    status: "online" // online, offline, idle
  },
  identity: {
    label: "助记词",
    domain: "www.pldduck.com",
    memorySentence: "教你一句话记住本网站：",
    memoryDetail: "跑路的（pld）duck（duck）"
  },
  socials: {
    github: "https://github.com/ououduck",
    qq: "2472652060",
    email: "duck@pldduck.com"
  },
  sites: [
    { 
      title: 'D探针', 
      en: 'Status', 
      desc: '服务器实时监控', 
      url: 'https://tanzhen.pldduck.com', 
      icon: 'Server', 
      color: "text-emerald-400" 
    },
    { 
      title: 'Ddomain', 
      en: 'DNS', 
      desc: '域名分发系统', 
      url: 'https://dns.3pw.pw', 
      icon: 'Globe', 
      color: "text-blue-400" 
    },
    { 
      title: 'D-pic', 
      en: 'API', 
      desc: '公益API', 
      url: 'https://api.pldduck.com/', 
      icon: 'Zap', 
      color: "text-yellow-400" 
    }
  ],
  projects: [
    { 
      title: 'D-fuckshuiyin', 
      desc: '智能图片去水印工具', 
      url: 'https://github.com/ououduck/D-fuckshuiyin', 
      icon: 'Code2', 
      tag: 'JS+Canvas' 
    },
    { 
      title: 'Dynamic Island', 
      desc: '灵动岛音乐播放组件', 
      url: 'https://github.com/ououduck/dynamic-island-player', 
      icon: 'Disc', 
      tag: 'CSS+React' 
    }
  ],
  footer: {
    copyright: "© 2026 D工作室 & duck",
    icp: "湘ICP备2025101669号",
    icpUrl: "https://beian.miit.gov.cn"
  }
};
