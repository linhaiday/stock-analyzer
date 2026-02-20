# Stock Analyzer 部署指南

## 部署到远程服务器 (38.246.248.181)

### 方式一：自动部署（推荐）

在本地运行部署脚本：

```bash
cd stock-analyzer
chmod +x deploy.sh
./deploy.sh [用户名]
# 例如: ./deploy.sh root  或  ./deploy.sh ubuntu
```

**要求：**
- 服务器已配置 SSH 免密登录（或有密码）
- 本地有该服务器的 SSH 访问权限

### 方式二：手动部署

#### 1. 登录服务器

```bash
ssh root@38.246.248.181
# 或
ssh ubuntu@38.246.248.181
```

#### 2. 安装 Docker（如未安装）

```bash
curl -fsSL https://get.docker.com | sh
systemctl enable docker
systemctl start docker

# 安装 Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
```

#### 3. 上传代码

从本地上传：
```bash
cd stock-analyzer
tar -czf ../stock-analyzer-deploy.tar.gz --exclude='node_modules' --exclude='.git' .
scp ../stock-analyzer-deploy.tar.gz root@38.246.248.181:/opt/
```

#### 4. 在服务器上解压并部署

```bash
ssh root@38.246.248.181

mkdir -p /opt/stock-analyzer
cd /opt/stock-analyzer
tar -xzf /opt/stock-analyzer-deploy.tar.gz

# 启动服务
docker-compose -f docker-compose.prod.yml down 2>/dev/null || true
docker-compose -f docker-compose.prod.yml up --build -d
```

### 方式三：Git 拉取部署

如果服务器可以访问 GitHub：

```bash
ssh root@38.246.248.181

cd /opt
git clone https://github.com/linhaiday/stock-analyzer.git
cd stock-analyzer

# 确保使用生产环境配置
cp docker-compose.prod.yml docker-compose.yml

# 启动
docker-compose up --build -d
```

## 访问地址

部署完成后：

- **前端页面**: http://38.246.248.181:5173
- **后端 API**: http://38.246.248.181:3001/api

## 防火墙配置

如果无法访问，请开放端口：

```bash
# Ubuntu/Debian (ufw)
ufw allow 5173/tcp
ufw allow 3001/tcp
ufw allow 27017/tcp  # MongoDB
ufw allow 6379/tcp   # Redis

# CentOS/RHEL (firewalld)
firewall-cmd --permanent --add-port=5173/tcp
firewall-cmd --permanent --add-port=3001/tcp
firewall-cmd --reload
```

## 查看日志

```bash
cd /opt/stock-analyzer
docker-compose logs -f server  # 查看后端日志
docker-compose logs -f web     # 查看前端日志
```

## 重启服务

```bash
cd /opt/stock-analyzer
docker-compose restart
```

## 停止服务

```bash
cd /opt/stock-analyzer
docker-compose down
```
