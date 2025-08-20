package cmd

import (
	"fmt"
	"gmail-oauth-proxy-server/internal/config"
	"net"
	"strings"

	"github.com/fatih/color"
	"github.com/spf13/cobra"
	"github.com/spf13/viper"
)

// configCmd represents the config command
var configCmd = &cobra.Command{
	Use:   "config",
	Short: "配置管理命令",
	Long: color.New(color.FgBlue).Sprint("⚙️  Gmail OAuth代理服务器配置管理") + `

提供配置文件的管理功能，包括：
• 显示当前配置信息
• 验证配置文件有效性
• 查看配置文件路径

子命令:
  show      显示当前配置信息
  validate  验证配置文件有效性
  cache     管理配置缓存
  clear     清除配置缓存

示例:
  gmail-oauth-proxy config show       # 显示当前配置
  gmail-oauth-proxy config validate   # 验证配置文件
  gmail-oauth-proxy config cache      # 显示缓存信息
  gmail-oauth-proxy config clear      # 清除缓存`,
}

// configShowCmd represents the config show command
var configShowCmd = &cobra.Command{
	Use:   "show",
	Short: "显示当前配置信息",
	Long: color.New(color.FgGreen).Sprint("📋 显示当前配置信息") + `

显示当前生效的配置信息，包括：
• 配置文件路径
• 服务器配置
• 日志配置
• 环境变量覆盖情况

敏感信息（如API Key）将被脱敏显示。`,
	Run: showConfig,
}

// configValidateCmd represents the config validate command
var configValidateCmd = &cobra.Command{
	Use:   "validate",
	Short: "验证配置文件有效性",
	Long: color.New(color.FgYellow).Sprint("🔍 验证配置文件有效性") + `

验证配置文件的有效性，检查：
• 配置文件格式是否正确
• 必需的配置项是否存在
• 配置值是否合法
• 环境变量是否正确设置

如果配置有效，将显示成功信息；
如果配置无效，将显示详细的错误信息。`,
	Run: validateConfig,
}

// configCacheCmd represents the config cache command
var configCacheCmd = &cobra.Command{
	Use:   "cache",
	Short: "显示配置缓存信息",
	Long: color.New(color.FgMagenta).Sprint("💾 显示配置缓存信息") + `

显示当前配置缓存的详细信息，包括：
• 缓存文件位置
• 缓存的API Key信息
• 创建时间和最后使用时间
• 缓存文件状态

这个命令可以帮助您了解自动生成的API Key的存储情况。`,
	Run: showCacheInfo,
}

// configClearCmd represents the config clear command
var configClearCmd = &cobra.Command{
	Use:   "clear",
	Short: "清除配置缓存",
	Long: color.New(color.FgRed).Sprint("🗑️  清除配置缓存") + `

清除所有缓存的配置信息，包括：
• 自动生成的API Key
• 缓存的配置文件

清除后，下次启动服务器时将重新生成新的API Key。

注意：此操作不可逆，请谨慎使用。`,
	Run: clearCache,
}

func init() {
	rootCmd.AddCommand(configCmd)
	configCmd.AddCommand(configShowCmd)
	configCmd.AddCommand(configValidateCmd)
	configCmd.AddCommand(configCacheCmd)
	configCmd.AddCommand(configClearCmd)
}

