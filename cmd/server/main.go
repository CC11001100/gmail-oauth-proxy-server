package main

import (
	"gmail-oauth-proxy-server/internal/config"
	"gmail-oauth-proxy-server/internal/handler"
	"gmail-oauth-proxy-server/internal/logger"
	"gmail-oauth-proxy-server/internal/middleware"
	"log"

	"github.com/gin-gonic/gin"
)

func main() {
	// 初始化配置
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("Failed to load config: %v", err)
	}

	// 初始化日志
	logger.Init(cfg.LogLevel)

	// 设置Gin模式
	if cfg.Environment == "production" {
		gin.SetMode(gin.ReleaseMode)
	}

	// 创建Gin引擎
	r := gin.New()

	// 添加全局中间件
	r.Use(handler.ErrorHandler())
	r.Use(middleware.Logger())
	r.Use(middleware.HTTPS())

	// 注册路由
	handler.RegisterRoutes(r, cfg)

	// 启动服务器
	logger.Info("Starting server on port %s", cfg.Port)
	if err := r.Run(":" + cfg.Port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
