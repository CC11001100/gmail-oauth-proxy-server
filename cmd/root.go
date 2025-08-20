package cmd

import (
	"fmt"
	"os"
	"gmail-oauth-proxy-server/internal/logger"
	
	"github.com/fatih/color"
	"github.com/spf13/cobra"
	"github.com/spf13/viper"
)

var (
	cfgFile string
	verbose bool
	noColor bool
)

// rootCmd represents the base command when called without any subcommands
var rootCmd = &cobra.Command{
	Use:   "gmail-oauth-proxy",
	Short: "Gmail OAuth代理服务器",
	Long: color.New(color.FgCyan).Sprint(`
██████╗ ███╗   ███╗ █████╗ ██╗██╗         ██████╗  █████╗ ██╗   ██╗████████╗██╗  ██╗
██╔════╝ ████╗ ████║██╔══██╗██║██║        ██╔═══██╗██╔══██╗██║   ██║╚══██╔══╝██║  ██║
██║  ███╗██╔████╔██║███████║██║██║        ██║   ██║███████║██║   ██║   ██║   ███████║
██║   ██║██║╚██╔╝██║██╔══██║██║██║        ██║   ██║██╔══██║██║   ██║   ██║   ██╔══██║
╚██████╔╝██║ ╚═╝ ██║██║  ██║██║███████╗   ╚██████╔╝██║  ██║╚██████╔╝   ██║   ██║  ██║
 ╚═════╝ ╚═╝     ╚═╝╚═╝  ╚═╝╚═╝╚══════╝    ╚═════╝ ╚═╝  ╚═╝ ╚═════╝    ╚═╝   ╚═╝  ╚═╝
                                                                                        
                            PROXY SERVER`) + `

一个安全、高效的Gmail OAuth代理服务器，提供以下功能：
• OAuth授权码交换代理
• API Key认证保护  
• HTTPS强制安全传输
• 智能日志脱敏
• 完善的错误处理

使用 'gmail-oauth-proxy help [command]' 获取更多帮助信息。`,
	PersistentPreRun: func(cmd *cobra.Command, args []string) {
		// 设置颜色输出
		if noColor {
			color.NoColor = true
		}
		
		// 设置详细输出
		if verbose {
			logger.Init("debug")
		}
	},
}

// Execute adds all child commands to the root command and sets flags appropriately.
// This is called by main.main(). It only needs to happen once to the rootCmd.
func Execute() {
	err := rootCmd.Execute()
	if err != nil {
		color.Red("错误: %v", err)
		os.Exit(1)
	}
}

func init() {
	cobra.OnInitialize(initConfig)

	// 全局标志
	rootCmd.PersistentFlags().StringVar(&cfgFile, "config", "", "配置文件路径 (默认: ./config.yaml)")
	rootCmd.PersistentFlags().BoolVarP(&verbose, "verbose", "v", false, "详细输出模式")
	rootCmd.PersistentFlags().BoolVar(&noColor, "no-color", false, "禁用彩色输出")
	
	// 绑定到viper
	viper.BindPFlag("verbose", rootCmd.PersistentFlags().Lookup("verbose"))
	viper.BindPFlag("no-color", rootCmd.PersistentFlags().Lookup("no-color"))
}

// initConfig reads in config file and ENV variables if set.
func initConfig() {
	if cfgFile != "" {
		// Use config file from the flag.
		viper.SetConfigFile(cfgFile)
	} else {
		// Search config in current directory with name "config" (without extension).
		viper.AddConfigPath(".")
		viper.AddConfigPath("./config")
		viper.SetConfigType("yaml")
		viper.SetConfigName("config")
	}

	// 设置环境变量前缀
	viper.SetEnvPrefix("OAUTH_PROXY")
	viper.AutomaticEnv()

	// If a config file is found, read it in.
	if err := viper.ReadInConfig(); err == nil && verbose {
		fmt.Printf("使用配置文件: %s\n", viper.ConfigFileUsed())
	}
}
