/**
 * 站点配置（类型化加载器）。
 *
 * 数据源为同目录下的 site.config.json —— 可在 Pages CMS「站点配置」中直接编辑，
 * 保存即推送仓库生效，无需改动代码。本文件仅负责加载 JSON 并提供类型约束：
 * JSON 缺字段/类型不符会在 `npm run typecheck` 时直接报错（fail-fast）。
 *
 * 页面代码（App.tsx / ColorBarrage.tsx）通过根目录 config.ts 引入 SITE_CONFIG，
 * 保持原有调用方式不变。
 */
import siteConfigJson from './site.config.json';

/**
 * 弹幕条目：既支持「纯文案字符串」（使用内置默认色板），
 * 也支持「文案 + 自定义颜色」的对象形式。
 * CMS 中以对象形式存储（text + 可选 color），两种形式运行时均兼容。
 */
export type BarrageItem = string | { text: string; color?: string };

export interface SiteProfile {
  name: string;
  logo: string;
  description: string;
  tags: string[];
  /** online 显示绿色在线点，其余状态显示灰色点。 */
  status: string;
}

export interface SiteIdentity {
  label: string;
  domain: string;
  memorySentence: string;
  memoryDetail: string;
}

export interface SiteSocials {
  github: string;
  qq: string;
  email: string;
}

export interface SiteBarrage {
  enabled: boolean;
  topOffset: number;
  rowGap: number;
  rows: number;
  speed: {
    min: number;
    max: number;
  };
  items: BarrageItem[];
}

/** 「我的站点」跳转卡片。icon 取值见 App.tsx 的 IconMap，color 为 Tailwind 文本颜色类。 */
export interface SiteCardItem {
  title: string;
  en: string;
  desc: string;
  url: string;
  icon: string;
  color: string;
}

/** 「开源项目」跳转卡片。icon 取值见 App.tsx 的 IconMap。 */
export interface ProjectCardItem {
  title: string;
  desc: string;
  url: string;
  icon: string;
  tag: string;
}

export interface IcpConfig {
  domain: string;
  icp: string;
  icpUrl: string;
}

export interface SiteFooter {
  copyright: string;
  /** 未匹配到域名时的默认备案号；留空则不展示备案链接。 */
  defaultIcp: string;
  defaultIcpUrl: string;
  icpConfigs: IcpConfig[];
}

export interface SiteConfig {
  profile: SiteProfile;
  identity: SiteIdentity;
  socials: SiteSocials;
  barrage: SiteBarrage;
  sites: SiteCardItem[];
  projects: ProjectCardItem[];
  footer: SiteFooter;
}

export const siteConfig: SiteConfig = siteConfigJson;
