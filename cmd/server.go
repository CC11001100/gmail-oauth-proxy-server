package cmd

import (
	"gmail-oauth-proxy-server/internal/config"
	"gmail-oauth-proxy-server/internal/handler"
	"gmail-oauth-proxy-server/internal/logger"
	"gmail-oauth-proxy-server/internal/middleware"
	"log"
	"strings"

	"github.com/fatih/color"
	"github.com/gin-gonic/gin"
	"github.com/spf13/cobra"
	"github.com/spf13/viper"
)

var (
	port     string
	apiKey   string
	logLevel string
	env      string
)

// serverCmd represents the server command
var serverCmd = &cobra.Command{
	Use:   "server",
	Short: "启动Gmail OAuth代理服务器",
	Long: color.New(color.FgGreen).Sprint("🚀 启动Gmail OAuth代理服务器") + `

启动HTTP服务器，提供OAuth代理服务。服务器将监听指定端口，
处理OAuth授权码交换请求，并提供以下功能：

• POST /token - OAuth授权码交换端点
• GET /health - 健康检查端点
• API Key认证保护
• HTTPS强制（生产环境）
• 智能日志脱敏
• 完善的错误处理

示例:
  gmail-oauth-proxy server                    # 使用默认配置启动
  gmail-oauth-proxy server --port 9000        # 指定端口启动
  gmail-oauth-proxy server --env production   # 生产环境模式`,
	Run: runServer,
}

func init() {
	rootCmd.AddCommand(serverCmd)

	// 服务器特定的标志
	serverCmd.Flags().StringVarP(&port, "port", "p", "8080", "服务器监听端口")
	serverCmd.Flags().StringVar(&apiKey, "api-key", "", "API认证密钥")
	serverCmd.Flags().StringVar(&logLevel, "log-level", "info", "日志级别 (debug|info|warn|error)")
	serverCmd.Flags().StringVar(&env, "env", "development", "运行环境 (development|production)")

	// 绑定到viper
	viper.BindPFlag("port", serverCmd.Flags().Lookup("port"))
	viper.BindPFlag("api_key", serverCmd.Flags().Lookup("api-key"))
	viper.BindPFlag("log_level", serverCmd.Flags().Lookup("log-level"))
	viper.BindPFlag("environment", serverCmd.Flags().Lookup("env"))
}

func runServer(cmd *cobra.Command, args []string) {
	// 显示启动信息
	color.Cyan("🔧 正在初始化Gmail OAuth代理服务器...")

	// 初始化配置
	cfg, err := config.Load()
	if err != nil {
		color.Red("❌ 配置加载失败: %v", err)
		log.Fatalf("Failed to load config: %v", err)
	}

	// 命令行参数覆盖配置文件
	if cmd.Flags().Changed("port") {
		cfg.Port = port
	}
	if cmd.Flags().Changed("api-key") {
		cfg.APIKey = apiKey
	}
	if cmd.Flags().Changed("log-level") {
		cfg.LogLevel = logLevel
	}
	if cmd.Flags().Changed("env") {
		cfg.Environment = env
	}

	// 验证必需的配置
	if cfg.APIKey == "" {
		color.Red("❌ API Key未设置，请通过 --api-key 参数或 OAUTH_PROXY_API_KEY 环境变量设置")
		log.Fatal("API key is required")
	}

	// 初始化日志
	logger.Init(cfg.LogLevel)
	color.Green("✅ 日志系统初始化完成 (级别: %s)", cfg.LogLevel)

	// 设置Gin模式
	if cfg.Environment == "production" {
		gin.SetMode(gin.ReleaseMode)
		color.Yellow("🔒 生产环境模式已启用")
	} else {
		color.Blue("🔧 开发环境模式已启用")
	}

	// 创建Gin引擎
	r := gin.New()

	// 添加全局中间件
	r.Use(handler.ErrorHandler())
	r.Use(middleware.Logger())
	r.Use(middleware.HTTPS())
	color.Green("✅ 中间件加载完成")

	// 注册路由
	handler.RegisterRoutes(r, cfg)
	color.Green("✅ 路由注册完成")

	// 显示服务器信息
	separator := strings.Repeat("=", 60)
	color.Cyan("\n" + separator)
	color.Green("🚀 Gmail OAuth代理服务器启动成功!")
	color.Cyan(separator)
	color.White("📍 监听地址: http://localhost:%s", cfg.Port)
	color.White("🔑 API Key: %s****%s", cfg.APIKey[:4], cfg.APIKey[len(cfg.APIKey)-4:])
	color.White("🌍 运行环境: %s", cfg.Environment)
	color.White("📊 日志级别: %s", cfg.LogLevel)
	color.Cyan(separator)
	color.Yellow("💡 使用 Ctrl+C 停止服务器")
	color.Cyan(separator + "\n")

	// 启动服务器
	logger.Info("Starting server on port %s", cfg.Port)
	if err := r.Run(":" + cfg.Port); err != nil {
		color.Red("❌ 服务器启动失败: %v", err)
		log.Fatalf("Failed to start server: %v", err)
	}
}
