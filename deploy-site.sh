#!/bin/bash

# Gmail OAuth Proxy Server 网站部署脚本
# 使用方法: ./deploy-site.sh
# 功能: 编译网站并推送到gh-pages分支进行GitHub Pages部署

set -e

echo "🚀 开始部署 Gmail OAuth Proxy Server 网站到 GitHub Pages..."

# 检查是否在项目根目录
if [ ! -f "go.mod" ] || [ ! -d "website" ]; then
    echo "❌ 错误: 请在项目根目录下运行此脚本"
    exit 1
fi

# 检查Git状态
if [ ! -d ".git" ]; then
    echo "❌ 错误: 这不是一个Git仓库"
    exit 1
fi

# 检查是否有未提交的更改
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  警告: 有未提交的更改"
    echo "当前更改的文件:"
    git status --short
    echo ""
    echo "请先提交或暂存更改，然后重新运行部署脚本"
    echo "建议操作:"
    echo "  git add . && git commit -m 'Update before deployment'"
    echo "  或者: git stash"
    exit 1
fi

# 确保在main分支
current_branch=$(git branch --show-current)
if [ "$current_branch" != "main" ]; then
    echo "⚠️  警告: 当前不在main分支，正在切换到main分支..."
    git checkout main
fi

# 拉取最新代码
echo "📥 拉取最新代码..."
git pull origin main

# 进入website目录并构建
cd website
echo "📁 进入 website 目录..."

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
if [ -d "dist/assets" ]; then
    echo "   - CSS: $(ls -lh dist/assets/*.css 2>/dev/null | wc -l) 个文件"
    echo "   - JS: $(ls -lh dist/assets/*.js 2>/dev/null | wc -l) 个文件"
fi

# 返回根目录
cd ..

# 检查gh-pages分支是否存在
if ! git show-ref --verify --quiet refs/remotes/origin/gh-pages; then
    echo "🌐 创建 gh-pages 分支..."
    git checkout --orphan gh-pages
    git rm -rf . || true
    git clean -fxd
else
    echo "🌐 切换到 gh-pages 分支..."
    git checkout gh-pages
    git pull origin gh-pages
    # 清理gh-pages分支的内容（保留.git目录）
    echo "🧹 清理 gh-pages 分支内容..."
    git rm -rf . || true
    git clean -fxd
fi

# 复制构建后的文件到gh-pages分支
echo "📋 复制构建文件到 gh-pages 分支..."
cp -r website/dist/* .

# 添加所有文件到Git
echo "📝 添加文件到Git..."
git add .

# 检查是否有文件需要提交
if [ -z "$(git status --porcelain)" ]; then
    echo "ℹ️  没有文件需要提交，可能构建没有变化"
else
    # 提交更改
    commit_message="Deploy website to GitHub Pages - $(date '+%Y-%m-%d %H:%M:%S')"
    echo "💾 提交更改: $commit_message"
    git commit -m "$commit_message"
    
    # 推送到远程gh-pages分支
    echo "🚀 推送到远程 gh-pages 分支..."
    git push origin gh-pages
    
    echo "✅ 部署成功!"
    echo "🌐 网站将在几分钟内在 GitHub Pages 上可用"
    echo "   链接: https://cc11001100.github.io/gmail-oauth-proxy-server/"
fi

# 切换回main分支
echo "📁 切换回 main 分支..."
git checkout main

echo ""
echo "🎉 部署脚本执行完成!"
echo ""
echo "💡 提示:"
echo "   - 网站将在几分钟内在 GitHub Pages 上可用"
echo "   - 如果部署失败，请检查构建输出和Git状态"
echo "   - 可以手动访问: https://cc11001100.github.io/gmail-oauth-proxy-server/" 