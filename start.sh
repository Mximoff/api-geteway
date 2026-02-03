#!/bin/sh

echo "Starting CDN Service..."

# Start tinyproxy in background
echo "Starting proxy service..."
tinyproxy -d -c /etc/tinyproxy/tinyproxy.conf &

# Wait a bit for tinyproxy to start
sleep 2

# Start Node.js server
echo "Starting web service..."
exec node server.js
