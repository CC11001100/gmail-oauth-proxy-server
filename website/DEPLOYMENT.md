# GitHub Pages 部署说明

## 问题描述

当前网站部署在 GitHub Pages 上时，路径前缀 `/gmail-oauth-proxy-server/` 丢失，导致所有内部链接和资源加载失败。

## 问题原因

这个问题通常由以下几个原因造成：

1. **GitHub Pages 配置不正确**
2. **构建过程中的路径处理问题**
3. **部署后的路径解析问题**

## 解决方案

### 1. 检查 GitHub Pages 设置

在 GitHub 仓库的 Settings > Pages 中，确保以下设置：

- **Source**: Deploy from a branch
- **Branch**: main
- **Folder**: / (root) 或 /docs

### 2. 验证构建配置

确保 `vite.config.ts` 中的配置正确：

```typescript
export default defineConfig(({ command, mode }) => {
  const isDev = command === 'serve'
  
  // 支持环境变量配置base路径
  const basePath = process.env.VITE_BASE_PATH || (isDev ? '/' : '/gmail-oauth-proxy-server/')
  
  return {
    base: basePath,
    // ... 其他配置
  }
})
```

### 3. 验证构建输出

构建后，检查 `dist/index.html` 文件，确保所有资源路径都包含正确的前缀：

```html
<link rel="icon" type="image/svg+xml" href="/gmail-oauth-proxy-server/gmail-favicon.ico" />
<script type="module" crossorigin src="/gmail-oauth-proxy-server/assets/index-xxx.js"></script>
<link rel="stylesheet" crossorigin href="/gmail-oauth-proxy-server/assets/index-xxx.css">
```

### 4. 验证 React Router 配置

确保 `main.tsx` 中的 Router 配置正确：

```typescript
const getBasename = () => {
  const hostname = window.location.hostname;
  
  if (hostname === 'cc11001100.github.io') {
    return '/gmail-oauth-proxy-server';
  }
  
  return '';
};

<BrowserRouter basename={getBasename()}>
  <App />
</BrowserRouter>
```

## 部署流程

1. **推送代码到 main 分支**
2. **GitHub Actions 自动触发构建**
3. **构建完成后自动部署到 GitHub Pages**
4. **等待部署完成（通常需要几分钟）**

## 验证部署

部署完成后，访问以下 URL 验证：

- 首页：https://cc11001100.github.io/gmail-oauth-proxy-server/
- 文档页：https://cc11001100.github.io/gmail-oauth-proxy-server/documentation
- 参数编辑器：https://cc11001100.github.io/gmail-oauth-proxy-server/parameter-editor
- 下载页：https://cc11001100.github.io/gmail-oauth-proxy-server/download

## 故障排除

如果问题仍然存在：

1. **检查 GitHub Actions 日志**：查看构建和部署过程中是否有错误
2. **清除浏览器缓存**：强制刷新页面
3. **检查网络请求**：使用浏览器开发者工具查看资源加载情况
4. **验证 GitHub Pages 状态**：在仓库的 Actions 标签页中查看部署状态

## 注意事项

- GitHub Pages 的部署可能需要几分钟时间
- 确保所有资源路径都使用相对路径或正确的基础路径
- 避免在代码中硬编码绝对路径 