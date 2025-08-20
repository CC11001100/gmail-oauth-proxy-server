package cmd

import (
	"fmt"
	"runtime"
	"time"

	"github.com/fatih/color"
	"github.com/spf13/cobra"
)

var (
	// 这些变量在构建时通过 -ldflags 设置
	Version   = "1.0.0"
	GitCommit = "unknown"
	BuildTime = "unknown"
	GoVersion = runtime.Version()
)

// versionCmd represents the version command
var versionCmd = &cobra.Command{
	Use:   "version",
	Short: "显示版本信息",
	Long: color.New(color.FgMagenta).Sprint("📋 显示Gmail OAuth代理服务器版本信息") + `

显示详细的版本信息，包括：
• 软件版本号
• Git提交哈希
• 构建时间
• Go版本信息
• 运行时信息

示例:
  gmail-oauth-proxy version           # 显示版本信息
  gmail-oauth-proxy version --short   # 显示简短版本信息`,
	Run: showVersion,
}

var shortVersion bool

func init() {
	rootCmd.AddCommand(versionCmd)
	
	versionCmd.Flags().BoolVarP(&shortVersion, "short", "s", false, "显示简短版本信息")
}

func showVersion(cmd *cobra.Command, args []string) {
	if shortVersion {
		fmt.Printf("%s\n", Version)
		return
	}

	// 显示详细版本信息
	color.Cyan("╔══════════════════════════════════════════════════════════════╗")
	color.Cyan("║                    Gmail OAuth Proxy Server                 ║")
	color.Cyan("╠══════════════════════════════════════════════════════════════╣")
	
	color.White("║ %-20s: %-35s ║", "版本", color.GreenString(Version))
	color.White("║ %-20s: %-35s ║", "Git提交", color.YellowString(GitCommit))
	color.White("║ %-20s: %-35s ║", "构建时间", color.BlueString(BuildTime))
	color.White("║ %-20s: %-35s ║", "Go版本", color.MagentaString(GoVersion))
	color.White("║ %-20s: %-35s ║", "操作系统", color.CyanString(runtime.GOOS))
	color.White("║ %-20s: %-35s ║", "架构", color.CyanString(runtime.GOARCH))
	color.White("║ %-20s: %-35s ║", "CPU核心数", color.RedString(fmt.Sprintf("%d", runtime.NumCPU())))
	
	color.Cyan("╠══════════════════════════════════════════════════════════════╣")
	color.White("║ %-58s ║", color.GreenString("🚀 高性能Gmail OAuth代理服务"))
	color.White("║ %-58s ║", color.BlueString("🔒 安全可靠的OAuth授权码交换"))
	color.White("║ %-58s ║", color.YellowString("📊 智能日志脱敏与监控"))
	color.Cyan("╚══════════════════════════════════════════════════════════════╝")
	
	// 显示运行时信息
	color.Green("\n🔧 运行时信息:")
	color.White("  • 当前时间: %s", time.Now().Format("2006-01-02 15:04:05"))
	color.White("  • 内存统计: %s", getMemoryStats())
	color.White("  • Goroutine数: %d", runtime.NumGoroutine())
}

func getMemoryStats() string {
	var m runtime.MemStats
	runtime.ReadMemStats(&m)
	
	return fmt.Sprintf("已分配: %.2f MB, 系统: %.2f MB", 
		float64(m.Alloc)/1024/1024,
		float64(m.Sys)/1024/1024)
}
