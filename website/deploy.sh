#!/bin/bash

# Gmail OAuth Proxy Server 网站部署脚本
# 使用方法: ./deploy.sh

set -e

echo "🚀 开始部署 Gmail OAuth Proxy Server 网站..."

# 检查是否在正确的目录
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

# 构建网站
echo "🔨 构建网站..."
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
echo "   - CSS: $(ls -lh dist/assets/*.css | awk '{print $5}')"
echo "   - JS: $(ls -lh dist/assets/*.js | awk '{print $5}')"

# 检查Git状态
if [ -d ".git" ]; then
    echo ""
    echo "📝 Git 状态:"
    git status --porcelain
    
    echo ""
    echo "🌐 部署说明:"
    echo "1. 将 dist/ 目录内容复制到你的 Web 服务器"
    echo "2. 或者推送到 GitHub 分支，启用 GitHub Pages"
    echo "3. 或者使用 GitHub Actions 自动部署"
    
    # 检查是否有未提交的更改
    if [ -n "$(git status --porcelain)" ]; then
        echo ""
        echo "⚠️  注意: 有未提交的更改，建议先提交代码"
        echo "   运行: git add . && git commit -m 'Update website'"
    fi
else
    echo ""
    echo "📝 这不是 Git 仓库，无法检查 Git 状态"
fi

echo ""
echo "🎉 部署脚本执行完成!"
echo ""
echo "💡 提示:"
echo "   - 本地预览: npm run preview"
echo "   - 开发模式: npm run dev"
echo "   - 构建优化: 检查 dist/assets/ 中的文件大小" 