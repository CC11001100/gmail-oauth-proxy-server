package handler

import (
	"net/http"
	"gmail-oauth-proxy-server/internal/logger"
	
	"github.com/gin-gonic/gin"
)

// ErrorResponse 错误响应结构
type ErrorResponse struct {
	Error   string `json:"error"`
	Details string `json:"details,omitempty"`
	Code    string `json:"code,omitempty"`
}

// ErrorHandler 全局错误处理中间件
func ErrorHandler() gin.HandlerFunc {
	return gin.CustomRecovery(func(c *gin.Context, recovered interface{}) {
		if err, ok := recovered.(string); ok {
			logger.Error("Panic recovered: %s", err)
			c.JSON(http.StatusInternalServerError, ErrorResponse{
				Error: "Internal server error",
				Code:  "INTERNAL_ERROR",
			})
		}
		c.Abort()
	})
}

// HandleValidationError 处理验证错误
func HandleValidationError(c *gin.Context, err error) {
	logger.Warn("Validation error: %v", err)
	c.JSON(http.StatusBadRequest, ErrorResponse{
		Error:   "Validation failed",
		Details: err.Error(),
		Code:    "VALIDATION_ERROR",
	})
}

// HandleAuthError 处理认证错误
func HandleAuthError(c *gin.Context, message string) {
	logger.Warn("Authentication error: %s", message)
	c.JSON(http.StatusUnauthorized, ErrorResponse{
		Error: message,
		Code:  "AUTH_ERROR",
	})
}

// HandleProxyError 处理代理错误
func HandleProxyError(c *gin.Context, err error) {
	logger.Error("Proxy error: %v", err)
	c.JSON(http.StatusBadGateway, ErrorResponse{
		Error: "Failed to communicate with OAuth provider",
		Code:  "PROXY_ERROR",
	})
}

// HandleInternalError 处理内部错误
func HandleInternalError(c *gin.Context, err error) {
	logger.Error("Internal error: %v", err)
	c.JSON(http.StatusInternalServerError, ErrorResponse{
		Error: "Internal server error",
		Code:  "INTERNAL_ERROR",
	})
}
