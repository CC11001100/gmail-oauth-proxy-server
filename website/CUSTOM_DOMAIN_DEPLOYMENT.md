# 自定义域名部署指南

## 概述

本指南说明如何将 Gmail OAuth Proxy Server 网站部署到自定义域名（如 `cc11001100.com`）而不是 GitHub Pages。

## 部署方式对比

| 部署方式 | 访问地址 | 基础路径 | 适用场景 |
|---------|---------|---------|---------|
| GitHub Pages | `https://cc11001100.github.io/gmail-oauth-proxy-server/` | `/gmail-oauth-proxy-server/` | 开源项目展示 |
| 自定义域名 | `https://www.cc11001100.com/gmail-oauth-proxy-server/` | `/` | 生产环境部署 |

## 快速部署

### 1. 构建自定义域名版本

```bash
cd website
./deploy-custom-domain.sh
```

这个脚本会：
- 设置正确的环境变量
- 构建网站（资源路径为根路径）
- 检查构建结果

### 2. 上传到服务器

构建完成后，将 `dist/` 目录中的文件上传到您的自定义域名服务器。

### 3. 配置服务器

确保您的服务器配置了正确的路由重写规则，将所有请求都指向 `index.html`，让 React Router 处理客户端路由。

#### Nginx 配置示例

```nginx
server {
    listen 80;
    server_name www.cc11001100.com cc11001100.com;
    
    location /gmail-oauth-proxy-server {
        alias /path/to/your/dist;
        try_files $uri $uri/ /gmail-oauth-proxy-server/index.html;
        
        # 静态资源缓存
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
}
```

#### Apache 配置示例

```apache
<VirtualHost *:80>
    ServerName www.cc11001100.com
    ServerAlias cc11001100.com
    
    DocumentRoot /path/to/your/dist
    
    <Directory /path/to/your/dist>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
        
        # 重写规则
        RewriteEngine On
        RewriteBase /
        RewriteRule ^index\.html$ - [L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /index.html [L]
    </Directory>
</VirtualHost>
```

## 环境变量配置

自定义域名部署使用以下环境变量：

```bash
export VITE_BASE_PATH=/
export VITE_DEPLOY_TARGET=custom-domain
```

## 路径处理逻辑

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

### 路径重定向示例

| 访问路径 | GitHub Pages | 自定义域名 |
|---------|-------------|-----------|
| `/` | → `/gmail-oauth-proxy-server/` | 直接访问首页 |
| `/documentation` | → `/gmail-oauth-proxy-server/documentation` | 直接访问文档页 |
| `/gmail-oauth-proxy-server/` | 正常访问 | → `/` (重定向) |

## 故障排除

### 常见问题

1. **404 错误**
   - 检查服务器路由重写配置
   - 确认所有请求都指向 `index.html`

2. **资源加载失败**
   - 检查构建后的资源路径
   - 确认服务器正确提供静态文件

3. **路由不工作**
   - 检查 `basename` 配置
   - 确认环境检测逻辑正确

### 调试步骤

1. 检查浏览器控制台错误
2. 验证网络请求路径
3. 检查服务器日志
4. 确认文件权限设置

## 维护

### 更新部署

每次代码更新后，重新运行部署脚本：

```bash
cd website
./deploy-custom-domain.sh
```

然后将新的 `dist/` 目录内容上传到服务器。

### 回滚

如果新版本有问题，可以快速回滚到之前的版本：

1. 恢复之前的 `dist/` 目录
2. 或者重新构建之前的代码版本

## 联系支持

如果遇到部署问题，请：

1. 检查本文档的故障排除部分
2. 查看项目 Issues
3. 提交详细的错误报告 