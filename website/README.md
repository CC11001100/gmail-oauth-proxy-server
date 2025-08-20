# Gmail OAuth Proxy Server - 前端网站

这是一个现代化的 React 网站，用于展示和说明 Gmail OAuth Proxy Server 项目。

## 🚀 快速开始

### 开发环境

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 访问 http://localhost:3000
```

### 构建项目

```bash
# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

## 📦 部署方式

本项目支持两种部署方式：

### 1. GitHub Pages 部署（推荐）

使用专门的脚本来构建适合 GitHub Pages 的版本：

```bash
# 构建 GitHub Pages 版本
./deploy-github-pages.sh

# 访问地址: https://cc11001100.github.io/gmail-oauth-proxy-server/
```

**特点：**
- 自动设置正确的资源路径 `/gmail-oauth-proxy-server/`
- 适合开源项目展示
- 自动处理路径重定向

### 2. 自定义域名部署

如果要部署到自定义域名（如 `www.cc11001100.com`）：

```bash
# 构建自定义域名版本
./deploy-custom-domain.sh

# 访问地址: https://www.cc11001100.com/
```

**特点：**
- 使用根路径 `/` 作为基础路径
- 适合生产环境部署
- 需要配置服务器路由重写

## 🔧 配置说明

### 环境变量

- `VITE_BASE_PATH`: 设置基础路径
  - GitHub Pages: `/gmail-oauth-proxy-server/`
  - 自定义域名: `/`
  - 开发环境: `/`

- `VITE_DEPLOY_TARGET`: 部署目标
  - `github-pages`: GitHub Pages 部署
  - `custom-domain`: 自定义域名部署

### 自动环境检测

网站会自动检测部署环境：

1. **GitHub Pages**: `cc11001100.github.io`
   - 使用基础路径 `/gmail-oauth-proxy-server`
   - 自动重定向根路径访问

2. **自定义域名**: `www.cc11001100.com` 或 `cc11001100.com`
   - 使用根路径 `/`
   - 不需要重定向

3. **开发环境**: `localhost`
   - 使用根路径 `/`
   - 支持热重载

## 📁 项目结构

```
website/
├── src/                    # 源代码
│   ├── components/         # 组件
│   ├── pages/             # 页面
│   ├── theme/             # 主题配置
│   ├── App.tsx            # 主应用组件
│   └── main.tsx           # 入口文件
├── public/                 # 静态资源
├── dist/                   # 构建输出
├── deploy-github-pages.sh  # GitHub Pages 部署脚本
├── deploy-custom-domain.sh # 自定义域名部署脚本
└── vite.config.ts         # Vite 配置
```

## 🎨 技术栈

- **React 18** - 用户界面框架
- **TypeScript** - 类型安全
- **Vite** - 构建工具
- **Material-UI** - UI 组件库
- **React Router** - 路由管理
- **Emotion** - CSS-in-JS 样式

## 📚 页面说明

- **首页** (`/`) - 项目介绍和快速开始
- **文档** (`/documentation`) - 详细使用说明
- **参数编辑器** (`/parameter-editor`) - 在线参数配置工具
- **下载** (`/download`) - 获取项目文件

## 🚨 注意事项

1. **部署环境匹配**: 确保使用正确的部署脚本
2. **路径配置**: GitHub Pages 必须使用 `/gmail-oauth-proxy-server/` 前缀
3. **服务器配置**: 自定义域名需要配置正确的路由重写规则

## 📖 详细文档

- [GitHub Pages 部署指南](./CUSTOM_DOMAIN_DEPLOYMENT.md#github-pages-部署)
- [自定义域名部署指南](./CUSTOM_DOMAIN_DEPLOYMENT.md)

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## �� 许可证

MIT License
