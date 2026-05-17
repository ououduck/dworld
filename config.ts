/**
 * 集中维护首页展示所需的站点数据，便于在不改动页面结构的前提下调整内容。
 */
export const SITE_CONFIG = {
  // 个人名片区域使用的基础信息。
  profile: {
    name: "跑路的duck",
    logo: "https://q1.qlogo.cn/g?b=qq&nk=2472652060&s=100",
    description: "一只游手好闲的鸭子",
    tags: ["没实力", "爱跑路"],
    status: "online"
  },

  // 域名记忆区通过一句助记文案帮助用户快速记住主域名。
  identity: {
    label: "助记词",
    domain: "www.pldduck.com",
    memorySentence: "教你一句话记住本网站：",
    memoryDetail: "跑路的（pld）duck（duck）"
  },

  // 联系方式集中在这里，便于页面按钮与跳转地址统一维护。
  socials: {
    github: "https://github.com/ououduck",
    qq: "2472652060",
    email: "duck@pldduck.com"
  },

  // 彩色滑动弹幕通过配置驱动内容，便于按需调整文案、颜色和展示密度。
  barrage: {
    enabled: true,
    topOffset: 96,
    rowGap: 52,
    rows: 3,
    speed: {
      min: 16,
      max: 24
    },
    items: [
      { text: "欢迎来到 D 的世界", color: "#facc15" },
      { text: "今天也要继续摸鱼写代码", color: "#38bdf8" },
      { text: "pldduck.com", color: "#c084fc" },
      { text: "duck.skin", color: "#34d399" },
      { text: "pldduck.top", color: "#fb7185" },
      { text: "AI就是我的命", color: "#f97316" },
      { text: "记得天天开心", color: "#60a5fa" },
      { text: "Duck要跑路啦", color: "#a3e635" }
    ]
  },

  // 站点列表驱动“我的站点”区域，后续扩展时只需追加数据即可复用现有卡片渲染。
  sites: [
    { 
      title: 'D-blog', 
      en: 'Blog', 
      desc: 'duck的胡言乱语', 
      url: 'https://blog.pldduck.com', 
      icon: 'Globe', 
      color: "text-blue-400" 
    }
  ],

  // 开源项目使用与站点相同的数据驱动方式，便于保持两个列表的渲染逻辑一致。
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
    },
    { 
      title: 'D-pxxdns-index', 
      desc: '为PXXDNS定制的企业级首页模板', 
      url: 'https://github.com/ououduck/D-pxxdns-index/', 
      icon: 'Code2', 
      tag: 'PHP' 
    },
    { 
      title: 'D-blog', 
      desc: '纯静态自研Blog', 
      url: 'https://github.com/ououduck/D-blog/', 
      icon: 'Code2', 
      tag: 'React+Vite' 
    }
  ],

  // 页脚备案配置按访问域名切换内容，兼顾主域名、备用域名和测试环境展示差异。
  footer: {
    copyright: "© 2026 D工作室 & duck",
    
    // 未匹配域名时默认不展示备案号，避免海外或临时预览域名出现错误备案信息。
    defaultIcp: null, 
    defaultIcpUrl: "https://beian.miit.gov.cn",
    
    // 通过域名片段匹配对应备案号，可兼容 `www` 等常见前缀形式。
    icpConfigs: [
      {
        domain: "pldduck.com",
        icp: "湘ICP备2025101669号-3",
        icpUrl: "https://beian.miit.gov.cn"
      },
      {
        domain: "pldduck.top",
        icp: "湘ICP备2025101669号-2",
        icpUrl: "https://beian.miit.gov.cn"
      }
    ]
  }
};
