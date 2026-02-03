FROM alpine:3.19

# نصب ابزارها
RUN apk add --no-cache \
    tinyproxy \
    nodejs \
    npm \
    curl \
    bash

# ساخت دایرکتوری‌ها
RUN mkdir -p /app /var/log/tinyproxy /run/tinyproxy && \
    chown -R nobody:nobody /var/log/tinyproxy /run/tinyproxy

WORKDIR /app

# کپی و نصب dependencies
COPY package*.json ./
RUN npm install --production --silent

# کپی فایل‌ها
COPY server.js ./
COPY tinyproxy.conf /etc/tinyproxy/tinyproxy.conf
COPY start.sh ./

# مهم: اجرایی کردن start.sh
RUN chmod +x /app/start.sh

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD curl -f http://localhost:8080/health || exit 1

EXPOSE 8080

# اجرا با bash
CMD ["/bin/sh", "/app/start.sh"]
