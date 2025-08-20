package middleware

import (
	"net"
	"net/http"
	"strings"
	"gmail-oauth-proxy-server/internal/logger"

	"github.com/gin-gonic/gin"
)

// IPWhitelistAuth IP白名单认证中间件
func IPWhitelistAuth(whitelist []string) gin.HandlerFunc {
	return func(c *gin.Context) {
		if len(whitelist) == 0 {
			// 如果没有配置IP白名单，则跳过验证
			c.Next()
			return
		}

		clientIP := getClientIP(c)
		
		if !isIPAllowed(clientIP, whitelist) {
			logger.Warn("IP access denied for %s", clientIP)
			c.JSON(http.StatusForbidden, gin.H{
				"error": "IP address not allowed",
				"code":  "IP_FORBIDDEN",
			})
			c.Abort()
			return
		}

		logger.Debug("IP whitelist validation successful for %s", clientIP)
		c.Next()
	}
}

// getClientIP 获取客户端真实IP地址
func getClientIP(c *gin.Context) string {
	// 优先从X-Forwarded-For头获取
	if xff := c.GetHeader("X-Forwarded-For"); xff != "" {
		// X-Forwarded-For可能包含多个IP，取第一个
		ips := strings.Split(xff, ",")
		if len(ips) > 0 {
			return strings.TrimSpace(ips[0])
		}
	}

	// 从X-Real-IP头获取
	if xri := c.GetHeader("X-Real-IP"); xri != "" {
		return strings.TrimSpace(xri)
	}

	// 从RemoteAddr获取
	ip, _, err := net.SplitHostPort(c.Request.RemoteAddr)
	if err != nil {
		return c.Request.RemoteAddr
	}
	return ip
}

// isIPAllowed 检查IP是否在白名单中
func isIPAllowed(clientIP string, whitelist []string) bool {
	clientIPAddr := net.ParseIP(clientIP)
	if clientIPAddr == nil {
		logger.Error("Invalid client IP address: %s", clientIP)
		return false
	}

	for _, allowedIP := range whitelist {
		allowedIP = strings.TrimSpace(allowedIP)
		if allowedIP == "" {
			continue
		}

		// 检查是否为CIDR格式
		if strings.Contains(allowedIP, "/") {
			_, ipNet, err := net.ParseCIDR(allowedIP)
			if err != nil {
				logger.Error("Invalid CIDR format in whitelist: %s", allowedIP)
				continue
			}
			if ipNet.Contains(clientIPAddr) {
				logger.Debug("Client IP %s matches CIDR %s", clientIP, allowedIP)
				return true
			}
		} else {
			// 单个IP地址
			allowedIPAddr := net.ParseIP(allowedIP)
			if allowedIPAddr == nil {
				logger.Error("Invalid IP address in whitelist: %s", allowedIP)
				continue
			}
			if clientIPAddr.Equal(allowedIPAddr) {
				logger.Debug("Client IP %s matches allowed IP %s", clientIP, allowedIP)
				return true
			}
		}
	}

	return false
}
