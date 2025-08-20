#!/bin/bash

# Gmail OAuth Proxy Server 官网启动脚本
# 端口配置 - 严禁修改端口，必须使用57622端口
PORT=57622

# 脚本目录
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# 检查是否已经有进程在运行
check_and_kill_existing() {
    echo "检查端口 $PORT 是否被占用..."
    
    # 查找占用端口的进程
    PID=$(lsof -ti:$PORT 2>/dev/null)
    
    if [ ! -z "$PID" ]; then
        echo "发现端口 $PORT 被进程 $PID 占用，正在终止..."
        kill -9 $PID 2>/dev/null
        sleep 2
        
        # 再次检查是否还有进程占用
        PID=$(lsof -ti:$PORT 2>/dev/null)
        if [ ! -z "$PID" ]; then
            echo "警告：进程 $PID 仍在占用端口 $PORT，尝试强制终止..."
            kill -9 $PID 2>/dev/null
            sleep 1
        fi
        
        echo "端口 $PORT 已释放"
    else
        echo "端口 $PORT 未被占用"
    fi
}

# 启动官网
start_website() {
    echo "正在启动 Gmail OAuth Proxy Server 官网..."
    echo "端口: $PORT"
    echo "访问地址: http://localhost:$PORT"
    echo ""
    
    # 进入website目录
    cd website
    
    # 检查node_modules是否存在
    if [ ! -d "node_modules" ]; then
        echo "正在安装依赖..."
        npm install
    fi
    
    # 启动开发服务器
    echo "启动开发服务器..."
    npm run dev
}

# 主函数
main() {
    echo "=========================================="
    echo "Gmail OAuth Proxy Server 官网启动脚本"
    echo "=========================================="
    echo ""
    
    # 检查并杀死现有进程
    check_and_kill_existing
    
    # 启动官网
    start_website
}

# 执行主函数
main 