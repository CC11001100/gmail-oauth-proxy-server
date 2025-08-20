#!/bin/bash

echo "开始清理git历史中的大文件..."

# 创建备份分支
echo "创建备份分支..."
git branch backup-before-cleanup

echo "当前分支: $(git branch --show-current)"
echo "备份分支已创建: backup-before-cleanup"

# 检查BFG是否可用
if ! command -v bfg &> /dev/null; then
    echo "错误: BFG未安装或不可用"
    exit 1
fi

echo "BFG版本: $(bfg --version)"

# 显示清理前的大小
echo "清理前仓库大小:"
du -sh .git

# 清理大于1MB的文件
echo "清理大于1MB的文件..."
bfg --strip-blobs-bigger-than 1M

# 清理特定的二进制文件
echo "清理特定的二进制文件..."
bfg --delete-files "gmail-oauth-proxy"
bfg --delete-files "main"

# 清理并优化仓库
echo "清理并优化仓库..."
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# 显示清理后的大小
echo "清理后仓库大小:"
du -sh .git

echo ""
echo "清理完成！"
echo ""
echo "下一步操作："
echo "1. 检查清理结果: git log --oneline -10"
echo "2. 如果满意，强制推送: git push origin main --force"
echo ""
echo "⚠️  警告：这会重写git历史！"
echo "⚠️  请确保与团队协调，并通知其他协作者！"
echo "⚠️  其他协作者需要重新克隆仓库或重置他们的本地分支" 