package handler

import (
	"bytes"
	"encoding/json"
	"gmail-oauth-proxy-server/internal/config"
	"gmail-oauth-proxy-server/internal/logger"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

func init() {
	// 初始化logger用于测试
	logger.Init("error") // 设置为error级别以减少测试输出
}

func TestOAuthHandler_AuthHandler(t *testing.T) {
	// 设置Gin为测试模式
	gin.SetMode(gin.TestMode)

	// 创建测试配置
	cfg := &config.Config{
		Timeout: 10,
	}

	// 创建OAuth处理器
	handler := NewOAuthHandler(cfg)

	// 创建测试路由
	r := gin.New()
	r.GET("/auth", handler.AuthHandler)

	// 测试成功情况
	t.Run("successful authorization redirect", func(t *testing.T) {
		req := httptest.NewRequest("GET", "/auth?client_id=test_client&redirect_uri=https://test.com/callback&scope=openid%20email&state=test_state&response_type=code", nil)
		w := httptest.NewRecorder()

		r.ServeHTTP(w, req)

		assert.Equal(t, http.StatusFound, w.Code)
		location := w.Header().Get("Location")
		assert.Contains(t, location, "accounts.google.com/o/oauth2/v2/auth")
		assert.Contains(t, location, "client_id=test_client")
		assert.Contains(t, location, "response_type=code")
	})

	// 测试缺少必需参数
	t.Run("missing required parameters", func(t *testing.T) {
		req := httptest.NewRequest("GET", "/auth?client_id=test_client", nil)
		w := httptest.NewRecorder()

		r.ServeHTTP(w, req)

		assert.Equal(t, http.StatusBadRequest, w.Code)
	})

	// 测试无效的response_type
	t.Run("invalid response_type", func(t *testing.T) {
		req := httptest.NewRequest("GET", "/auth?client_id=test_client&redirect_uri=https://test.com/callback&scope=openid%20email&state=test_state&response_type=token", nil)
		w := httptest.NewRecorder()

		r.ServeHTTP(w, req)

		assert.Equal(t, http.StatusBadRequest, w.Code)
	})
}

func TestOAuthHandler_TokenHandler(t *testing.T) {
	// 设置Gin为测试模式
	gin.SetMode(gin.TestMode)

	// 创建测试配置
	cfg := &config.Config{
		Timeout: 10,
	}

	// 创建OAuth处理器
	handler := NewOAuthHandler(cfg)

	// 创建测试路由
	r := gin.New()
	r.POST("/token", handler.TokenHandler)

	// 测试授权码grant_type验证
	t.Run("authorization_code validation", func(t *testing.T) {
		// 缺少必需参数的测试
		tokenReq := TokenRequest{
			ClientID:     "test_client",
			ClientSecret: "test_secret",
			GrantType:    "authorization_code",
			// 缺少 Code 和 RedirectURI
		}

		jsonData, _ := json.Marshal(tokenReq)
		req := httptest.NewRequest("POST", "/token", bytes.NewBuffer(jsonData))
		req.Header.Set("Content-Type", "application/json")
		w := httptest.NewRecorder()

		r.ServeHTTP(w, req)

		assert.Equal(t, http.StatusBadRequest, w.Code)
	})

	// 测试刷新令牌grant_type验证
	t.Run("refresh_token validation", func(t *testing.T) {
		// 缺少必需参数的测试
		tokenReq := TokenRequest{
			ClientID:     "test_client",
			ClientSecret: "test_secret",
			GrantType:    "refresh_token",
			// 缺少 RefreshToken
		}

		jsonData, _ := json.Marshal(tokenReq)
		req := httptest.NewRequest("POST", "/token", bytes.NewBuffer(jsonData))
		req.Header.Set("Content-Type", "application/json")
		w := httptest.NewRecorder()

		r.ServeHTTP(w, req)

		assert.Equal(t, http.StatusBadRequest, w.Code)
	})

	// 测试无效的grant_type
	t.Run("invalid grant_type", func(t *testing.T) {
		tokenReq := TokenRequest{
			ClientID:     "test_client",
			ClientSecret: "test_secret",
			GrantType:    "invalid_grant",
		}

		jsonData, _ := json.Marshal(tokenReq)
		req := httptest.NewRequest("POST", "/token", bytes.NewBuffer(jsonData))
		req.Header.Set("Content-Type", "application/json")
		w := httptest.NewRecorder()

		r.ServeHTTP(w, req)

		assert.Equal(t, http.StatusBadRequest, w.Code)
	})
}

func TestOAuthHandler_UserInfoHandler(t *testing.T) {
	// 设置Gin为测试模式
	gin.SetMode(gin.TestMode)

	// 创建测试配置
	cfg := &config.Config{
		Timeout: 10,
	}

	// 创建OAuth处理器
	handler := NewOAuthHandler(cfg)

	// 创建测试路由
	r := gin.New()
	r.GET("/userinfo", handler.UserInfoHandler)

	// 测试缺少Authorization头
	t.Run("missing authorization header", func(t *testing.T) {
		req := httptest.NewRequest("GET", "/userinfo", nil)
		w := httptest.NewRecorder()

		r.ServeHTTP(w, req)

		assert.Equal(t, http.StatusUnauthorized, w.Code)
	})
}

func TestOAuthHandler_TokenInfoHandler(t *testing.T) {
	// 设置Gin为测试模式
	gin.SetMode(gin.TestMode)

	// 创建测试配置
	cfg := &config.Config{
		Timeout: 10,
	}

	// 创建OAuth处理器
	handler := NewOAuthHandler(cfg)

	// 创建测试路由
	r := gin.New()
	r.GET("/tokeninfo", handler.TokenInfoHandler)

	// 测试缺少access_token参数
	t.Run("missing access_token parameter", func(t *testing.T) {
		req := httptest.NewRequest("GET", "/tokeninfo", nil)
		w := httptest.NewRecorder()

		r.ServeHTTP(w, req)

		assert.Equal(t, http.StatusBadRequest, w.Code)
	})

	// 测试有access_token参数（但会因为网络问题失败，这是预期的）
	t.Run("with access_token parameter", func(t *testing.T) {
		req := httptest.NewRequest("GET", "/tokeninfo?access_token=test_token", nil)
		w := httptest.NewRecorder()

		r.ServeHTTP(w, req)

		// 实际上这个会因为网络请求失败而返回BadGateway错误
		// 但在某些情况下可能返回其他错误代码，所以我们检查不是200即可
		assert.NotEqual(t, http.StatusOK, w.Code)
	})
} 