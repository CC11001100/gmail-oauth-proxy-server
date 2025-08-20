#!/bin/bash

# GitHub Pages 部署脚本
# 这个脚本用于构建适合 GitHub Pages 的版本

set -e

echo "🚀 开始构建 GitHub Pages 版本..."

# 设置环境变量
export VITE_BASE_PATH=/gmail-oauth-proxy-server/
export VITE_DEPLOY_TARGET=github-pages

echo "📝 环境变量设置完成:"
echo "  VITE_BASE_PATH=$VITE_BASE_PATH"
echo "  VITE_DEPLOY_TARGET=$VITE_DEPLOY_TARGET"

# 清理之前的构建
echo "🧹 清理之前的构建..."
rm -rf dist

# 构建项目
echo "🔨 构建项目..."
npm run build

# 检查构建结果
echo "✅ 构建完成！检查构建结果..."

if [ -f "dist/index.html" ]; then
    echo "📄 index.html 文件存在"
    
    # 检查资源路径
    if grep -q "/gmail-oauth-proxy-server/" dist/index.html; then
        echo "✅ 资源路径配置正确: 使用 /gmail-oauth-proxy-server/ 前缀"
    else
        echo "❌ 资源路径配置错误: 缺少 /gmail-oauth-proxy-server/ 前缀"
        exit 1
    fi
    
    # 显示文件大小
    echo "📊 构建文件信息:"
    ls -la dist/
    echo ""
    du -sh dist/
    
else
    echo "❌ 构建失败: dist/index.html 文件不存在"
    exit 1
fi

echo ""
echo "🎉 GitHub Pages 版本构建完成！"
echo ""
echo "📋 部署说明:"
echo "1. 将 dist/ 目录中的所有文件复制到 GitHub Pages 分支"
echo "2. 或者推送到 GitHub 的 gh-pages 分支"
echo "3. 访问地址: https://cc11001100.github.io/gmail-oauth-proxy-server/"
echo ""
echo "⚠️  注意: 这个版本只适用于 GitHub Pages 部署"
echo "   如果要部署到自定义域名，请使用 deploy-custom-domain.sh 脚本" 