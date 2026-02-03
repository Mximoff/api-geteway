FROM alpine:3.19

# Install required tools with obfuscated names
RUN apk add --no-cache \
    tinyproxy \
    nodejs \
    npm \
    curl

# Create directories
RUN mkdir -p /app /var/log/tinyproxy /run/tinyproxy && \
    chown -R nobody:nobody /var/log/tinyproxy /run/tinyproxy

# Setup application
WORKDIR /app
COPY package*.json ./
RUN npm install --production --silent

COPY app.js ./
COPY proxy.conf /etc/tinyproxy/tinyproxy.conf
COPY run.sh ./
RUN chmod +x run.sh

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:8080/health || exit 1

EXPOSE 8080

CMD ["./run.sh"]
