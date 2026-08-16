# DWorld · D 的世界

![React](https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-strict-3178c6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6-646cff?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3-06b6d4?logo=tailwindcss&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)

跑路的duck 的个人主页：深色玻璃拟态卡片 + 彩色弹幕 + 流星背景的单页应用。

在线地址：<https://www.pldduck.com>

## 功能特性

- **启动加载屏**：首次访问展示进度动画，同一会话二次访问自动跳过；
- **彩色弹幕**：按文案宽度自动规划轨道，匀速横向滚动（可经 CMS 配置文案与颜色）；
- **漫游鸭子彩蛋**：底部来回踱步，点击弹出随机吐槽气泡；
- **流星背景 + 噪点纹理**：纯装饰层，不拦截交互；
- **域名记忆卡**：点击一键复制主域名；
- **备案号自适应**：按访问域名自动匹配 ICP 备案号（未匹配域名不展示）；
- **响应式**：移动端适配 + 刘海屏 safe-area 兜底；
- **无障碍 & 性能**：键盘可操作、`prefers-reduced-motion` 全站遵循、装饰组件懒加载、vendor 分包缓存。

## 技术栈

- **React 19** + **TypeScript 5**（strict 模式）+ **Vite 6**
- **Tailwind CSS 3**（构建期编译，替代原 CDN 运行时）
- **Framer Motion**（入场 / 弹幕 / 鸭子漫游动画）
- **lucide-react**（图标）
- **ESLint 10**（flat config + typescript-eslint + react-hooks）+ **Prettier 3**

## 快速开始

```bash
npm install          # 安装依赖（Node >= 20）
npm run dev          # 本地开发（http://localhost:3000）
npm run check        # 类型检查（含站点配置 JSON 的字段校验，strict 模式）
npm run lint         # ESLint 静态检查
npm run format       # Prettier 全量格式化
npm run build        # 生产构建 → dist/
npm run preview      # 本地预览构建产物
```

## 目录结构

```
├── App.tsx                   # 页面主体：卡片布局、加载屏、复制交互
├── index.html                # SEO / 结构化数据 / 字体与统计脚本
├── index.tsx                 # React 挂载入口
├── config/
│   ├── site.config.json      # 站点数据配置（Pages CMS「站点配置」可编辑，唯一数据源）
│   └── site.config.ts        # 类型化加载器：JSON 缺字段/类型不符时 typecheck 直接报错
├── config.ts                 # 兼容入口：向页面组件导出 SITE_CONFIG
├── src/
│   ├── index.css             # Tailwind 入口 + 全局样式
│   └── hooks/useMediaQuery.ts# 系统偏好实时监听（减少动态效果 / hover 能力等）
├── components/
│   ├── ColorBarrage.tsx      # 彩色弹幕（懒加载）
│   ├── RoamingDuck.tsx       # 漫游鸭子彩蛋（懒加载）
│   ├── MeteorBackground.tsx  # 流星背景
│   └── Icons.tsx             # 自定义 SVG 图标
├── .pages.yml                # Pages CMS 配置（内容字段定义 + 部署动作按钮）
├── .github/workflows/
│   └── deploy.yml            # 手动部署流水线（Cloudflare Pages + EdgeOne Pages 直传）
├── edgeone.json              # EdgeOne 安全响应头（HSTS / CSP / 权限策略等）
├── vite.config.ts            # Vite 配置（base / 别名 / vendor 分包）
├── tailwind.config.js        # Tailwind 主题（字体、动画、safelist 颜色）
├── postcss.config.js         # PostCSS 插件配置
├── eslint.config.js          # ESLint 扁平配置（TS + React Hooks 规则）
├── .prettierrc.json          # Prettier 格式化规则
├── .env.example              # 环境变量示例（VITE_BASE_PATH 子路径部署）
├── .gitattributes            # 换行符与二进制文件标记
└── public/                   # robots.txt / sitemap.xml / favicon / logo
```

## 内容管理（Pages CMS）

站点所有展示内容均托管在 [`config/site.config.json`](config/site.config.json)，通过 **Pages CMS** 在线编辑：

1. 访问 Pages CMS（[pagescms.org](https://pagescms.org) 或自托管实例），授权 GitHub 仓库 `ououduck/dworld`；
2. 进入「**站点配置**」，即可修改：
   - **个人名片**：昵称、头像、简介、标签、在线状态；
   - **站点信息**：域名记忆卡（助记词/主域名）、社交链接（GitHub / QQ / 邮箱）；
   - **彩色弹幕**：开关、行数、速度、文案与颜色；
   - **跳转卡片 · 我的站点**：首页「我的站点」区的跳转卡片（名称、简介、链接、图标、颜色）；
   - **跳转卡片 · 开源项目**：首页「开源项目」区的跳转卡片（项目名、简介、仓库链接、技术标签）；
   - **页脚 / 备案**：版权文字、按访问域名匹配的 ICP 备案号；
3. 编辑保存即推送仓库，点击侧边栏「🚀 部署到 Cloudflare & EdgeOne」按钮触发部署（见下）。

> 说明：
> - CMS 的必填字段与 [`config/site.config.ts`](config/site.config.ts) 的类型约束保持一致（`npm run check` 在部署流水线中强制校验），CMS 能保存的配置一定可以通过类型检查；
> - `sites` / `projects` 卡片中的图标取值为代码内置的 `IconMap`（Globe / Code2 / Disc / Server / Activity / Zap），新增图标需在 `App.tsx` 的 `IconMap` 中补充映射。

## 部署方式（与 D-blog 相同）

构建在 **GitHub Actions** 完成，产物通过**直传（direct upload）**推送到 **Cloudflare Pages** 与 **EdgeOne Pages**，两个平台均不消耗构建额度。日常 push 到 main 不触发部署，仅在需要时手动触发：

- **Pages CMS**：侧边栏「🚀 部署到 Cloudflare & EdgeOne」按钮；
- **GitHub Actions**：手动 Run workflow（payload 留空即可部署当前分支，或传 `{"repository":{"ref":"main"}}` 指定分支）。

流水线步骤：检出 → 安装依赖 → `npm run check`（类型校验，配置有误时提前失败）→ `npm run build` → 双平台直传部署。

### 仓库 Secrets（需在 GitHub 仓库 Settings → Secrets and variables 配置）

| Secret | 用途 |
| --- | --- |
| `CLOUDFLARE_API_TOKEN` | Cloudflare API Token（权限含 Pages: Edit） |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare 账户 ID |
| `EDGEONE_API_TOKEN` | EdgeOne API Token |

### 平台侧一次性准备

- **Cloudflare**：创建 Pages 项目 `dworld`（直传类型，无需关联 Git 仓库，项目名须与 deploy.yml 一致）；
- **EdgeOne**：创建 Pages 项目 `dworld`（直传类型），生产环境 `production`。

### 安全响应头

`edgeone.json` 为 EdgeOne 站点配置了安全响应头（HSTS / CSP / 权限策略等）；Cloudflare Pages 侧可在控制台配置相同的规则，或参考该文件内容。

## 部署注意

- 构建产物使用相对路径（`base: './'`，可用环境变量 `VITE_BASE_PATH` 覆盖），可部署到任意子目录；
- `robots.txt` / `sitemap.xml` / canonical / og:image 均指向 `www.pldduck.com`，部署到其他域名时请同步修改；
- 备案号按访问域名自动切换（见 `config/site.config.json` 的 `footer.icpConfigs`），未匹配域名不展示备案号。

## License

MIT
