package middleware

import (
	"gmail-oauth-proxy-server/internal/logger"
	"net/http"

	"github.com/gin-gonic/gin"
)

// AuthConfig 鉴权配置
type AuthConfig struct {
	APIKey      string
	IPWhitelist []string
}

// UnifiedAuth 统一鉴权中间件
// 支持API Key和IP白名单双重验证
func UnifiedAuth(config AuthConfig) gin.HandlerFunc {
	return func(c *gin.Context) {
		clientIP := getClientIP(c)

		// 检查是否配置了任何鉴权方式
		hasAPIKey := config.APIKey != ""
		hasIPWhitelist := len(config.IPWhitelist) > 0

		if !hasAPIKey && !hasIPWhitelist {
			logger.Warn("No authentication method configured")
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "Authentication not configured",
				"code":  "AUTH_NOT_CONFIGURED",
			})
			c.Abort()
			return
		}

		// 验证结果
		apiKeyValid := false
		ipWhitelistValid := false

		// API Key验证
		if hasAPIKey {
			requestAPIKey := c.GetHeader("X-API-Key")
			if requestAPIKey == "" {
				logger.Debug("Missing X-API-Key header from %s", clientIP)
			} else if requestAPIKey != config.APIKey {
				logger.Warn("Invalid API key from %s", clientIP)
			} else {
				apiKeyValid = true
				logger.Debug("API key validation successful for %s", clientIP)
			}
		}

		// IP白名单验证
		if hasIPWhitelist {
			if isIPAllowed(clientIP, config.IPWhitelist) {
				ipWhitelistValid = true
				logger.Debug("IP whitelist validation successful for %s", clientIP)
			} else {
				logger.Debug("IP whitelist validation failed for %s", clientIP)
			}
		}

		// 鉴权逻辑判断
		authPassed := false
		var errorMsg string
		var errorCode string

		if hasAPIKey && hasIPWhitelist {
			// 两种方式都配置：都必须通过（AND逻辑）
			if apiKeyValid && ipWhitelistValid {
				authPassed = true
			} else {
				if !apiKeyValid && !ipWhitelistValid {
					errorMsg = "Both API key and IP address validation failed"
					errorCode = "AUTH_BOTH_FAILED"
				} else if !apiKeyValid {
					errorMsg = "API key validation failed"
					errorCode = "AUTH_API_KEY_FAILED"
				} else {
					errorMsg = "IP address not allowed"
					errorCode = "AUTH_IP_FAILED"
				}
			}
		} else if hasAPIKey {
			// 只配置API Key
			if apiKeyValid {
				authPassed = true
			} else {
				if c.GetHeader("X-API-Key") == "" {
					errorMsg = "Missing X-API-Key header"
					errorCode = "AUTH_API_KEY_MISSING"
				} else {
					errorMsg = "Invalid API key"
					errorCode = "AUTH_API_KEY_INVALID"
				}
			}
		} else if hasIPWhitelist {
			// 只配置IP白名单
			if ipWhitelistValid {
				authPassed = true
			} else {
				errorMsg = "IP address not allowed"
				errorCode = "AUTH_IP_NOT_ALLOWED"
			}
		}

		if !authPassed {
			logger.Warn("Authentication failed for %s: %s", clientIP, errorMsg)
			statusCode := http.StatusUnauthorized
			if errorCode == "AUTH_IP_NOT_ALLOWED" || errorCode == "AUTH_IP_FAILED" {
				statusCode = http.StatusForbidden
			}

			c.JSON(statusCode, gin.H{
				"error": errorMsg,
				"code":  errorCode,
			})
			c.Abort()
			return
		}

		logger.Info("Authentication successful for %s", clientIP)
		c.Next()
	}
}