func showConfig(cmd *cobra.Command, args []string) {
	color.Cyan("🔧 正在加载配置信息...")

	// 加载配置
	cfg, err := config.Load()
	if err != nil {
		color.Red("❌ 配置加载失败: %v", err)
		return
	}

	// 显示配置文件信息
	color.Green("\n📁 配置文件信息:")
	if viper.ConfigFileUsed() != "" {
		color.White("  • 配置文件路径: %s", color.BlueString(viper.ConfigFileUsed()))
	} else {
		color.Yellow("  • 未使用配置文件，使用默认配置和环境变量")
	}

	// 显示配置详情
	color.Green("\n⚙️  服务器配置:")
	color.White("  • 监听端口: %s", color.CyanString(cfg.Port))
	color.White("  • 运行环境: %s", color.MagentaString(cfg.Environment))
	color.White("  • 请求超时: %s", color.YellowString(fmt.Sprintf("%d秒", cfg.Timeout)))

	color.Green("\n🔐 鉴权配置:")
	// 脱敏显示API Key
	if cfg.APIKey != "" {
		apiKeyDisplay := "****"
		if len(cfg.APIKey) > 8 {
			apiKeyDisplay = fmt.Sprintf("%s****%s", cfg.APIKey[:4], cfg.APIKey[len(cfg.APIKey)-4:])
		}
		color.White("  • API密钥: %s", color.GreenString(apiKeyDisplay))
	} else {
		color.White("  • API密钥: %s", color.RedString("未设置"))
	}

	// 显示IP白名单
	if len(cfg.IPWhitelist) > 0 {
		color.White("  • IP白名单: %s", color.GreenString(fmt.Sprintf("%d个规则", len(cfg.IPWhitelist))))
		for i, ip := range cfg.IPWhitelist {
			if i < 5 { // 只显示前5个
				color.White("    - %s", color.BlueString(ip))
			} else if i == 5 {
				color.White("    - %s", color.YellowString(fmt.Sprintf("... 还有%d个", len(cfg.IPWhitelist)-5)))
				break
			}
		}
	} else {
		color.White("  • IP白名单: %s", color.RedString("未设置"))
	}

	color.Green("\n📊 日志配置:")
	color.White("  • 日志级别: %s", color.GreenString(cfg.LogLevel))

	// 显示环境变量信息
	color.Green("\n🌍 环境变量:")
	envVars := []string{
		"OAUTH_PROXY_API_KEY",
		"OAUTH_PROXY_PORT",
		"OAUTH_PROXY_ENVIRONMENT",
		"OAUTH_PROXY_LOG_LEVEL",
		"OAUTH_PROXY_TIMEOUT",
		"OAUTH_PROXY_IP_WHITELIST",
	}

	for _, envVar := range envVars {
		value := viper.GetString(envVar)
		if value != "" {
			// 脱敏处理敏感环境变量
			if envVar == "OAUTH_PROXY_API_KEY" && len(value) > 8 {
				value = fmt.Sprintf("%s****%s", value[:4], value[len(value)-4:])
			}
			color.White("  • %s: %s", envVar, color.GreenString(value))
		} else {
			color.White("  • %s: %s", envVar, color.RedString("未设置"))
		}
	}

	// 显示缓存信息
	color.Green("\n💾 配置缓存信息:")
	cache, err := config.NewConfigCache()
	if err != nil {
		color.White("  • 缓存状态: %s", color.RedString("无法访问"))
		color.White("  • 错误信息: %s", color.RedString(err.Error()))
	} else if !cache.CacheExists() {
		color.White("  • 缓存状态: %s", color.YellowString("不存在"))
		color.White("  • 缓存位置: %s", color.BlueString(cache.GetCacheFile()))
	} else {
		color.White("  • 缓存状态: %s", color.GreenString("存在"))
		color.White("  • 缓存位置: %s", color.BlueString(cache.GetCacheFile()))

		if cacheInfo, err := cache.GetCacheInfo(); err == nil {
			color.White("  • 缓存创建: %s", color.MagentaString(cacheInfo.CreatedAt.Format("2006-01-02 15:04:05")))
			color.White("  • 最后使用: %s", color.MagentaString(cacheInfo.LastUsed.Format("2006-01-02 15:04:05")))
		}
	}

	color.Cyan("\n✅ 配置信息显示完成")
}

