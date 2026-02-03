FROM alpine:3.19

# نصب ابزارهای لازم
RUN apk add --no-cache \
    tinyproxy \
    nodejs \
    npm \
    curl

# ساخت دایرکتوری‌ها
RUN mkdir -p /app /var/log/tinyproxy /run/tinyproxy && \
    chown -R nobody:nobody /var/log/tinyproxy /run/tinyproxy

# کپی فایل‌ها
WORKDIR /app
COPY package*.json ./
RUN npm install --production --silent

COPY server.js ./
COPY tinyproxy.conf /etc/tinyproxy/tinyproxy.conf
COPY start.sh ./
RUN chmod +x start.sh

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:8080/health || exit 1

EXPOSE 8080

CMD ["./start.sh"]
