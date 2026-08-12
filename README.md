# DWorld · D 的世界

跑路的duck 的个人主页：深色玻璃拟态卡片 + 彩色弹幕 + 流星背景的单页应用。

在线地址：https://www.pldduck.com

## 技术栈

- **React 19** + **TypeScript** + **Vite 6**
- **Tailwind CSS 3**（构建期编译，替代原 CDN 运行时）
- **Framer Motion**（入场 / 弹幕 / 鸭子漫游动画）
- **lucide-react**（图标）

## 快速开始

```bash
npm install      # 安装依赖
npm run dev      # 本地开发（http://localhost:3000）
npm run typecheck # 类型检查
npm run build    # 生产构建 → dist/
npm run preview  # 本地预览构建产物
```

## 目录结构

```
├── App.tsx                   # 页面主体：卡片布局、加载屏、复制交互
├── index.html                # SEO / 结构化数据 / 字体与统计脚本
├── index.tsx                 # React 挂载入口
├── config.ts                 # 站点数据配置（唯一需要改的内容）
├── components/
│   ├── ColorBarrage.tsx      # 彩色弹幕（懒加载）
│   ├── RoamingDuck.tsx       # 漫游鸭子彩蛋（懒加载）
│   ├── MeteorBackground.tsx  # 流星背景
│   └── Icons.tsx             # 自定义 SVG 图标
├── src/index.css             # Tailwind 入口 + 全局样式
├── public/                   # robots.txt / sitemap.xml / favicon / logo
└── tailwind.config.js        # Tailwind 主题（颜色、字体、动画）
```

## 自定义配置

所有展示内容集中在 [`config.ts`](config.ts)，改数据即可更新页面：

| 字段 | 说明 |
| --- | --- |
| `profile` | 昵称、头像、状态（online 显示绿点）、标签 |
| `identity` | 域名记忆卡片：助记词与主域名 |
| `socials` | GitHub / QQ / 邮箱 |
| `barrage` | 弹幕文案、颜色、行数与速度（`enabled: false` 可整体关闭） |
| `sites` / `projects` | 「我的站点」「开源项目」卡片列表 |
| `footer` | 版权与按域名匹配的 ICP 备案号 |

## 部署注意

- 构建产物使用相对路径（`base: './'`），可部署到任意子目录。
- `robots.txt` / `sitemap.xml` / canonical / og:image 均指向 `www.pldduck.com`，部署到其他域名时请同步修改。
- 备案号按访问域名自动切换（见 `config.ts` 的 `footer.icpConfigs`），未匹配域名不展示。

## License

MIT
