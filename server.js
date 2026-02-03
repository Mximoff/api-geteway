const http = require('http');
const https = require('https');
const { URL } = require('url');

// Worker URL - تارگت نهایی
const WORKER_URL = 'http://fuc.uae-myket-ir.workers.dev';

const server = http.createServer((req, res) => {
  // لاگ برای دیباگ
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);

  try {
    // ساخت URL کامل
    const targetUrl = new URL(req.url, WORKER_URL);
    
    // تشخیص پروتکل (http یا https)
    const protocol = targetUrl.protocol === 'https:' ? https : http;

    // آپشن‌های درخواست
    const options = {
      hostname: targetUrl.hostname,
      port: targetUrl.port || (targetUrl.protocol === 'https:' ? 443 : 80),
      path: targetUrl.pathname + targetUrl.search,
      method: req.method,
      headers: {
        ...req.headers,
        'host': targetUrl.hostname,
        'x-forwarded-for': req.socket.remoteAddress,
        'x-forwarded-proto': req.headers['x-forwarded-proto'] || 'http',
        'x-real-ip': req.socket.remoteAddress
      }
    };

    // حذف هدرهای مشکل‌ساز
    delete options.headers['connection'];
    delete options.headers['keep-alive'];

    // ارسال درخواست به Worker
    const proxyReq = protocol.request(options, (proxyRes) => {
      // کپی هدرها
      res.writeHead(proxyRes.statusCode, proxyRes.headers);
      
      // استریم کردن ریسپانس (برای سرعت بالا)
      proxyRes.pipe(res, { end: true });
    });

    // هندل کردن خطاها
    proxyReq.on('error', (err) => {
      console.error('Proxy Error:', err.message);
      if (!res.headersSent) {
        res.writeHead(502, { 'Content-Type': 'text/plain' });
        res.end('Bad Gateway: Unable to connect to worker');
      }
    });

    // استریم کردن بادی درخواست (برای POST/PUT)
    req.pipe(proxyReq, { end: true });

    // تایم‌اوت
    req.setTimeout(30000);
    proxyReq.setTimeout(30000);

  } catch (err) {
    console.error('Server Error:', err.message);
    if (!res.headersSent) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Internal Server Error');
    }
  }
});

// Error handling
server.on('error', (err) => {
  console.error('Server error:', err);
});

server.on('clientError', (err, socket) => {
  console.error('Client error:', err.message);
  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});

// پورت (Koyeb معمولاً PORT رو set می‌کنه)
const PORT = process.env.PORT || 8000;

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Reverse Proxy Server running on port ${PORT}`);
  console.log(`📡 Proxying to: ${WORKER_URL}`);
  console.log(`🌐 Koyeb URL: https://silky-rebbecca-thred-ae69d4e5.koyeb.app`);
});
