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

示例:
  gmail-oauth-proxy config show       # 显示当前配置
  gmail-oauth-proxy config validate   # 验证配置文件`,
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

func init() {
	rootCmd.AddCommand(configCmd)
	configCmd.AddCommand(configShowCmd)
	configCmd.AddCommand(configValidateCmd)
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
	}
}
