package handler

import (
	"gmail-oauth-proxy-server/internal/config"
	"gmail-oauth-proxy-server/internal/middleware"
	"net/http"

	"github.com/gin-gonic/gin"
)

// staticIndexHandler 全局首页处理器
var staticIndexHandler gin.HandlerFunc

// staticFileHandler 全局静态文件处理器
var staticFileHandler gin.HandlerFunc

// SetStaticHandlers 设置静态文件处理器
func SetStaticHandlers(indexHandler, fileHandler gin.HandlerFunc) {
	staticIndexHandler = indexHandler
	staticFileHandler = fileHandler
}

// RegisterRoutes 注册路由
func RegisterRoutes(r *gin.Engine, cfg *config.Config) {
	// 创建OAuth处理器
	oauthHandler := NewOAuthHandler(cfg)

	// 首页路由（不需要认证）- 返回API文档
	if staticIndexHandler != nil {
		r.GET("/", staticIndexHandler)
	}

	// 静态资源路由（不需要认证）
	if staticFileHandler != nil {
		r.GET("/static/*filepath", staticFileHandler)
	}

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
		// 添加统一鉴权中间件
		authConfig := middleware.AuthConfig{
			APIKey:      cfg.APIKey,
			IPWhitelist: cfg.IPWhitelist,
		}
		api.Use(middleware.UnifiedAuth(authConfig))
		// 添加请求日志中间件
		api.Use(middleware.RequestLogger())

		// OAuth token端点
		api.POST("/token", oauthHandler.TokenHandler)
	}
}
