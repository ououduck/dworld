/**
 * 网站核心配置数据
 * 你可以在这里修改个人信息、社交链接、展示的站点和项目，以及底部的版权和备案信息。
 */
export const SITE_CONFIG = {
  // --- 个人资料配置 ---
  profile: {
    name: "跑路的duck",
    logo: "http://q1.qlogo.cn/g?b=qq&nk=2472652060&s=100", // 头像图片地址
    description: "一只游手好闲的鸭子",
    tags: ["没实力", "爱跑路"], // 展示在个人资料下方的标签
    status: "online" // 在线状态指示器: online (绿点), offline (灰点), idle
  },

  // --- 站点身份配置 ---
  identity: {
    label: "助记词",
    domain: "www.pldduck.com", // 主域名展示
    memorySentence: "教你一句话记住本网站：",
    memoryDetail: "跑路的（pld）duck（duck）"
  },

  // --- 社交媒体与联系方式 ---
  socials: {
    github: "https://github.com/ououduck",
    qq: "2472652060",
    email: "duck@pldduck.com"
  },

  // --- 我的站点列表 ---
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
      title: 'D-blog', 
      en: 'Blog', 
      desc: 'duck的胡言乱语', 
      url: 'https://blog.pldduck.com', 
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

  // --- 开源项目列表 ---
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

  // --- 页脚配置（包含多域名备案号智能切换逻辑） ---
  footer: {
    copyright: "© 2026 D工作室 & duck",
    
    // 当访问的域名不在下方 icpConfigs 列表中时，默认显示的备案号。
    // 如果希望未匹配的域名（如海外域名、vercel测试域名）不显示备案号，请设为 null。
    defaultIcp: null, 
    defaultIcpUrl: "https://beian.miit.gov.cn",
    
    // 多域名备案号配置列表：根据用户访问的实际域名进行匹配
    icpConfigs: [
      {
        domain: "pldduck.com", // 匹配主域名 (会自动匹配 www.pldduck.com 或 pldduck.com)
        icp: "湘ICP备2025101669号",
        icpUrl: "https://beian.miit.gov.cn"
      },
      {
        domain: "duck.skin",
        icpUrl: "https://beian.miit.gov.cn"
      }
    ]
  }
};
