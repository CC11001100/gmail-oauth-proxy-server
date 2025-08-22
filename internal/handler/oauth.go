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
	Code         string `json:"code,omitempty" form:"code"`
	ClientID     string `json:"client_id" form:"client_id" binding:"required"`
	ClientSecret string `json:"client_secret" form:"client_secret" binding:"required"`
	RedirectURI  string `json:"redirect_uri,omitempty" form:"redirect_uri"`
	GrantType    string `json:"grant_type" form:"grant_type" binding:"required"`
	RefreshToken string `json:"refresh_token,omitempty" form:"refresh_token"`
}

// AuthRequest OAuth授权请求结构
type AuthRequest struct {
	ClientID     string `form:"client_id" binding:"required"`
	RedirectURI  string `form:"redirect_uri" binding:"required"`
	Scope        string `form:"scope" binding:"required"`
	State        string `form:"state" binding:"required"`
	ResponseType string `form:"response_type" binding:"required"`
	AccessType   string `form:"access_type"`
	Prompt       string `form:"prompt"`
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

// AuthHandler 处理用户授权请求 - 代理 https://accounts.google.com/o/oauth2/v2/auth
func (h *OAuthHandler) AuthHandler(c *gin.Context) {
	var req AuthRequest

	// 绑定查询参数
	if err := c.ShouldBindQuery(&req); err != nil {
		HandleValidationError(c, err)
		return
	}

	// 验证response_type
	if req.ResponseType != "code" {
		HandleValidationError(c, fmt.Errorf("invalid response_type: %s", req.ResponseType))
		return
	}

	// 构建Google授权URL
	googleURL := "https://accounts.google.com/o/oauth2/v2/auth"
	params := url.Values{}
	params.Set("client_id", req.ClientID)
	params.Set("redirect_uri", req.RedirectURI)
	params.Set("scope", req.Scope)
	params.Set("state", req.State)
	params.Set("response_type", req.ResponseType)
	
	// 可选参数
	if req.AccessType != "" {
		params.Set("access_type", req.AccessType)
	}
	if req.Prompt != "" {
		params.Set("prompt", req.Prompt)
	}

	fullURL := googleURL + "?" + params.Encode()

	// 记录请求日志（脱敏）
	logData := map[string]interface{}{
		"url":           googleURL,
		"client_id":     req.ClientID,
		"redirect_uri":  req.RedirectURI,
		"scope":         req.Scope,
		"state":         req.State[:min(len(req.State), 10)] + "...", // 只显示state前10个字符
		"response_type": req.ResponseType,
		"access_type":   req.AccessType,
		"prompt":        req.Prompt,
	}
	logger.Info("Redirecting to Google OAuth authorization: %+v", logData)

	// 重定向到Google授权页面
	c.Redirect(http.StatusFound, fullURL)
}

// TokenHandler 处理token请求 - 代理 https://oauth2.googleapis.com/token（支持授权码和刷新令牌）
func (h *OAuthHandler) TokenHandler(c *gin.Context) {
	var req TokenRequest

	// 检查Content-Type并相应地解析请求
	contentType := c.GetHeader("Content-Type")
	
	var err error
	if contentType == "application/x-www-form-urlencoded" || contentType == "application/x-www-form-urlencoded; charset=utf-8" {
		// 解析form-urlencoded格式（Google OAuth标准格式）
		err = c.ShouldBind(&req)
	} else {
		// 向后兼容：仍支持JSON格式
		err = c.ShouldBindJSON(&req)
	}
	
	if err != nil {
		HandleValidationError(c, err)
		return
	}

	// 验证grant_type（支持authorization_code和refresh_token）
	if req.GrantType != "authorization_code" && req.GrantType != "refresh_token" {
		HandleValidationError(c, fmt.Errorf("invalid grant_type: %s", req.GrantType))
		return
	}

	// 根据grant_type验证必需参数
	if req.GrantType == "authorization_code" {
		if req.Code == "" || req.RedirectURI == "" {
			HandleValidationError(c, fmt.Errorf("code and redirect_uri are required for authorization_code grant"))
			return
		}
	} else if req.GrantType == "refresh_token" {
		if req.RefreshToken == "" {
			HandleValidationError(c, fmt.Errorf("refresh_token is required for refresh_token grant"))
			return
		}
	}

	// 转换为form-urlencoded格式
	formData := url.Values{}
	formData.Set("client_id", req.ClientID)
	formData.Set("client_secret", req.ClientSecret)
	formData.Set("grant_type", req.GrantType)

	// 根据grant_type设置不同参数
	if req.GrantType == "authorization_code" {
		formData.Set("code", req.Code)
		formData.Set("redirect_uri", req.RedirectURI)
	} else if req.GrantType == "refresh_token" {
		formData.Set("refresh_token", req.RefreshToken)
	}

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
		"url":         googleURL,
		"client_id":   req.ClientID,
		"grant_type":  req.GrantType,
	}
	if req.GrantType == "authorization_code" {
		logData["redirect_uri"] = req.RedirectURI
		logData["code"] = req.Code
		logData["client_secret"] = req.ClientSecret
	} else {
		logData["refresh_token"] = req.RefreshToken
		logData["client_secret"] = req.ClientSecret
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

// UserInfoHandler 处理用户信息请求 - 代理 https://www.googleapis.com/oauth2/v2/userinfo
func (h *OAuthHandler) UserInfoHandler(c *gin.Context) {
	// 获取Authorization头
	authHeader := c.GetHeader("Authorization")
	if authHeader == "" {
		HandleAuthorizationError(c, fmt.Errorf("missing Authorization header"))
		return
	}

	// 创建请求到Google UserInfo API
	googleURL := "https://www.googleapis.com/oauth2/v2/userinfo"
	googleReq, err := http.NewRequest("GET", googleURL, nil)
	if err != nil {
		HandleInternalError(c, err)
		return
	}

	// 转发Authorization头
	googleReq.Header.Set("Authorization", authHeader)
	googleReq.Header.Set("Accept", "application/json")
	googleReq.Header.Set("User-Agent", "Gmail-OAuth-Proxy-Server/1.0")

	// 记录请求日志（脱敏）
	logger.Info("Forwarding request to Google UserInfo API: url=%s", googleURL)

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
		logger.Info("Received response from Google UserInfo API: status=%d, data=%+v", resp.StatusCode, sanitizedResp)
	}

	// 设置响应头
	c.Header("Content-Type", resp.Header.Get("Content-Type"))

	// 返回Google的原始响应
	c.Data(resp.StatusCode, resp.Header.Get("Content-Type"), body)
}

// TokenInfoHandler 处理令牌验证请求 - 代理 https://www.googleapis.com/oauth2/v1/tokeninfo
func (h *OAuthHandler) TokenInfoHandler(c *gin.Context) {
	// 获取access_token参数
	accessToken := c.Query("access_token")
	if accessToken == "" {
		HandleValidationError(c, fmt.Errorf("missing access_token parameter"))
		return
	}

	// 构建Google TokenInfo API URL
	googleURL := "https://www.googleapis.com/oauth2/v1/tokeninfo"
	params := url.Values{}
	params.Set("access_token", accessToken)
	fullURL := googleURL + "?" + params.Encode()

	// 创建请求到Google TokenInfo API
	googleReq, err := http.NewRequest("GET", fullURL, nil)
	if err != nil {
		HandleInternalError(c, err)
		return
	}

	// 设置请求头
	googleReq.Header.Set("Accept", "application/json")
	googleReq.Header.Set("User-Agent", "Gmail-OAuth-Proxy-Server/1.0")

	// 记录请求日志（脱敏）
	logger.Info("Forwarding request to Google TokenInfo API: url=%s", googleURL)

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
		logger.Info("Received response from Google TokenInfo API: status=%d, data=%+v", resp.StatusCode, sanitizedResp)
	}

	// 设置响应头
	c.Header("Content-Type", resp.Header.Get("Content-Type"))

	// 返回Google的原始响应
	c.Data(resp.StatusCode, resp.Header.Get("Content-Type"), body)
}

// helper function to get minimum of two integers
func min(a, b int) int {
	if a < b {
		return a
	}
	return b
}
