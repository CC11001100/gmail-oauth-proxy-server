# Gmail OAuth Proxy Server - 官方网站

这是 Gmail OAuth Proxy Server 项目的官方网站，使用现代化的技术栈构建。

<!-- 最后更新: 2025-08-21 -->

## 🚀 技术栈

- **前端框架**: React 19 + TypeScript
- **UI组件库**: Material-UI (MUI) v5
- **构建工具**: Vite
- **样式**: CSS Modules + 响应式设计
- **国际化**: i18next
- **路由**: React Router v7
- **主题**: 支持浅色/深色模式切换

## ✨ 特性

- 🎨 现代化设计，支持浅色/深色主题
- 📱 完全响应式设计，支持所有设备
- 🌍 中英文双语支持
- ⚡ 快速加载和流畅动画
- 🔧 参数编辑器工具
- 📚 完整的文档页面
- 💾 下载页面和版本管理

## 🛠️ 本地开发

### 环境要求

- Node.js 18+ 
- npm 或 yarn

### 安装依赖

```bash
cd website
npm install
```

### 启动开发服务器

```bash
npm run dev
```

开发服务器将在 `http://localhost:5173` 启动

### 构建生产版本

```bash
npm run build
```

构建产物将输出到 `dist/` 目录

### 预览构建结果

```bash
npm run preview
```

## 🚀 部署

### 自动部署 (推荐)

网站配置了 GitHub Actions 自动部署：

1. 推送代码到 `main` 分支
2. GitHub Actions 自动构建和部署
3. 网站将部署到 GitHub Pages

### 手动部署

如果需要手动部署：

1. 构建项目：`npm run build`
2. 将 `dist/` 目录内容上传到你的 Web 服务器

## 📁 项目结构

```
website/
├── src/
│   ├── components/          # 可复用组件
│   ├── pages/              # 页面组件
│   ├── theme/              # 主题配置
│   ├── i18n/               # 国际化配置
│   ├── types/              # TypeScript 类型定义
│   ├── utils/              # 工具函数
│   └── assets/             # 静态资源
├── public/                 # 公共资源
├── dist/                   # 构建输出
└── package.json            # 项目配置
```

## 🎨 主题系统

网站支持浅色和深色两种主题：

- **浅色主题**: 清爽明亮，适合日间使用
- **深色主题**: 护眼舒适，适合夜间使用

用户可以通过 Header 中的主题切换按钮来切换主题，系统会记住用户的选择。

## 🌍 国际化

网站支持中英文双语：

- **中文**: 简体中文，适合中文用户
- **English**: 英文，适合国际用户

语言切换器位于 Header 右侧，支持实时切换。

## 📱 响应式设计

网站采用移动优先的响应式设计：

- **移动端**: 优化触摸操作，垂直布局
- **平板端**: 平衡布局，适中的内容密度
- **桌面端**: 充分利用屏幕空间，水平布局

## 🔧 自定义配置

### 主题颜色

在 `src/theme/theme.ts` 中修改颜色配置：

```typescript
export const lightTheme = createTheme({
  palette: {
    primary: {
      main: '#6366f1', // 主色调
    },
    secondary: {
      main: '#f59e0b', // 辅助色
    },
  },
});
```

### 添加新页面

1. 在 `src/pages/` 创建新页面组件
2. 在 `src/App.tsx` 添加路由
3. 在 `src/i18n/` 添加翻译文本

## 🐛 问题反馈

如果遇到问题或有改进建议，请：

1. 检查 [Issues](https://github.com/cc11001100/gmail-oauth-proxy-server/issues)
2. 创建新的 Issue 描述问题
3. 或者提交 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](../LICENSE) 文件

## 🤝 贡献

欢迎贡献代码！请：

1. Fork 项目
2. 创建特性分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

---

**Gmail OAuth Proxy Server** - 安全、高效的 OAuth 代理服务
