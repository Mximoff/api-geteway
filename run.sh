#!/bin/sh

echo "Starting service..."

# Start tinyproxy in background
echo "Starting proxy component..."
tinyproxy -d -c /etc/tinyproxy/tinyproxy.conf &

# Wait for proxy to start
sleep 2

# Start Node.js application
echo "Starting application..."
exec node app.js
