package config

import (
	"fmt"
	"os"

	"github.com/spf13/viper"
)

// Config 应用配置结构
type Config struct {
	Port        string `mapstructure:"port"`
	APIKey      string `mapstructure:"api_key"`
	Environment string `mapstructure:"environment"`
	LogLevel    string `mapstructure:"log_level"`
	Timeout     int    `mapstructure:"timeout"`
}

// Load 加载配置
func Load() (*Config, error) {
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

	// 验证必需的配置
	if config.APIKey == "" {
		return nil, fmt.Errorf("API key is required")
	}

	return &config, nil
}
