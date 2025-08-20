package middleware

import (
	"bytes"
	"encoding/json"
	"gmail-oauth-proxy-server/internal/logger"
	"io"

	"github.com/gin-gonic/gin"
)

// Logger 日志中间件
func Logger() gin.HandlerFunc {
	return gin.LoggerWithFormatter(func(param gin.LogFormatterParams) string {
		// 记录请求信息
		logData := map[string]interface{}{
			"timestamp":   param.TimeStamp.Format("2006-01-02 15:04:05"),
			"method":      param.Method,
			"path":        param.Path,
			"status_code": param.StatusCode,
			"latency":     param.Latency.String(),
			"client_ip":   param.ClientIP,
			"user_agent":  param.Request.UserAgent(),
		}

		// 脱敏处理
		sanitized := logger.SanitizeForLog(logData)

		if param.StatusCode >= 400 {
			logger.Error("Request failed: %+v", sanitized)
		} else {
			logger.Info("Request completed: %+v", sanitized)
		}

		return ""
	})
}

// RequestLogger 记录请求体的中间件
func RequestLogger() gin.HandlerFunc {
	return func(c *gin.Context) {
		// 读取请求体
		var bodyBytes []byte
		if c.Request.Body != nil {
			bodyBytes, _ = io.ReadAll(c.Request.Body)
		}

		// 恢复请求体
		c.Request.Body = io.NopCloser(bytes.NewBuffer(bodyBytes))

		// 解析JSON并脱敏
		if len(bodyBytes) > 0 && c.GetHeader("Content-Type") == "application/json" {
			var requestData map[string]interface{}
			if err := json.Unmarshal(bodyBytes, &requestData); err == nil {
				sanitized := logger.SanitizeForLog(requestData)
				logger.Debug("Request body: %+v", sanitized)
			}
		}

		c.Next()
	}
}
