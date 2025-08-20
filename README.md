# Gmail OAuth Proxy Server

[English](#english) | [中文](#中文)

---

## English

A Google OAuth proxy service implemented with Go and Gin framework for securely proxying OAuth token exchange requests.

### Features

- **🔐 Dual Authentication**: Supports both API Key and IP whitelist authentication mechanisms
- **🛡️ Flexible Authorization**: Can use API Key and IP whitelist individually or in combination
- **🔒 HTTPS Enforcement**: Forces HTTPS protocol (except in development environment)
- **🌐 IP Whitelist**: Supports CIDR format and individual IP address access control
- **🛡️ Log Sanitization**: Automatically sanitizes sensitive information like tokens, secrets, etc.
- **⚡ Request Proxy**: Converts JSON requests to form-urlencoded format and forwards to Google OAuth API
- **🚨 Error Handling**: Comprehensive error handling and logging
- **⚙️ Configuration Management**: Supports configuration files and environment variables
- **🎨 Command Line Interface**: Uses Cobra framework with colorful output and subcommands
- **📊 Monitoring Tools**: Built-in version information, configuration validation, and other management tools

### API Specification

#### POST /token

OAuth token exchange endpoint

**Request Headers:**
- `Content-Type: application/json`
- `X-API-Key: <your_api_key>` (required)

**Request Body:**
```json
{
  "code": "4/0AeaYshBpVe...",
  "client_id": "your-client-id.apps.googleusercontent.com",
  "client_secret": "YOUR_CLIENT_SECRET",
  "redirect_uri": "https://yourdomain.com/auth/callback",
  "grant_type": "authorization_code"
}
```

**Response:**
- Success: HTTP 200 + Google's original response
- Failure: Returns appropriate error status code and message

### Configuration

#### 🔑 Automatic API Key Generation

If no API Key is configured when starting the server, the system will automatically generate a secure API Key and save it to the user configuration cache:

- **Cache Location**: `~/.gmail-oauth-proxy/config.json`
- **Auto Generation**: Automatically created on first startup
- **Persistence**: Automatically uses cached API Key on subsequent startups
- **Security**: Generated using cryptographic random numbers, file permissions set to 600

#### Configuration Management Commands

```bash
# Show current configuration (including cache information)
./gmail-oauth-proxy config show

# Validate configuration
./gmail-oauth-proxy config validate

# Show configuration cache information
./gmail-oauth-proxy config cache

# Clear configuration cache (will regenerate API Key)
./gmail-oauth-proxy config clear
```

#### Environment Variables

- `OAUTH_PROXY_API_KEY`: API key (optional, auto-generated if not set)
- `OAUTH_PROXY_IP_WHITELIST`: IP whitelist, comma-separated (optional)
- `OAUTH_PROXY_PORT`: Server port (default: 8080)
- `OAUTH_PROXY_ENVIRONMENT`: Runtime environment (default: development)
- `OAUTH_PROXY_LOG_LEVEL`: Log level (default: info)
- `OAUTH_PROXY_TIMEOUT`: Request timeout in seconds (default: 10)

#### Configuration File

Optional `config.yaml` file, environment variables take higher priority.

### Installation and Usage

#### Installation

##### Option 1: Download Pre-built Binaries

Download the latest release from [GitHub Releases](https://github.com/cc11001100/gmail-oauth-proxy-server/releases):

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

##### Option 2: Build from Source

```bash
# Clone the repository
git clone https://github.com/cc11001100/gmail-oauth-proxy-server.git
cd gmail-oauth-proxy-server

# Install dependencies
go mod tidy

# Build
go build -o gmail-oauth-proxy main.go
```

##### Option 3: Install with Go

```bash
go install github.com/cc11001100/gmail-oauth-proxy-server@latest
```

#### Command Line Usage

##### View Help
```bash
./gmail-oauth-proxy --help
./gmail-oauth-proxy server --help
```

##### Start Server

**Using API Key Authentication:**
```bash
# Set API Key
export OAUTH_PROXY_API_KEY="your-secret-api-key"

# Start with default configuration
./gmail-oauth-proxy server
```

**Using IP Whitelist Authentication:**
```bash
# Set IP whitelist via command line arguments
./gmail-oauth-proxy server --ip-whitelist 192.168.1.0/24 --ip-whitelist 10.0.0.1

# Set IP whitelist via environment variable
export OAUTH_PROXY_IP_WHITELIST="192.168.1.0/24,10.0.0.1,127.0.0.1"
./gmail-oauth-proxy server
```

**Using Dual Authentication (API Key + IP Whitelist):**
```bash
# Set both API Key and IP whitelist
export OAUTH_PROXY_API_KEY="your-secret-api-key"
./gmail-oauth-proxy server --ip-whitelist 192.168.1.0/24

# Production environment mode
./gmail-oauth-proxy server --env production --log-level warn
```

##### View Version Information
```bash
./gmail-oauth-proxy version
./gmail-oauth-proxy version --short
```

##### Configuration Management
```bash
# Show current configuration
./gmail-oauth-proxy config show

# Validate configuration file
./gmail-oauth-proxy config validate
```

#### Development Environment Quick Start

```bash
# Set API Key
export OAUTH_PROXY_API_KEY="your-secret-api-key"

# Run directly
go run main.go server --verbose
```

### Command Line Options

#### Global Options
- `--config` - Specify configuration file path
- `--verbose, -v` - Enable verbose output mode
- `--no-color` - Disable colorful output

#### server Subcommand Options
- `--port, -p` - Server listening port (default: 8080)
- `--api-key` - API authentication key
- `--ip-whitelist` - IP whitelist, supports CIDR format (can be specified multiple times)
- `--log-level` - Log level (debug|info|warn|error)
- `--env` - Runtime environment (development|production)

#### Example Commands

```bash
# Start server with verbose logging
./gmail-oauth-proxy server --verbose --log-level debug

# Use custom configuration file
./gmail-oauth-proxy --config /path/to/config.yaml server

# Configure multiple IP whitelists
./gmail-oauth-proxy server --ip-whitelist 192.168.1.0/24 --ip-whitelist 10.0.0.1

# Disable colorful output
./gmail-oauth-proxy --no-color version

# Validate configuration
./gmail-oauth-proxy config validate
```

### Authentication Mechanisms

Gmail OAuth Proxy Server supports two authentication methods that can be used individually or in combination:

#### 1. API Key Authentication
Authenticate via HTTP header `X-API-Key`:
```bash
curl -H "X-API-Key: your-secret-api-key" http://localhost:8080/token
```

#### 2. IP Whitelist Authentication
Access control based on client IP address, supports:
- **Individual IP addresses**: `192.168.1.100`
- **CIDR networks**: `192.168.1.0/24`
- **IPv6 addresses**: `::1`, `2001:db8::/32`

#### 3. Authentication Strategy

| Configuration | Validation Logic | Description |
|---------------|------------------|-------------|
| API Key only | Validate API Key | Traditional API Key authentication |
| IP whitelist only | Validate IP address | IP-based access control |
| Both configured | API Key **AND** IP whitelist | Dual verification, both must pass |

#### 4. Configuration Examples

**Configuration file method (config.yaml):**
```yaml
# API Key only
api_key: "your-secret-api-key"

# IP whitelist only
ip_whitelist:
  - "192.168.1.0/24"
  - "10.0.0.1"
  - "127.0.0.1"

# Dual authentication
api_key: "your-secret-api-key"
ip_whitelist:
  - "192.168.1.0/24"
  - "10.0.0.1"
```

**Environment variable method:**
```bash
# API Key only
export OAUTH_PROXY_API_KEY="your-secret-api-key"

# IP whitelist only
export OAUTH_PROXY_IP_WHITELIST="192.168.1.0/24,10.0.0.1,127.0.0.1"

# Dual authentication
export OAUTH_PROXY_API_KEY="your-secret-api-key"
export OAUTH_PROXY_IP_WHITELIST="192.168.1.0/24,10.0.0.1"
```

### Health Check

```bash
curl http://localhost:8080/health
```

### Security Considerations

1. Ensure HTTPS is used in production environments
2. Keep API Keys secure
3. Regularly rotate API Keys
4. Monitor logs for abnormal access

### Release and Distribution

This project uses [GoReleaser](https://goreleaser.com/) for automated multi-platform binary builds. Each release includes:

- **Linux**: amd64, arm64, armv6, armv7
- **Windows**: amd64
- **macOS**: amd64, arm64 (Intel and Apple Silicon)
- **FreeBSD**: amd64

All binaries are automatically built and published to GitHub Releases with checksums for verification.

### Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 中文

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

### POST /token

OAuth token交换端点

**请求头:**
- `Content-Type: application/json`
- `X-API-Key: <your_api_key>` (必需)

**请求体:**
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
