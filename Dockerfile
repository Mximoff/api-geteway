FROM node:18-alpine

# نصب tinyproxy
RUN apk add --no-cache tinyproxy curl

# دایرکتوری کاری
WORKDIR /app

# کپی package.json
COPY package.json ./

# نصب dependencies
RUN npm install --production

# کپی بقیه فایل‌ها
COPY . .

# تنظیمات tinyproxy
RUN echo 'User nobody' > /etc/tinyproxy/tinyproxy.conf && \
    echo 'Group nobody' >> /etc/tinyproxy/tinyproxy.conf && \
    echo 'Port 3128' >> /etc/tinyproxy/tinyproxy.conf && \
    echo 'Listen 0.0.0.0' >> /etc/tinyproxy/tinyproxy.conf && \
    echo 'Timeout 600' >> /etc/tinyproxy/tinyproxy.conf && \
    echo 'Allow 0.0.0.0/0' >> /etc/tinyproxy/tinyproxy.conf && \
    echo 'ViaProxyName "CDN"' >> /etc/tinyproxy/tinyproxy.conf && \
    mkdir -p /var/log/tinyproxy

# Health check
HEALTHCHECK --interval=30s --timeout=3s CMD curl -f http://localhost:8080/health || exit 1

# باز کردن پورت
EXPOSE 8080

# اجرا
CMD sh -c "tinyproxy -c /etc/tinyproxy/tinyproxy.conf && node server.js"
