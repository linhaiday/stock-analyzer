#!/bin/bash
# Stock Analyzer 部署脚本

set -e

SERVER_IP="38.246.248.181"
REMOTE_USER="${1:-root}"

echo "🚀 部署 Stock Analyzer 到 ${SERVER_IP}..."

# 1. 压缩项目代码
echo "📦 打包代码..."
cd ..
tar -czf stock-analyzer.tar.gz --exclude='node_modules' --exclude='.git' stock-analyzer/

# 2. 上传到服务器
echo "📤 上传到服务器..."
scp stock-analyzer.tar.gz ${REMOTE_USER}@${SERVER_IP}:/tmp/

# 3. SSH 到服务器执行部署命令
echo "🔧 在服务器上部署..."
ssh ${REMOTE_USER}@${SERVER_IP} << 'EOF'
  # 安装 Docker 和 Docker Compose（如果没有）
  if ! command -v docker &> /dev/null; then
    echo "安装 Docker..."
    curl -fsSL https://get.docker.com | sh
    systemctl enable docker
    systemctl start docker
  fi

  if ! command -v docker-compose &> /dev/null; then
    echo "安装 Docker Compose..."
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-\$(uname -s)-\$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
  fi

  # 解压代码
  rm -rf /opt/stock-analyzer
  mkdir -p /opt/stock-analyzer
  cd /opt/stock-analyzer
  tar -xzf /tmp/stock-analyzer.tar.gz --strip-components=1

  # 构建并启动服务
  echo "🐳 构建 Docker 镜像..."
  docker-compose -f docker-compose.prod.yml down 2>/dev/null || true
  docker-compose -f docker-compose.prod.yml build --no-cache
  
  echo "▶️ 启动服务..."
  docker-compose -f docker-compose.prod.yml up -d

  # 清理
  rm -f /tmp/stock-analyzer.tar.gz

  echo "✅ 部署完成！"
  echo ""
  echo "访问地址："
  echo "  前端: http://${SERVER_IP}:5173"
  echo "  后端 API: http://${SERVER_IP}:3001"
EOF

# 4. 清理本地压缩包
rm -f ../stock-analyzer.tar.gz

echo "🎉 部署脚本执行完毕！"