func validateConfig(cmd *cobra.Command, args []string) {
	color.Cyan("🔍 正在验证配置文件...")

	// 尝试加载配置
	cfg, err := config.Load()
	if err != nil {
		color.Red("❌ 配置验证失败:")
		color.Red("   %v", err)
		return
	}

	// 验证必需的配置项
	errors := []string{}

	// 验证鉴权配置
	if cfg.APIKey == "" && len(cfg.IPWhitelist) == 0 {
		errors = append(errors, "未配置任何鉴权方式 (需要配置API Key或IP白名单)")
		errors = append(errors, "  • API Key: 通过 --api-key 参数或 OAUTH_PROXY_API_KEY 环境变量设置")
		errors = append(errors, "  • IP白名单: 通过 --ip-whitelist 参数或 OAUTH_PROXY_IP_WHITELIST 环境变量设置")
	}

	if cfg.Port == "" {
		errors = append(errors, "端口未设置")
	}

	if cfg.LogLevel == "" {
		errors = append(errors, "日志级别未设置")
	}

	// 验证日志级别
	validLogLevels := []string{"debug", "info", "warn", "error"}
	validLevel := false
	for _, level := range validLogLevels {
		if cfg.LogLevel == level {
			validLevel = true
			break
		}
	}
	if !validLevel {
		errors = append(errors, fmt.Sprintf("无效的日志级别: %s (有效值: debug, info, warn, error)", cfg.LogLevel))
	}

	// 验证环境
	if cfg.Environment != "development" && cfg.Environment != "production" {
		errors = append(errors, fmt.Sprintf("无效的运行环境: %s (有效值: development, production)", cfg.Environment))
	}

	// 验证超时时间
	if cfg.Timeout <= 0 {
		errors = append(errors, fmt.Sprintf("无效的超时时间: %d (必须大于0)", cfg.Timeout))
	}

	// 验证IP白名单格式
	for _, ip := range cfg.IPWhitelist {
		if strings.TrimSpace(ip) == "" {
			continue
		}
		// 检查CIDR格式
		if strings.Contains(ip, "/") {
			_, _, err := net.ParseCIDR(ip)
			if err != nil {
				errors = append(errors, fmt.Sprintf("无效的CIDR格式: %s", ip))
			}
		} else {
			// 检查IP地址格式
			if net.ParseIP(ip) == nil {
				errors = append(errors, fmt.Sprintf("无效的IP地址: %s", ip))
			}
		}
	}

	// 显示验证结果
	if len(errors) > 0 {
		color.Red("❌ 配置验证失败，发现 %d 个错误:", len(errors))
		for i, err := range errors {
			color.Red("   %d. %s", i+1, err)
		}
	} else {
		color.Green("✅ 配置验证通过!")
		color.White("   • 所有必需的配置项都已正确设置")
		color.White("   • 配置值格式正确")
		color.White("   • 可以正常启动服务器")

		// 显示配置摘要
		color.Cyan("\n📋 配置摘要:")
		color.White("   • 端口: %s", cfg.Port)
		color.White("   • 环境: %s", cfg.Environment)
		color.White("   • 日志级别: %s", cfg.LogLevel)
		color.White("   • 超时时间: %d秒", cfg.Timeout)

		// 显示鉴权配置摘要
		if cfg.APIKey != "" {
			color.White("   • API Key: 已配置")
		}
		if len(cfg.IPWhitelist) > 0 {
			color.White("   • IP白名单: %d个规则", len(cfg.IPWhitelist))
		}

		// 验证缓存配置
		color.Cyan("\n💾 缓存验证:")
		cache, err := config.NewConfigCache()
		if err != nil {
			color.White("   • 缓存访问: %s", color.RedString("失败"))
			color.White("   • 错误信息: %s", color.RedString(err.Error()))
		} else if !cache.CacheExists() {
			color.White("   • 缓存状态: %s", color.YellowString("不存在"))
			color.White("   • 说明: 首次启动时将自动创建")
		} else {
			if err := cache.ValidateCache(); err != nil {
				color.White("   • 缓存验证: %s", color.RedString("失败"))
				color.White("   • 错误信息: %s", color.RedString(err.Error()))
				errors = append(errors, fmt.Sprintf("缓存文件验证失败: %v", err))
			} else {
				color.White("   • 缓存验证: %s", color.GreenString("通过"))
			}
		}
	}
}

