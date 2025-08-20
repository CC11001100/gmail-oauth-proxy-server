package config

import (
	"fmt"
	"os"

	"github.com/spf13/viper"
)

// Config 应用配置结构
type Config struct {
	Port        string   `mapstructure:"port"`
	APIKey      string   `mapstructure:"api_key"`
	Environment string   `mapstructure:"environment"`
	LogLevel    string   `mapstructure:"log_level"`
	Timeout     int      `mapstructure:"timeout"`
	IPWhitelist []string `mapstructure:"ip_whitelist"`
}

// Load 加载配置
func Load() (*Config, error) {
	return LoadWithAutoGenerate(false)
}

// LoadForDisplay 加载配置用于显示，不进行验证
func LoadForDisplay() (*Config, error) {
	return loadConfig(false, false)
}

// LoadWithAutoGenerate 加载配置，支持自动生成API Key
func LoadWithAutoGenerate(autoGenerate bool) (*Config, error) {
	return loadConfig(autoGenerate, true)
}

// loadConfig 内部配置加载函数
func loadConfig(autoGenerate bool, validate bool) (*Config, error) {
	// 设置配置文件名和路径
	viper.SetConfigName("config")
	viper.SetConfigType("yaml")
	viper.AddConfigPath(".")
	viper.AddConfigPath("./config")

	// 设置环境变量前缀
	viper.SetEnvPrefix("OAUTH_PROXY")
	viper.AutomaticEnv()

	// 设置默认值
	viper.SetDefault("port", "8080")
	viper.SetDefault("environment", "development")
	viper.SetDefault("log_level", "info")
	viper.SetDefault("timeout", 10)

	// 从环境变量读取API Key
	if apiKey := os.Getenv("OAUTH_PROXY_API_KEY"); apiKey != "" {
		viper.Set("api_key", apiKey)
	}

	// 从环境变量读取IP白名单
	if ipWhitelist := os.Getenv("OAUTH_PROXY_IP_WHITELIST"); ipWhitelist != "" {
		viper.Set("ip_whitelist", ipWhitelist)
	}

	// 读取配置文件（可选）
	if err := viper.ReadInConfig(); err != nil {
		if _, ok := err.(viper.ConfigFileNotFoundError); !ok {
			return nil, err
		}
	}

	var config Config
	if err := viper.Unmarshal(&config); err != nil {
		return nil, err
	}

	// 如果没有API Key且启用自动生成，尝试从缓存获取或生成新的
	if config.APIKey == "" && autoGenerate {
		cache, err := NewConfigCache()
		if err != nil {
			return nil, fmt.Errorf("failed to create config cache: %w", err)
		}

		apiKey, isNew, err := cache.GetOrGenerateAPIKey()
		if err != nil {
			return nil, fmt.Errorf("failed to get or generate API key: %w", err)
		}

		config.APIKey = apiKey

		// 如果是新生成的key，给用户提示
		if isNew {
			fmt.Printf("🔑 已生成新的API Key: %s\n", apiKey)
			fmt.Printf("📁 API Key已保存到: %s\n", cache.GetCacheFile())
		} else {
			fmt.Printf("🔑 使用缓存的API Key: %s\n", apiKey)
		}
	}

	// 只有在需要验证时才进行鉴权配置验证
	if validate && config.APIKey == "" && len(config.IPWhitelist) == 0 {
		return nil, fmt.Errorf("at least one authentication method is required: API key or IP whitelist")
	}

	return &config, nil
}
