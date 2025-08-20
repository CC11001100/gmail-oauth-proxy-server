package handler

import (
	"gmail-oauth-proxy-server/internal/config"
	"gmail-oauth-proxy-server/internal/middleware"
	"net/http"

	"github.com/gin-gonic/gin"
)

// RegisterRoutes 注册路由
func RegisterRoutes(r *gin.Engine, cfg *config.Config) {
	// 创建OAuth处理器
	oauthHandler := NewOAuthHandler(cfg)

	// 健康检查端点（不需要认证）
	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status":  "ok",
			"service": "gmail-oauth-proxy-server",
		})
	})

	// API路由组（需要认证）
	api := r.Group("/")
	{
		// 添加API Key认证中间件
		api.Use(middleware.APIKeyAuth(cfg.APIKey))
		// 添加请求日志中间件
		api.Use(middleware.RequestLogger())

		// OAuth token端点
		api.POST("/token", oauthHandler.TokenHandler)
	}
}
