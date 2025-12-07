# Deploy Guide - WebSocket Server on VPS

## Prerequisites

- VPS (Ubuntu 20.04/22.04 recommended)
- Domain name (optional but recommended for SSL)
- Docker & Docker Compose installed
- Git installed

## Installation Steps

### 1. Clone Repository

SSH into your VPS and clone the project:

```bash
git clone https://github.com/your-repo/websocket-server.git
cd websocket-server
```

### 2. Configure Environment

Copy the example env file and edit it:

```bash
cp .env.example .env
nano .env
```

Update `DATABASE_URL` if using an external DB, or keep it consistent with `docker-compose.yml` service name (e.g., `postgresql://user:password@postgres:5432/nchat?schema=public`).
**Important**: In Docker Compose, the host is the service name (`postgres`), not `localhost`.

### 3. Build and Run with Docker Compose

Ensure you have the `Dockerfile` (create one if missing):
_Dockerfile Example:_

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx prisma generate
RUN npm run build
CMD ["node", "dist/server.js"]
```

Run the stack:

```bash
docker-compose up -d --build
```

### 4. Setup Nginx (Reverse Proxy)

Install Nginx and configure it to forward WebSocket traffic.

`/etc/nginx/sites-available/websocket`

```nginx
server {
    listen 80;
    server_name chat.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }
}
```

Enable site:

```bash
ln -s /etc/nginx/sites-available/websocket /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

### 5. SSL (HTTPS/WSS)

Use Certbot:

```bash
apt install certbot python3-certbot-nginx
certbot --nginx -d chat.yourdomain.com
```

## Maintenance Commands

- **Logs**: `docker-compose logs -f`
- **Restart**: `docker-compose restart`
- **Update**: `git pull && docker-compose up -d --build`
