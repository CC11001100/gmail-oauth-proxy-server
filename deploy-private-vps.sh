#!/bin/bash

# Stop on any error
set -e

# --- Configuration ---
JUMP_HOST="root@8.130.35.126"
TARGET_HOST="root@107.175.69.179"
REMOTE_PROJECT_DIR="/root/deploy/gmail-oauth-proxy-server"
SERVICE_NAME="gmail-oauth-proxy"
APP_PORT=9080
GIT_REPO="https://github.com/cc11001100/gmail-oauth-proxy-server.git"

# --- SSH Command ---
SSH_CMD="ssh -J ${JUMP_HOST} ${TARGET_HOST}"

echo "🚀 Starting deployment to ${TARGET_HOST}..."

# Run the deployment commands on the remote server
${SSH_CMD} BASH_ENV=/root/.bashrc 'bash -s' <<EOF
# Stop on any error in the remote script
set -e

echo "    - Navigating to project directory..."
# Create the directory if it doesn't exist
mkdir -p ${REMOTE_PROJECT_DIR}
cd ${REMOTE_PROJECT_DIR}

# Clone the repo if it's not already there
if [ ! -d ".git" ]; then
    echo "    - Cloning repository..."
    git clone ${GIT_REPO} .
else
    echo "    - Pulling latest changes..."
    git pull
fi

echo "    - Building Go application..."
# Build the application
GOOS=linux GOARCH=amd64 go build -o bin/oauth-proxy-server main.go
chmod +x bin/oauth-proxy-server

echo "    - Creating systemd service file..."
# Create a systemd service file to manage the application
cat > /etc/systemd/system/${SERVICE_NAME}.service << EOL
[Unit]
Description=Gmail OAuth Proxy Server
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=${REMOTE_PROJECT_DIR}
ExecStart=${REMOTE_PROJECT_DIR}/bin/oauth-proxy-server server --port ${APP_PORT} --config config-no-auth.yaml
Restart=on-failure
RestartSec=5s

[Install]
WantedBy=multi-user.target
EOL

echo "    - Reloading systemd and restarting service..."
systemctl daemon-reload
systemctl enable ${SERVICE_NAME}.service
systemctl restart ${SERVICE_NAME}.service

echo "✅ Deployment successful!"
echo "   To check status, run: systemctl status ${SERVICE_NAME}.service"

EOF

echo "🎉 All done!"

