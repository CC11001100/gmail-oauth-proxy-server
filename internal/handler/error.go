package handler

import (
	"gmail-oauth-proxy-server/internal/logger"
	"net/http"

	"github.com/gin-gonic/gin"
)

// ErrorResponse 错误响应结构（遵循Google OAuth 2.0和RFC 6749标准）
type ErrorResponse struct {
	Error            string `json:"error"`
	ErrorDescription string `json:"error_description,omitempty"`
	ErrorURI         string `json:"error_uri,omitempty"`
}

// ErrorHandler 全局错误处理中间件
func ErrorHandler() gin.HandlerFunc {
	return gin.CustomRecovery(func(c *gin.Context, recovered interface{}) {
		if err, ok := recovered.(string); ok {
			logger.Error("Panic recovered: %s", err)
			c.JSON(http.StatusInternalServerError, ErrorResponse{
				Error:            "server_error",
				ErrorDescription: "Internal server error",
				ErrorURI:         "https://tools.ietf.org/html/rfc6749#section-5.2",
			})
		}
		c.Abort()
	})
}

// HandleValidationError 处理验证错误
func HandleValidationError(c *gin.Context, err error) {
	logger.Warn("Validation error: %v", err)
	c.JSON(http.StatusBadRequest, ErrorResponse{
		Error:            "invalid_request",
		ErrorDescription: err.Error(),
		ErrorURI:         "https://tools.ietf.org/html/rfc6749#section-4.1.2.1",
	})
}

// HandleAuthError 处理认证错误
func HandleAuthError(c *gin.Context, message string) {
	logger.Warn("Authentication error: %s", message)
	c.JSON(http.StatusUnauthorized, ErrorResponse{
		Error:            "unauthorized_client",
		ErrorDescription: message,
		ErrorURI:         "https://tools.ietf.org/html/rfc6749#section-4.1.2.1",
	})
}

// HandleProxyError 处理代理错误
func HandleProxyError(c *gin.Context, err error) {
	logger.Error("Proxy error: %v", err)
	c.JSON(http.StatusBadGateway, ErrorResponse{
		Error:            "temporarily_unavailable",
		ErrorDescription: "Failed to communicate with OAuth provider",
		ErrorURI:         "https://tools.ietf.org/html/rfc6749#section-4.1.2.1",
	})
}

// HandleInternalError 处理内部错误
func HandleInternalError(c *gin.Context, err error) {
	logger.Error("Internal error: %v", err)
	c.JSON(http.StatusInternalServerError, ErrorResponse{
		Error:            "server_error",
		ErrorDescription: "Internal server error",
		ErrorURI:         "https://tools.ietf.org/html/rfc6749#section-5.2",
	})
}

// HandleAuthorizationError 处理授权头错误
func HandleAuthorizationError(c *gin.Context, err error) {
	logger.Warn("Authorization error: %v", err)
	c.JSON(http.StatusUnauthorized, ErrorResponse{
		Error:            "invalid_token",
		ErrorDescription: err.Error(),
		ErrorURI:         "https://tools.ietf.org/html/rfc6750#section-3.1",
	})
}
