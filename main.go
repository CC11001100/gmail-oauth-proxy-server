package main

import (
	"embed"
	"gmail-oauth-proxy-server/cmd"
	"gmail-oauth-proxy-server/internal/handler"
	"io/fs"
	"net/http"
	"path/filepath"
	"strings"

	"github.com/gin-gonic/gin"
)

//go:embed web/static
var staticFiles embed.FS

func init() {
	// 获取嵌入的文件系统
	subFS, err := fs.Sub(staticFiles, "web/static")
	if err != nil {
		panic("Failed to create sub filesystem: " + err.Error())
	}

	// 设置首页处理器
	indexHandler := func(c *gin.Context) {
		data, err := fs.ReadFile(subFS, "index.html")
		if err != nil {
			c.AbortWithStatus(http.StatusInternalServerError)
			return
		}
		c.Header("Content-Type", "text/html; charset=utf-8")
		c.Data(http.StatusOK, "text/html; charset=utf-8", data)
	}

	// 设置静态文件处理器
	fileHandler := func(c *gin.Context) {
		path := c.Param("filepath")

		// 移除前导斜杠
		path = strings.TrimPrefix(path, "/")

		// 清理路径，防止目录遍历攻击
		path = filepath.Clean(path)
		if strings.HasPrefix(path, "..") {
			c.AbortWithStatus(http.StatusForbidden)
			return
		}

		// 尝试读取文件
		data, err := fs.ReadFile(subFS, path)
		if err != nil {
			c.AbortWithStatus(http.StatusNotFound)
			return
		}

		// 设置正确的Content-Type
		contentType := getContentType(path)
		c.Header("Content-Type", contentType)
		c.Header("Cache-Control", "public, max-age=3600")

		// 返回文件内容
		c.Data(http.StatusOK, contentType, data)
	}

	// 设置静态处理器
	handler.SetStaticHandlers(indexHandler, fileHandler)
}

// getContentType 根据文件扩展名返回Content-Type
func getContentType(filename string) string {
	ext := strings.ToLower(filepath.Ext(filename))
	switch ext {
	case ".html":
		return "text/html; charset=utf-8"
	case ".css":
		return "text/css; charset=utf-8"
	case ".js":
		return "application/javascript; charset=utf-8"
	case ".json":
		return "application/json; charset=utf-8"
	case ".png":
		return "image/png"
	case ".jpg", ".jpeg":
		return "image/jpeg"
	case ".gif":
		return "image/gif"
	case ".svg":
		return "image/svg+xml"
	case ".ico":
		return "image/x-icon"
	default:
		return "application/octet-stream"
	}
}

func main() {
	cmd.Execute()
}
