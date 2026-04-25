#!/bin/bash
set -e

# System setup
apt-get update -y
apt-get install -y python3 python3-pip python3-venv git nginx curl

# Write environment config
cat > /etc/igrow.env << 'EOF'
AWS_AI_GATEWAY_URL=${aws_ai_gateway_url}
DATABASE_URL=postgresql://${db_user}:${db_password}@${db_host}/${db_name}
EOF
chmod 600 /etc/igrow.env

# Install Python dependencies
pip3 install fastapi "uvicorn[standard]" boto3 httpx asyncpg psycopg2-binary sqlalchemy python-dotenv

# Nginx reverse proxy — forwards :80 to FastAPI on :8000
cat > /etc/nginx/sites-available/igrow << 'NGINX'
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass         http://127.0.0.1:8000;
        proxy_set_header   Host $host;
        proxy_set_header   X-Real-IP $remote_addr;
        proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_read_timeout 60s;
    }
}
NGINX

ln -sf /etc/nginx/sites-available/igrow /etc/nginx/sites-enabled/igrow
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl enable nginx && systemctl restart nginx

# Systemd service for FastAPI backend
cat > /etc/systemd/system/igrow-backend.service << 'SERVICE'
[Unit]
Description=iGrow FastAPI Backend
After=network.target

[Service]
User=root
EnvironmentFile=/etc/igrow.env
WorkingDirectory=/opt/igrow/backend
ExecStart=/usr/bin/python3 -m uvicorn app.main:app --host 127.0.0.1 --port 8000
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
SERVICE

systemctl daemon-reload
systemctl enable igrow-backend
# Note: service will start once the app code is deployed via git push / CI
