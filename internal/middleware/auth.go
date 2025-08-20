package middleware

import (
	"gmail-oauth-proxy-server/internal/logger"
	"net/http"

	"github.com/gin-gonic/gin"
)

// APIKeyAuth API Key认证中间件
func APIKeyAuth(apiKey string) gin.HandlerFunc {
	return func(c *gin.Context) {
		// 获取请求头中的API Key
		requestAPIKey := c.GetHeader("X-API-Key")

		if requestAPIKey == "" {
			logger.Warn("Missing X-API-Key header from %s", c.ClientIP())
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "Missing X-API-Key header",
				"code":  "AUTH_ERROR",
			})
			c.Abort()
			return
		}

		if requestAPIKey != apiKey {
			logger.Warn("Invalid API key from %s", c.ClientIP())
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "Invalid API key",
				"code":  "AUTH_ERROR",
			})
			c.Abort()
			return
		}

		logger.Debug("API key validation successful for %s", c.ClientIP())
		c.Next()
	}
}
