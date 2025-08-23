package handler

import (
	"gmail-oauth-proxy-server/internal/config"
	"gmail-oauth-proxy-server/internal/logger"
	"gmail-oauth-proxy-server/internal/middleware"
	"net/http"

	"github.com/gin-gonic/gin"
)

// RegisterRoutes 注册路由
func RegisterRoutes(r *gin.Engine, cfg *config.Config) {
	// 创建OAuth处理器
	oauthHandler := NewOAuthHandler(cfg)

	// 首页路由（不需要认证）- 重定向到GitHub Pages API文档
	r.GET("/", func(c *gin.Context) {
		c.Redirect(http.StatusMovedPermanently, "https://cc11001100.github.io/gmail-oauth-proxy-server/")
	})

	// 健康检查端点（不需要认证）
	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status":  "ok",
			"service": "gmail-oauth-proxy-server",
		})
	})

	// API路由组
	api := r.Group("/")
	{
		// 添加统一鉴权中间件（仅在未禁用认证时）
		if !cfg.DisableAuth {
			logger.Info("🔒 启用认证中间件")
			authConfig := middleware.AuthConfig{
				APIKey:      cfg.APIKey,
				IPWhitelist: cfg.IPWhitelist,
			}
			api.Use(middleware.UnifiedAuth(authConfig))
		} else {
			logger.Info("⚠️  认证已禁用 - 所有请求都将被允许")
		}
		// 添加请求日志中间件
		api.Use(middleware.RequestLogger())

		// OAuth API代理端点
		api.GET("/auth", oauthHandler.AuthHandler)           // 用户授权端点代理
		api.POST("/token", oauthHandler.TokenHandler)        // 令牌获取端点代理（支持刷新令牌）
		api.GET("/userinfo", oauthHandler.UserInfoHandler)   // 用户信息获取端点代理
		api.GET("/tokeninfo", oauthHandler.TokenInfoHandler) // 令牌验证端点代理
	}
}
