package logger

import (
	"strings"
	"github.com/sirupsen/logrus"
)

var log *logrus.Logger

// Init 初始化日志器
func Init(level string) {
	log = logrus.New()
	
	// 设置日志级别
	switch strings.ToLower(level) {
	case "debug":
		log.SetLevel(logrus.DebugLevel)
	case "info":
		log.SetLevel(logrus.InfoLevel)
	case "warn":
		log.SetLevel(logrus.WarnLevel)
	case "error":
		log.SetLevel(logrus.ErrorLevel)
	default:
		log.SetLevel(logrus.InfoLevel)
	}

	// 设置日志格式
	log.SetFormatter(&logrus.JSONFormatter{
		TimestampFormat: "2006-01-02 15:04:05",
	})
}

// Info 记录信息日志
func Info(format string, args ...interface{}) {
	log.Infof(format, args...)
}

// Debug 记录调试日志
func Debug(format string, args ...interface{}) {
	log.Debugf(format, args...)
}

// Warn 记录警告日志
func Warn(format string, args ...interface{}) {
	log.Warnf(format, args...)
}

// Error 记录错误日志
func Error(format string, args ...interface{}) {
	log.Errorf(format, args...)
}

// SanitizeForLog 脱敏处理敏感信息
func SanitizeForLog(data map[string]interface{}) map[string]interface{} {
	sanitized := make(map[string]interface{})
	sensitiveFields := []string{
		"access_token", "refresh_token", "id_token", "token",
		"client_secret", "code", "password", "secret",
	}

	for key, value := range data {
		keyLower := strings.ToLower(key)
		isSensitive := false
		
		for _, field := range sensitiveFields {
			if strings.Contains(keyLower, field) {
				isSensitive = true
				break
			}
		}
		
		if isSensitive {
			if str, ok := value.(string); ok && len(str) > 8 {
				sanitized[key] = str[:4] + "****" + str[len(str)-4:]
			} else {
				sanitized[key] = "****"
			}
		} else {
			sanitized[key] = value
		}
	}
	
	return sanitized
}
