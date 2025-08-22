#!/bin/bash

# Set error handling
set -e

# Define port number
PORT=50589

# Change to script directory
cd "$(dirname "$0")"

# Check and kill existing processes
if command -v lsof >/dev/null 2>&1; then
    OLD_PID=$(lsof -ti:$PORT || true)
    if [ ! -z "$OLD_PID" ]; then
        echo "Found port $PORT is occupied, killing process $OLD_PID..."
        kill -9 $OLD_PID
        echo "Process $OLD_PID has been terminated."
    fi
fi

# Change to website directory
cd website

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Start development server
echo "=========================================="
echo "Gmail OAuth Proxy Server Website Startup Script"
echo "Port: $PORT"
echo "Access URL: http://localhost:$PORT/"
echo "=========================================="
echo "Starting development server..."
npm run dev -- --port $PORT --host 