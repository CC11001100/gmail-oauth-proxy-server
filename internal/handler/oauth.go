package handler

import (
	"bytes"
	"encoding/json"
	"fmt"
	"gmail-oauth-proxy-server/internal/config"
	"gmail-oauth-proxy-server/internal/logger"
	"io"
	"net/http"
	"net/url"
	"time"

	"github.com/gin-gonic/gin"
)

// TokenRequest OAuth token请求结构
type TokenRequest struct {
	Code         string `json:"code" binding:"required"`
	ClientID     string `json:"client_id" binding:"required"`
	ClientSecret string `json:"client_secret" binding:"required"`
	RedirectURI  string `json:"redirect_uri" binding:"required"`
	GrantType    string `json:"grant_type" binding:"required"`
}

// OAuthHandler OAuth处理器
type OAuthHandler struct {
	config *config.Config
	client *http.Client
}

// NewOAuthHandler 创建OAuth处理器
func NewOAuthHandler(cfg *config.Config) *OAuthHandler {
	return &OAuthHandler{
		config: cfg,
		client: &http.Client{
			Timeout: time.Duration(cfg.Timeout) * time.Second,
		},
	}
}

// TokenHandler 处理token请求
func (h *OAuthHandler) TokenHandler(c *gin.Context) {
	var req TokenRequest

	// 绑定JSON请求
	if err := c.ShouldBindJSON(&req); err != nil {
		HandleValidationError(c, err)
		return
	}

	// 验证grant_type
	if req.GrantType != "authorization_code" {
		HandleValidationError(c, fmt.Errorf("invalid grant_type: %s", req.GrantType))
		return
	}

	// 转换为form-urlencoded格式
	formData := url.Values{}
	formData.Set("code", req.Code)
	formData.Set("client_id", req.ClientID)
	formData.Set("client_secret", req.ClientSecret)
	formData.Set("redirect_uri", req.RedirectURI)
	formData.Set("grant_type", req.GrantType)

	// 创建请求到Google OAuth API
	googleURL := "https://oauth2.googleapis.com/token"
	googleReq, err := http.NewRequest("POST", googleURL, bytes.NewBufferString(formData.Encode()))
	if err != nil {
		HandleInternalError(c, err)
		return
	}

	// 设置请求头
	googleReq.Header.Set("Content-Type", "application/x-www-form-urlencoded")
	googleReq.Header.Set("User-Agent", "Gmail-OAuth-Proxy-Server/1.0")

	// 记录请求日志（脱敏）
	logData := map[string]interface{}{
		"url":           googleURL,
		"client_id":     req.ClientID,
		"redirect_uri":  req.RedirectURI,
		"grant_type":    req.GrantType,
		"code":          req.Code,
		"client_secret": req.ClientSecret,
	}
	sanitized := logger.SanitizeForLog(logData)
	logger.Info("Forwarding request to Google OAuth API: %+v", sanitized)

	// 发送请求
	resp, err := h.client.Do(googleReq)
	if err != nil {
		HandleProxyError(c, err)
		return
	}
	defer resp.Body.Close()

	// 读取响应
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		HandleProxyError(c, err)
		return
	}

	// 解析响应用于日志记录（脱敏）
	var responseData map[string]interface{}
	if err := json.Unmarshal(body, &responseData); err == nil {
		sanitizedResp := logger.SanitizeForLog(responseData)
		logger.Info("Received response from Google OAuth API: status=%d, data=%+v", resp.StatusCode, sanitizedResp)
	}

	// 设置响应头
	c.Header("Content-Type", resp.Header.Get("Content-Type"))

	// 返回Google的原始响应
	c.Data(resp.StatusCode, resp.Header.Get("Content-Type"), body)
}
