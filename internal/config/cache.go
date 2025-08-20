package config

import (
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"time"
)

// CachedConfig 缓存的配置结构
type CachedConfig struct {
	APIKey      string    `json:"api_key"`
	CreatedAt   time.Time `json:"created_at"`
	LastUsed    time.Time `json:"last_used"`
	Version     string    `json:"version"`
	Description string    `json:"description"`
}

// ConfigCache 配置缓存管理器
type ConfigCache struct {
	cacheDir  string
	cacheFile string
}

// NewConfigCache 创建配置缓存管理器
func NewConfigCache() (*ConfigCache, error) {
	homeDir, err := os.UserHomeDir()
	if err != nil {
		return nil, fmt.Errorf("failed to get user home directory: %w", err)
	}

	cacheDir := filepath.Join(homeDir, ".gmail-oauth-proxy")
	cacheFile := filepath.Join(cacheDir, "config.json")

	return &ConfigCache{
		cacheDir:  cacheDir,
		cacheFile: cacheFile,
	}, nil
}

// EnsureCacheDir 确保缓存目录存在
func (cc *ConfigCache) EnsureCacheDir() error {
	if err := os.MkdirAll(cc.cacheDir, 0700); err != nil {
		return fmt.Errorf("failed to create cache directory: %w", err)
	}
	return nil
}

// GenerateAPIKey 生成安全的API Key
func (cc *ConfigCache) GenerateAPIKey() (string, error) {
	// 生成32字节的随机数据
	bytes := make([]byte, 32)
	if _, err := rand.Read(bytes); err != nil {
		return "", fmt.Errorf("failed to generate random bytes: %w", err)
	}

	// 转换为十六进制字符串
	apiKey := hex.EncodeToString(bytes)

	// 添加前缀以便识别
	return fmt.Sprintf("gop_%s", apiKey), nil
}

// SaveCachedConfig 保存缓存配置
func (cc *ConfigCache) SaveCachedConfig(apiKey string) error {
	if err := cc.EnsureCacheDir(); err != nil {
		return err
	}

	cachedConfig := CachedConfig{
		APIKey:      apiKey,
		CreatedAt:   time.Now(),
		LastUsed:    time.Now(),
		Version:     "1.0.0",
		Description: "Auto-generated API key for Gmail OAuth Proxy Server",
	}

	data, err := json.MarshalIndent(cachedConfig, "", "  ")
	if err != nil {
		return fmt.Errorf("failed to marshal cached config: %w", err)
	}

	// 写入文件，设置安全权限
	if err := os.WriteFile(cc.cacheFile, data, 0600); err != nil {
		return fmt.Errorf("failed to write cached config: %w", err)
	}

	return nil
}

// LoadCachedConfig 加载缓存配置
func (cc *ConfigCache) LoadCachedConfig() (*CachedConfig, error) {
	if !cc.CacheExists() {
		return nil, fmt.Errorf("cached config file does not exist")
	}

	data, err := os.ReadFile(cc.cacheFile)
	if err != nil {
		return nil, fmt.Errorf("failed to read cached config: %w", err)
	}

	var cachedConfig CachedConfig
	if err := json.Unmarshal(data, &cachedConfig); err != nil {
		return nil, fmt.Errorf("failed to unmarshal cached config: %w", err)
	}

	// 更新最后使用时间
	cachedConfig.LastUsed = time.Now()
	if err := cc.SaveCachedConfig(cachedConfig.APIKey); err != nil {
		// 记录错误但不影响加载
		fmt.Printf("Warning: failed to update last used time: %v\n", err)
	}

	return &cachedConfig, nil
}

// CacheExists 检查缓存文件是否存在
func (cc *ConfigCache) CacheExists() bool {
	_, err := os.Stat(cc.cacheFile)
	return err == nil
}

// GetCacheDir 获取缓存目录路径
func (cc *ConfigCache) GetCacheDir() string {
	return cc.cacheDir
}

// GetCacheFile 获取缓存文件路径
func (cc *ConfigCache) GetCacheFile() string {
	return cc.cacheFile
}

// ClearCache 清除缓存
func (cc *ConfigCache) ClearCache() error {
	if !cc.CacheExists() {
		return nil // 缓存不存在，无需清除
	}

	if err := os.Remove(cc.cacheFile); err != nil {
		return fmt.Errorf("failed to remove cached config: %w", err)
	}

	return nil
}

// GetOrGenerateAPIKey 获取或生成API Key
func (cc *ConfigCache) GetOrGenerateAPIKey() (string, bool, error) {
	// 尝试加载缓存的API Key
	if cachedConfig, err := cc.LoadCachedConfig(); err == nil {
		return cachedConfig.APIKey, false, nil // 返回缓存的key，false表示不是新生成的
	}

	// 生成新的API Key
	apiKey, err := cc.GenerateAPIKey()
	if err != nil {
		return "", false, fmt.Errorf("failed to generate API key: %w", err)
	}

	// 保存到缓存
	if err := cc.SaveCachedConfig(apiKey); err != nil {
		return "", false, fmt.Errorf("failed to save API key to cache: %w", err)
	}

	return apiKey, true, nil // 返回新生成的key，true表示是新生成的
}

// ValidateCache 验证缓存文件的完整性
func (cc *ConfigCache) ValidateCache() error {
	if !cc.CacheExists() {
		return fmt.Errorf("cache file does not exist")
	}

	cachedConfig, err := cc.LoadCachedConfig()
	if err != nil {
		return fmt.Errorf("failed to load cached config: %w", err)
	}

	if cachedConfig.APIKey == "" {
		return fmt.Errorf("cached API key is empty")
	}

	if cachedConfig.CreatedAt.IsZero() {
		return fmt.Errorf("cached config has invalid creation time")
	}

	return nil
}

// GetCacheInfo 获取缓存信息
func (cc *ConfigCache) GetCacheInfo() (*CachedConfig, error) {
	if !cc.CacheExists() {
		return nil, fmt.Errorf("cache file does not exist")
	}

	return cc.LoadCachedConfig()
}
