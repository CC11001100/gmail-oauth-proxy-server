package middleware

import (
	"gmail-oauth-proxy-server/internal/logger"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

// HTTPS 强制HTTPS中间件
func HTTPS() gin.HandlerFunc {
	return func(c *gin.Context) {
		// 检查是否为HTTPS请求
		if c.Request.Header.Get("X-Forwarded-Proto") == "http" ||
			(c.Request.TLS == nil && c.Request.Header.Get("X-Forwarded-Proto") != "https") {

			// 在开发环境中可能不使用HTTPS，可以通过环境变量控制
			host := c.Request.Host
			if strings.HasPrefix(host, "localhost") || strings.HasPrefix(host, "127.0.0.1") {
				logger.Debug("Allowing HTTP for localhost: %s", host)
				c.Next()
				return
			}

			logger.Warn("HTTP request rejected from %s", c.ClientIP())
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "HTTPS required",
			})
			c.Abort()
			return
		}

		c.Next()
	}
}
