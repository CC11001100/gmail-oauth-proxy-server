# Gmail OAuth Proxy Server

[![Go Version](https://img.shields.io/badge/Go-1.21+-blue.svg)](https://golang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Website](https://img.shields.io/badge/Website-🌐%20Live-blue.svg)](http://www.cc11001100.com/gmail-oauth-proxy-server/)
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-🚀%20Modern%20Website-brightgreen.svg)](http://www.cc11001100.com/gmail-oauth-proxy-server/)

A Google OAuth proxy service implemented with Go and Gin framework for securely proxying OAuth token exchange requests.

## 🌐 现代化官方网站

我们为这个项目创建了一个现代化的官方网站，包含：

- 🎨 **现代化设计**: 使用 TypeScript + React + Material-UI 构建
- 🌓 **主题切换**: 支持浅色/深色模式
- 🌍 **国际化**: 中英文双语支持
- 📱 **响应式设计**: 完美适配所有设备
- ⚡ **快速加载**: 优化的性能和用户体验
- 🔧 **在线工具**: 参数编辑器和配置生成器

**访问地址**: [http://www.cc11001100.com/gmail-oauth-proxy-server/](http://www.cc11001100.com/gmail-oauth-proxy-server/)

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

## ✨ Features

- 🔐 **Dual Authentication**: Supports both API Key and IP whitelist authentication mechanisms
- 🛡️ **Flexible Authorization**: Can use API Key and IP whitelist individually or in combination
- 🔒 **HTTPS Enforcement**: Forces HTTPS protocol (except in development environment)
- 🌐 **IP Whitelist**: Supports CIDR format and individual IP address access control
- 🛡️ **Log Sanitization**: Automatically sanitizes sensitive information like tokens, secrets, etc.
- ⚡ **Request Proxy**: Converts JSON requests to form-urlencoded format and forwards to Google OAuth API
- 🚨 **Error Handling**: Comprehensive error handling and logging
- ⚙️ **Configuration Management**: Supports configuration files and environment variables
- 🎨 **Command Line Interface**: Uses Cobra framework with colorful output and subcommands
- 📊 **Monitoring Tools**: Built-in version information, configuration validation, and other management tools

## 🚀 Quick Start

### Option 1: Download Pre-built Binaries

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

### Option 2: Build from Source

```bash
# Clone the repository
git clone https://github.com/cc11001100/gmail-oauth-proxy-server.git
cd gmail-oauth-proxy-server

# Install dependencies
go mod tidy

# Build
go build -o gmail-oauth-proxy main.go
```

### Option 3: Install with Go

```bash
go install github.com/cc11001100/gmail-oauth-proxy-server@latest
```

## 🚀 Usage

### Start Server

```bash
# Using API Key Authentication
export OAUTH_PROXY_API_KEY="your-secret-api-key"
./gmail-oauth-proxy server

# Using IP Whitelist Authentication
./gmail-oauth-proxy server --ip-whitelist 192.168.1.0/24 --ip-whitelist 10.0.0.1

# Using Dual Authentication (API Key + IP Whitelist)
export OAUTH_PROXY_API_KEY="your-secret-api-key"
./gmail-oauth-proxy server --ip-whitelist 192.168.1.0/24

# Production environment mode
./gmail-oauth-proxy server --env production --log-level warn
```

### View Help

```bash
./gmail-oauth-proxy --help
./gmail-oauth-proxy server --help
```

### Configuration Management

```bash
# Show current configuration
./gmail-oauth-proxy config show

# Validate configuration
./gmail-oauth-proxy config validate

# Show configuration cache information
./gmail-oauth-proxy config cache

# Clear configuration cache (will regenerate API Key)
./gmail-oauth-proxy config clear
```

## 🔧 Configuration

### Environment Variables

- `OAUTH_PROXY_API_KEY`: API key (optional, auto-generated if not set)
- `OAUTH_PROXY_IP_WHITELIST`: IP whitelist, comma-separated (optional)
- `OAUTH_PROXY_PORT`: Server port (default: 8080)
- `OAUTH_PROXY_ENVIRONMENT`: Runtime environment (default: development)
- `OAUTH_PROXY_LOG_LEVEL`: Log level (default: info)
- `OAUTH_PROXY_TIMEOUT`: Request timeout in seconds (default: 10)

### Configuration File

Optional `config.yaml` file, environment variables take higher priority.

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

## 🔐 Authentication Mechanisms

Gmail OAuth Proxy Server supports two authentication methods that can be used individually or in combination:

### 1. API Key Authentication

Authenticate via HTTP header `X-API-Key`:

```bash
curl -H "X-API-Key: your-secret-api-key" http://localhost:8080/token
```

### 2. IP Whitelist Authentication

Access control based on client IP address, supports:
- Individual IP addresses: `192.168.1.100`
- CIDR networks: `192.168.1.0/24`
- IPv6 addresses: `::1`, `2001:db8::/32`

### 3. Authentication Strategy

| Configuration | Validation Logic | Description |
|---------------|------------------|-------------|
| API Key only | Validate API Key | Traditional API Key authentication |
| IP whitelist only | Validate IP address | IP-based access control |
| Both configured | API Key **AND** IP whitelist | Dual verification, both must pass |

## 📚 API Specification

### POST /token

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

## 🏥 Health Check

```bash
curl http://localhost:8080/health
```

## 🔒 Security Considerations

- Ensure HTTPS is used in production environments
- Keep API Keys secure
- Regularly rotate API Keys
- Monitor logs for abnormal access

## 🌟 Features in Detail

### 🔑 Automatic API Key Generation

If no API Key is configured when starting the server, the system will automatically generate a secure API Key and save it to the user configuration cache:

- **Cache Location**: `~/.gmail-oauth-proxy/config.json`
- **Auto Generation**: Automatically created on first startup
- **Persistence**: Automatically uses cached API Key on subsequent startups
- **Security**: Generated using cryptographic random numbers, file permissions set to 600

## 📦 Release and Distribution

This project uses [GoReleaser](https://goreleaser.com/) for automated multi-platform binary builds. Each release includes:

- **Linux**: amd64, arm64, armv6, armv7
- **Windows**: amd64
- **macOS**: amd64, arm64 (Intel and Apple Silicon)
- **FreeBSD**: amd64

All binaries are automatically built and published to GitHub Releases with checksums for verification.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Gmail OAuth Proxy Server** - 安全、高效的 OAuth 代理服务

[🌐 访问现代化官网](http://www.cc11001100.com/gmail-oauth-proxy-server/) | [📚 查看文档](http://www.cc11001100.com/gmail-oauth-proxy-server/documentation) | [💾 下载最新版本](http://www.cc11001100.com/gmail-oauth-proxy-server/download)
