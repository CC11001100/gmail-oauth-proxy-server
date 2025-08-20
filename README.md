# Gmail OAuth Proxy Server

一个使用Go和Gin框架实现的谷歌OAuth代理服务，用于安全地代理OAuth token交换请求。

## 功能特性

- **安全认证**: 使用API Key进行请求认证
- **HTTPS强制**: 强制使用HTTPS协议（开发环境除外）
- **日志脱敏**: 自动脱敏敏感信息如token、secret等
- **请求代理**: 将JSON请求转换为form-urlencoded格式并转发到Google OAuth API
- **错误处理**: 完善的错误处理和日志记录
- **配置管理**: 支持配置文件和环境变量

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

### 环境变量

- `OAUTH_PROXY_API_KEY`: API密钥（必需）
- `OAUTH_PROXY_PORT`: 服务端口（默认: 8080）
- `OAUTH_PROXY_ENVIRONMENT`: 运行环境（默认: development）
- `OAUTH_PROXY_LOG_LEVEL`: 日志级别（默认: info）
- `OAUTH_PROXY_TIMEOUT`: 请求超时时间秒数（默认: 10）

### 配置文件

可选的`config.yaml`文件，环境变量优先级更高。

## 运行

### 开发环境

```bash
# 设置API Key
export OAUTH_PROXY_API_KEY="your-secret-api-key"

# 安装依赖
go mod tidy

# 运行服务
go run cmd/server/main.go
```

### 生产环境

```bash
# 构建
go build -o oauth-proxy-server cmd/server/main.go

# 运行
./oauth-proxy-server
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
