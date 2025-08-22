# Gmail OAuth Proxy Server

[English](README.md) | **中文**

[![Website](https://img.shields.io/badge/Website-🌐%20Live-blue.svg)](https://cc11001100.github.io/gmail-oauth-proxy-server/)
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-🚀%20Modern%20Website-brightgreen.svg)](https://cc11001100.github.io/gmail-oauth-proxy-server/)

## 🌐 现代化官方网站

我们为这个项目创建了一个现代化的官方网站，包含：

- 🎨 **现代化设计**: 使用 TypeScript + React + Material-UI 构建
- 🌓 **主题切换**: 支持浅色/深色模式
- 🌍 **国际化**: 中英文双语支持
- 📱 **响应式设计**: 完美适配所有设备
- ⚡ **快速加载**: 优化的性能和用户体验
- 🔧 **在线工具**: 参数编辑器和配置生成器

**访问地址**: [https://cc11001100.github.io/gmail-oauth-proxy-server/](https://cc11001100.github.io/gmail-oauth-proxy-server/)

### 🚀 本地开发网站

```bash
cd website
npm install
npm run dev
```

### 🔨 构建网站

```bash
cd website
npm run build
./deploy.sh
```

一个使用Go和Gin框架实现的谷歌OAuth代理服务，用于安全地代理OAuth token交换请求。

## 功能特性

- **🔐 双重认证**: 支持API Key和IP白名单双重认证机制
- **🛡️ 灵活鉴权**: 可单独或组合使用API Key和IP白名单
- **🔒 HTTPS强制**: 强制使用HTTPS协议（开发环境除外）
- **🌐 IP白名单**: 支持CIDR格式和单个IP地址访问控制
- **🛡️ 日志脱敏**: 自动脱敏敏感信息如token、secret等
- **⚡ 请求代理**: 将JSON请求转换为form-urlencoded格式并转发到Google OAuth API
- **🚨 错误处理**: 完善的错误处理和日志记录
- **⚙️ 配置管理**: 支持配置文件和环境变量
- **🎨 命令行界面**: 使用Cobra框架，支持彩色输出和子命令
- **📊 监控工具**: 内置版本信息、配置验证等管理工具

## API规范

### GET /auth

用户授权端点代理 - 代理 `https://accounts.google.com/o/oauth2/v2/auth`

**请求头:**
- `X-API-Key: <your_api_key>` (必需)

**查询参数:**
- `client_id`: Google应用的客户端ID (必需)
- `redirect_uri`: 授权回调地址 (必需)
- `scope`: 请求的权限范围 (必需, 如: "openid email profile")
- `state`: 状态参数，防CSRF攻击 (必需)
- `response_type`: 固定值 "code" (必需)
- `access_type`: 访问类型 (可选, 如: "offline")
- `prompt`: 强制显示授权页面 (可选, 如: "consent")

**响应:**
- 成功: HTTP 302 重定向到Google授权页面

**示例:**
```bash
curl -H "X-API-Key: your_api_key" \
  "https://your-proxy-server.com/auth?client_id=your_client_id&redirect_uri=https://your-app.com/callback&scope=openid%20email%20profile&state=random_state&response_type=code&access_type=offline&prompt=consent"
```

### POST /token

OAuth token交换端点 - 代理 `https://oauth2.googleapis.com/token` (支持授权码交换和刷新令牌)

**请求头:**
- `Content-Type: application/x-www-form-urlencoded` (推荐，Google标准格式)
- `Content-Type: application/json` (向后兼容)
- `X-API-Key: <your_api_key>` (必需)

**授权码交换请求体 (form-urlencoded格式，与Google API完全一致):**
```bash
curl -X POST "https://your-proxy-server.com/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -H "X-API-Key: your_api_key" \
  -d "code=4/0AeaYshBpVe...&client_id=your-client-id.apps.googleusercontent.com&client_secret=YOUR_CLIENT_SECRET&redirect_uri=https://yourdomain.com/auth/callback&grant_type=authorization_code"
```

**刷新令牌请求体 (form-urlencoded格式):**
```bash
curl -X POST "https://your-proxy-server.com/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -H "X-API-Key: your_api_key" \
  -d "refresh_token=1//04...&client_id=your-client-id.apps.googleusercontent.com&client_secret=YOUR_CLIENT_SECRET&grant_type=refresh_token"
```

**JSON格式请求体 (向后兼容):**
```json
{
  "code": "4/0AeaYshBpVe...",
  "client_id": "your-client-id.apps.googleusercontent.com", 
  "client_secret": "YOUR_CLIENT_SECRET",
  "redirect_uri": "https://yourdomain.com/auth/callback",
  "grant_type": "authorization_code"
}
```

**响应:**
- 成功: HTTP 200 + Google原始响应
- 失败: 返回相应错误状态码和消息

### GET /userinfo

用户信息获取端点代理 - 代理 `https://www.googleapis.com/oauth2/v2/userinfo`

**请求头:**
- `Authorization: Bearer <access_token>` (必需)
- `X-API-Key: <your_api_key>` (必需)

**响应:**
- 成功: HTTP 200 + Google原始用户信息响应
- 失败: 返回相应错误状态码和消息

**示例:**
```bash
curl -H "Authorization: Bearer ya29.a0AfH6SMC..." \
  -H "X-API-Key: your_api_key" \
  "https://your-proxy-server.com/userinfo"
```

### GET /tokeninfo

令牌验证端点代理 - 代理 `https://www.googleapis.com/oauth2/v1/tokeninfo`

**请求头:**
- `X-API-Key: <your_api_key>` (必需)

**查询参数:**
- `access_token`: 需要验证的访问令牌 (必需)

**响应:**
- 成功: HTTP 200 + Google原始令牌信息响应
- 失败: 返回相应错误状态码和消息

**示例:**
```bash
curl -H "X-API-Key: your_api_key" \
  "https://your-proxy-server.com/tokeninfo?access_token=ya29.a0AfH6SMC..."
```

## 配置

### 🔑 自动API Key生成

如果启动服务器时没有配置API Key，系统将自动生成一个安全的API Key并保存到用户配置缓存中：

- **缓存位置**: `~/.gmail-oauth-proxy/config.json`
- **自动生成**: 首次启动时自动创建
- **持久化**: 后续启动时自动使用缓存的API Key
- **安全性**: 使用加密随机数生成，文件权限设置为600

### 配置管理命令

```bash
# 显示当前配置（包括缓存信息）
./gmail-oauth-proxy config show

# 验证配置有效性
./gmail-oauth-proxy config validate

# 显示配置缓存信息
./gmail-oauth-proxy config cache

# 清除配置缓存（将重新生成API Key）
./gmail-oauth-proxy config clear
```

### 环境变量

- `OAUTH_PROXY_API_KEY`: API密钥（可选，未设置时自动生成）
- `OAUTH_PROXY_IP_WHITELIST`: IP白名单，逗号分隔（可选）
- `OAUTH_PROXY_PORT`: 服务端口（默认: 8080）
- `OAUTH_PROXY_ENVIRONMENT`: 运行环境（默认: development）
- `OAUTH_PROXY_LOG_LEVEL`: 日志级别（默认: info）
- `OAUTH_PROXY_TIMEOUT`: 请求超时时间秒数（默认: 10）

### 配置文件

可选的`config.yaml`文件，环境变量优先级更高。

## 安装和使用

### 安装

#### 方式一：下载预构建二进制文件

从 [GitHub Releases](https://github.com/cc11001100/gmail-oauth-proxy-server/releases) 下载最新版本：

```bash
# Linux AMD64
wget https://github.com/cc11001100/gmail-oauth-proxy-server/releases/latest/download/gmail-oauth-proxy-server_VERSION_linux_amd64.tar.gz
tar -xzf gmail-oauth-proxy-server_VERSION_linux_amd64.tar.gz

# macOS ARM64 (Apple Silicon)
wget https://github.com/cc11001100/gmail-oauth-proxy-server/releases/latest/download/gmail-oauth-proxy-server_VERSION_darwin_arm64.tar.gz
tar -xzf gmail-oauth-proxy-server_VERSION_darwin_arm64.tar.gz

# Windows AMD64
wget https://github.com/cc11001100/gmail-oauth-proxy-server/releases/latest/download/gmail-oauth-proxy-server_VERSION_windows_amd64.tar.gz
tar -xzf gmail-oauth-proxy-server_VERSION_windows_amd64.tar.gz
```

#### 方式二：从源码构建

```bash
# 克隆项目
git clone https://github.com/cc11001100/gmail-oauth-proxy-server.git
cd gmail-oauth-proxy-server

# 安装依赖
go mod tidy

# 构建
go build -o gmail-oauth-proxy main.go
```

#### 方式三：使用Go安装

```bash
go install github.com/cc11001100/gmail-oauth-proxy-server@latest
```

### 命令行使用

#### 查看帮助
```bash
./gmail-oauth-proxy --help
./gmail-oauth-proxy server --help
```

#### 启动服务器

**使用API Key认证:**
```bash
# 设置API Key
export OAUTH_PROXY_API_KEY="your-secret-api-key"

# 使用默认配置启动
./gmail-oauth-proxy server
```

**使用IP白名单认证:**
```bash
# 通过命令行参数设置IP白名单
./gmail-oauth-proxy server --ip-whitelist 192.168.1.0/24 --ip-whitelist 10.0.0.1

# 通过环境变量设置IP白名单
export OAUTH_PROXY_IP_WHITELIST="192.168.1.0/24,10.0.0.1,127.0.0.1"
./gmail-oauth-proxy server
```

**使用双重认证（API Key + IP白名单）:**
```bash
# 同时设置API Key和IP白名单
export OAUTH_PROXY_API_KEY="your-secret-api-key"
./gmail-oauth-proxy server --ip-whitelist 192.168.1.0/24

# 生产环境模式
./gmail-oauth-proxy server --env production --log-level warn
```

#### 查看版本信息
```bash
./gmail-oauth-proxy version
./gmail-oauth-proxy version --short
```

#### 配置管理
```bash
# 显示当前配置
./gmail-oauth-proxy config show

# 验证配置文件
./gmail-oauth-proxy config validate
```

### 开发环境快速启动

```bash
# 设置API Key
export OAUTH_PROXY_API_KEY="your-secret-api-key"

# 直接运行
go run main.go server --verbose
```

## 命令行选项

### 全局选项
- `--config` - 指定配置文件路径
- `--verbose, -v` - 启用详细输出模式
- `--no-color` - 禁用彩色输出

### server 子命令选项
- `--port, -p` - 服务器监听端口 (默认: 8080)
- `--api-key` - API认证密钥
- `--ip-whitelist` - IP白名单，支持CIDR格式 (可多次指定)
- `--log-level` - 日志级别 (debug|info|warn|error)
- `--env` - 运行环境 (development|production)

### 示例命令

```bash
# 启动服务器并显示详细日志
./gmail-oauth-proxy server --verbose --log-level debug

# 使用自定义配置文件
./gmail-oauth-proxy --config /path/to/config.yaml server

# 配置多个IP白名单
./gmail-oauth-proxy server --ip-whitelist 192.168.1.0/24 --ip-whitelist 10.0.0.1

# 禁用彩色输出
./gmail-oauth-proxy --no-color version

# 验证配置
./gmail-oauth-proxy config validate
```

## 鉴权机制

Gmail OAuth代理服务器支持两种鉴权方式，可以单独使用或组合使用：

### 1. API Key认证
通过HTTP头 `X-API-Key` 进行认证：
```bash
curl -H "X-API-Key: your-secret-api-key" http://localhost:8080/token
```

### 2. IP白名单认证
基于客户端IP地址进行访问控制，支持：
- **单个IP地址**: `192.168.1.100`
- **CIDR网段**: `192.168.1.0/24`
- **IPv6地址**: `::1`, `2001:db8::/32`

### 3. 鉴权策略

| 配置情况 | 验证逻辑 | 说明 |
|---------|---------|------|
| 只配置API Key | 验证API Key | 传统的API Key认证 |
| 只配置IP白名单 | 验证IP地址 | 基于IP的访问控制 |
| 同时配置两者 | API Key **AND** IP白名单 | 双重验证，两者都必须通过 |

### 4. 配置示例

**配置文件方式 (config.yaml):**
```yaml
# 只使用API Key
api_key: "your-secret-api-key"

# 只使用IP白名单
ip_whitelist:
  - "192.168.1.0/24"
  - "10.0.0.1"
  - "127.0.0.1"

# 双重认证
api_key: "your-secret-api-key"
ip_whitelist:
  - "192.168.1.0/24"
  - "10.0.0.1"
```

**环境变量方式:**
```bash
# 只使用API Key
export OAUTH_PROXY_API_KEY="your-secret-api-key"

# 只使用IP白名单
export OAUTH_PROXY_IP_WHITELIST="192.168.1.0/24,10.0.0.1,127.0.0.1"

# 双重认证
export OAUTH_PROXY_API_KEY="your-secret-api-key"
export OAUTH_PROXY_IP_WHITELIST="192.168.1.0/24,10.0.0.1"
```

## 健康检查

```bash
curl http://localhost:8080/health
```

## 安全注意事项

1. 确保在生产环境中使用HTTPS
2. 妥善保管API Key
3. 定期轮换API Key
4. 监控日志中的异常访问

## 发布和分发

本项目使用 [GoReleaser](https://goreleaser.com/) 进行自动化多平台二进制构建。每个发布版本包含：

- **Linux**: amd64, arm64, armv6, armv7
- **Windows**: amd64
- **macOS**: amd64, arm64 (Intel 和 Apple Silicon)
- **FreeBSD**: amd64

所有二进制文件都会自动构建并发布到 GitHub Releases，并提供校验和用于验证。

## 贡献

1. Fork 本仓库
2. 创建您的功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交您的更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 打开一个 Pull Request

## 许可证

本项目采用 MIT 许可证 - 详情请参阅 [LICENSE](LICENSE) 文件。

---

**Gmail OAuth Proxy Server** - 安全、高效的 OAuth 代理服务

[🌐 访问现代化官网](https://cc11001100.github.io/gmail-oauth-proxy-server/) | [📚 查看文档](https://cc11001100.github.io/gmail-oauth-proxy-server/documentation) | [💾 下载最新版本](https://cc11001100.github.io/gmail-oauth-proxy-server/download)
