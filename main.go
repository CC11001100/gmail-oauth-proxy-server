package main

import (
	"fmt"
	"strings"
	"gmail-oauth-proxy-server/cmd"
)

func main() {
	// 显示API文档信息
	fmt.Println("📚 API Documentation: https://cc11001100.github.io/gmail-oauth-proxy-server/")
	fmt.Println(strings.Repeat("=", 60))
	
	// 启动Cobra命令行应用
	cmd.Execute()
}