func showCacheInfo(cmd *cobra.Command, args []string) {
	color.Cyan("💾 正在加载配置缓存信息...")

	// 创建配置缓存管理器
	cache, err := config.NewConfigCache()
	if err != nil {
		color.Red("❌ 创建配置缓存管理器失败: %v", err)
		return
	}

	// 检查缓存是否存在
	if !cache.CacheExists() {
		color.Yellow("📭 配置缓存不存在")
		color.White("   • 缓存目录: %s", color.BlueString(cache.GetCacheDir()))
		color.White("   • 缓存文件: %s", color.BlueString(cache.GetCacheFile()))
		color.White("   • 状态: %s", color.RedString("不存在"))
		color.Cyan("\n💡 提示: 启动服务器时将自动生成API Key并创建缓存")
		return
	}

	// 获取缓存信息
	cacheInfo, err := cache.GetCacheInfo()
	if err != nil {
		color.Red("❌ 读取缓存信息失败: %v", err)
		return
	}

	// 显示缓存信息
	color.Green("\n📁 缓存文件信息:")
	color.White("  • 缓存目录: %s", color.BlueString(cache.GetCacheDir()))
	color.White("  • 缓存文件: %s", color.BlueString(cache.GetCacheFile()))
	color.White("  • 文件状态: %s", color.GreenString("存在"))

	color.Green("\n🔑 API Key信息:")
	// 脱敏显示API Key
	apiKeyDisplay := "****"
	if len(cacheInfo.APIKey) > 8 {
		apiKeyDisplay = fmt.Sprintf("%s****%s", cacheInfo.APIKey[:8], cacheInfo.APIKey[len(cacheInfo.APIKey)-4:])
	}
	color.White("  • API Key: %s", color.GreenString(apiKeyDisplay))
	color.White("  • 版本: %s", color.CyanString(cacheInfo.Version))
	color.White("  • 描述: %s", color.YellowString(cacheInfo.Description))

	color.Green("\n⏰ 时间信息:")
	color.White("  • 创建时间: %s", color.MagentaString(cacheInfo.CreatedAt.Format("2006-01-02 15:04:05")))
	color.White("  • 最后使用: %s", color.MagentaString(cacheInfo.LastUsed.Format("2006-01-02 15:04:05")))

	// 验证缓存完整性
	if err := cache.ValidateCache(); err != nil {
		color.Red("\n⚠️  缓存验证失败: %v", err)
	} else {
		color.Green("\n✅ 缓存验证通过")
	}

	color.Cyan("\n💾 缓存信息显示完成")
}

func clearCache(cmd *cobra.Command, args []string) {
	color.Cyan("🗑️  正在清除配置缓存...")

	// 创建配置缓存管理器
	cache, err := config.NewConfigCache()
	if err != nil {
		color.Red("❌ 创建配置缓存管理器失败: %v", err)
		return
	}

	// 检查缓存是否存在
	if !cache.CacheExists() {
		color.Yellow("📭 配置缓存不存在，无需清除")
		color.White("   • 缓存文件: %s", color.BlueString(cache.GetCacheFile()))
		return
	}

	// 显示将要清除的信息
	color.Yellow("\n⚠️  即将清除以下缓存:")
	color.White("   • 缓存文件: %s", color.BlueString(cache.GetCacheFile()))

	// 获取缓存信息用于显示
	if cacheInfo, err := cache.GetCacheInfo(); err == nil {
		apiKeyDisplay := "****"
		if len(cacheInfo.APIKey) > 8 {
			apiKeyDisplay = fmt.Sprintf("%s****%s", cacheInfo.APIKey[:8], cacheInfo.APIKey[len(cacheInfo.APIKey)-4:])
		}
		color.White("   • API Key: %s", color.RedString(apiKeyDisplay))
		color.White("   • 创建时间: %s", color.RedString(cacheInfo.CreatedAt.Format("2006-01-02 15:04:05")))
	}

	// 执行清除操作
	if err := cache.ClearCache(); err != nil {
		color.Red("❌ 清除缓存失败: %v", err)
		return
	}

	color.Green("✅ 配置缓存已成功清除")
	color.Cyan("💡 下次启动服务器时将重新生成新的API Key")
}
