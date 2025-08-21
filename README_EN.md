# Gmail OAuth Proxy Server

**English** | [中文](README.md)

[![Go Version](https://img.shields.io/badge/Go-1.21+-blue.svg)](https://golang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Website](https://img.shields.io/badge/Website-🌐%20Live-blue.svg)](https://cc11001100.github.io/gmail-oauth-proxy-server/)
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-🚀%20Modern%20Website-brightgreen.svg)](https://cc11001100.github.io/gmail-oauth-proxy-server/)

A Google OAuth proxy service implemented with Go and Gin framework for securely proxying OAuth token exchange requests.

## 🌐 Modern Official Website

We have created a modern official website for this project, featuring:

- 🎨 **Modern Design**: Built with TypeScript + React + Material-UI
- 🌓 **Theme Toggle**: Support for light/dark mode
- 🌍 **Internationalization**: Bilingual support for Chinese and English
- 📱 **Responsive Design**: Perfect adaptation to all devices
- ⚡ **Fast Loading**: Optimized performance and user experience
- 🔧 **Online Tools**: Parameter editor and configuration generator

**Visit**: [https://cc11001100.github.io/gmail-oauth-proxy-server/](https://cc11001100.github.io/gmail-oauth-proxy-server/)

### 🚀 Local Website Development

```bash
cd website
npm install
npm run dev
```

### 🔨 Build Website

```bash
cd website
npm run build
./deploy.sh
```

## Features

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

## API Specification

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
- Success: HTTP 200 + Google original response
- Failure: Returns corresponding error status code and message

## Configuration

### 🔑 Automatic API Key Generation

If no API Key is configured when starting the server, the system will automatically generate a secure API Key and save it to the user configuration cache:

- **Cache Location**: `~/.gmail-oauth-proxy/config.json`
- **Auto Generation**: Automatically created on first startup
- **Persistence**: Automatically uses cached API Key on subsequent startups
- **Security**: Generated using cryptographic random numbers, file permissions set to 600

### Configuration Management Commands

```bash
# Show current configuration (including cache information)
./gmail-oauth-proxy config show

# Validate configuration validity
./gmail-oauth-proxy config validate

# Show configuration cache information
./gmail-oauth-proxy config cache

# Clear configuration cache (will regenerate API Key)
./gmail-oauth-proxy config clear
```

### Environment Variables

- `OAUTH_PROXY_API_KEY`: API key (optional, auto-generated if not set)
- `OAUTH_PROXY_IP_WHITELIST`: IP whitelist, comma-separated (optional)
- `OAUTH_PROXY_PORT`: Service port (default: 8080)
- `OAUTH_PROXY_ENVIRONMENT`: Runtime environment (default: development)
- `OAUTH_PROXY_LOG_LEVEL`: Log level (default: info)
- `OAUTH_PROXY_TIMEOUT`: Request timeout in seconds (default: 10)

### Configuration File

Optional `config.yaml` file, environment variables have higher priority.

## Installation and Usage

### Installation

#### Method 1: Download Pre-built Binaries

Download the latest version from [GitHub Releases](https://github.com/cc11001100/gmail-oauth-proxy-server/releases):

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

#### Method 2: Build from Source

```bash
# Clone the project
git clone https://github.com/cc11001100/gmail-oauth-proxy-server.git
cd gmail-oauth-proxy-server

# Install dependencies
go mod tidy

# Build
go build -o gmail-oauth-proxy main.go
```

#### Method 3: Install with Go

```bash
go install github.com/cc11001100/gmail-oauth-proxy-server@latest
```

### Command Line Usage

#### View Help
```bash
./gmail-oauth-proxy --help
./gmail-oauth-proxy server --help
```

#### Start Server

**Using API Key Authentication:**
```bash
# Set API Key
export OAUTH_PROXY_API_KEY="your-secret-api-key"

# Start with default configuration
./gmail-oauth-proxy server
```

**Using IP Whitelist Authentication:**
```bash
# Set IP whitelist via command line parameters
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

#### View Version Information
```bash
./gmail-oauth-proxy version
./gmail-oauth-proxy version --short
```

#### Configuration Management
```bash
# Show current configuration
./gmail-oauth-proxy config show

# Validate configuration file
./gmail-oauth-proxy config validate
```

### Quick Start for Development

```bash
# Set API Key
export OAUTH_PROXY_API_KEY="your-secret-api-key"

# Run directly
go run main.go server --verbose
```

## Command Line Options

### Global Options
- `--config` - Specify configuration file path
- `--verbose, -v` - Enable verbose output mode
- `--no-color` - Disable colored output

### server Subcommand Options
- `--port, -p` - Server listening port (default: 8080)
- `--api-key` - API authentication key
- `--ip-whitelist` - IP whitelist, supports CIDR format (can be specified multiple times)
- `--log-level` - Log level (debug|info|warn|error)
- `--env` - Runtime environment (development|production)

### Example Commands

```bash
# Start server with verbose logging
./gmail-oauth-proxy server --verbose --log-level debug

# Use custom configuration file
./gmail-oauth-proxy --config /path/to/config.yaml server

# Configure multiple IP whitelists
./gmail-oauth-proxy server --ip-whitelist 192.168.1.0/24 --ip-whitelist 10.0.0.1

# Disable colored output
./gmail-oauth-proxy --no-color version

# Validate configuration
./gmail-oauth-proxy config validate
```

## Authentication Mechanisms

Gmail OAuth Proxy Server supports two authentication methods, which can be used individually or in combination:

### 1. API Key Authentication
Authenticate via HTTP header `X-API-Key`:
```bash
curl -H "X-API-Key: your-secret-api-key" http://localhost:8080/token
```

### 2. IP Whitelist Authentication
Access control based on client IP address, supports:
- **Single IP Address**: `192.168.1.100`
- **CIDR Network**: `192.168.1.0/24`
- **IPv6 Address**: `::1`, `2001:db8::/32`

### 3. Authentication Strategy

| Configuration | Validation Logic | Description |
|--------------|------------------|-------------|
| API Key Only | Validate API Key | Traditional API Key authentication |
| IP Whitelist Only | Validate IP Address | IP-based access control |
| Both Configured | API Key **AND** IP Whitelist | Dual verification, both must pass |

### 4. Configuration Examples

**Configuration File Method (config.yaml):**
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

**Environment Variable Method:**
```bash
# API Key only
export OAUTH_PROXY_API_KEY="your-secret-api-key"

# IP whitelist only
export OAUTH_PROXY_IP_WHITELIST="192.168.1.0/24,10.0.0.1,127.0.0.1"

# Dual authentication
export OAUTH_PROXY_API_KEY="your-secret-api-key"
export OAUTH_PROXY_IP_WHITELIST="192.168.1.0/24,10.0.0.1"
```

## Health Check

```bash
curl http://localhost:8080/health
```

## Security Considerations

1. Ensure HTTPS is used in production environments
2. Keep API Keys secure
3. Rotate API Keys regularly
4. Monitor logs for abnormal access

## Release and Distribution

This project uses [GoReleaser](https://goreleaser.com/) for automated multi-platform binary builds. Each release includes:

- **Linux**: amd64, arm64, armv6, armv7
- **Windows**: amd64
- **macOS**: amd64, arm64 (Intel and Apple Silicon)
- **FreeBSD**: amd64

All binaries are automatically built and published to GitHub Releases with checksums for verification.

## Contributing

1. Fork this repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Gmail OAuth Proxy Server** - Secure and efficient OAuth proxy service

[🌐 Visit Modern Website](https://cc11001100.github.io/gmail-oauth-proxy-server/) | [📚 View Documentation](https://cc11001100.github.io/gmail-oauth-proxy-server/documentation) | [💾 Download Latest](https://cc11001100.github.io/gmail-oauth-proxy-server/download)
