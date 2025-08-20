#!/bin/bash

# Gmail OAuth Proxy Server 自定义域名部署脚本
# 使用方法: ./deploy-custom-domain.sh
# 功能: 编译网站并部署到自定义域名服务器

set -e

echo "🚀 开始部署 Gmail OAuth Proxy Server 网站到自定义域名..."

# 检查是否在website目录
if [ ! -f "package.json" ]; then
    echo "❌ 错误: 请在 website 目录下运行此脚本"
    exit 1
fi

# 检查依赖是否安装
if [ ! -d "node_modules" ]; then
    echo "📦 安装依赖..."
    npm install
fi

# 清理之前的构建
echo "🧹 清理之前的构建..."
rm -rf dist

# 设置环境变量并构建网站
echo "🔨 构建网站（自定义域名配置）..."
export VITE_BASE_PATH=/
export VITE_DEPLOY_TARGET=custom-domain
npm run build

# 检查构建是否成功
if [ ! -d "dist" ]; then
    echo "❌ 构建失败: dist 目录不存在"
    exit 1
fi

echo "✅ 构建成功!"
echo "📁 构建输出目录: dist/"
echo "📊 构建统计:"
echo "   - HTML: $(ls -lh dist/index.html | awk '{print $5}')"
if [ -d "dist/assets" ]; then
    echo "   - CSS: $(ls -lh dist/assets/*.css 2>/dev/null | wc -l) 个文件"
    echo "   - JS: $(ls -lh dist/assets/*.js 2>/dev/null | wc -l) 个文件"
fi

# 检查构建后的HTML文件
echo "🔍 检查构建结果..."
if [ -f "dist/index.html" ]; then
    echo "✅ index.html 文件存在"
    echo "📝 检查资源路径..."
    
    # 检查是否还有 /gmail-oauth-proxy-server/ 路径
    if grep -q "/gmail-oauth-proxy-server/" dist/index.html; then
        echo "⚠️  警告: HTML文件中仍包含GitHub Pages路径"
        echo "   这可能导致资源加载失败"
    else
        echo "✅ 资源路径配置正确"
    fi
fi

echo ""
echo "🎉 自定义域名构建完成!"
echo ""
echo "💡 下一步操作:"
echo "   1. 将 dist/ 目录中的文件上传到您的自定义域名服务器"
echo "   2. 确保服务器配置了正确的路由重写规则"
echo "   3. 测试网站是否正常工作"
echo ""
echo "📁 构建文件位置: dist/"
echo "🌐 目标域名: https://www.cc11001100.com/gmail-oauth-proxy-server/" 