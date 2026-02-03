const express = require('express');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 8080;

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use(limiter);
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Status endpoint
app.get('/status', (req, res) => {
  res.json({
    service: 'CDN Service',
    status: 'operational',
    version: '1.0.0',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Homepage
app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CDN Service</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        .container {
            background: white;
            border-radius: 16px;
            padding: 48px;
            max-width: 600px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            text-align: center;
        }
        h1 {
            color: #667eea;
            font-size: 2.5rem;
            margin-bottom: 16px;
        }
        p {
            color: #666;
            line-height: 1.6;
            margin-bottom: 24px;
        }
        .badge {
            display: inline-block;
            background: #10b981;
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 0.875rem;
            font-weight: 600;
        }
        .stats {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
            margin-top: 32px;
        }
        .stat {
            background: #f9fafb;
            padding: 16px;
            border-radius: 8px;
        }
        .stat-value {
            font-size: 1.5rem;
            font-weight: bold;
            color: #667eea;
        }
        .stat-label {
            font-size: 0.875rem;
            color: #6b7280;
            margin-top: 4px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 CDN Service</h1>
        <p>High-performance content delivery and caching service</p>
        <span class="badge">● Operational</span>
        
        <div class="stats">
            <div class="stat">
                <div class="stat-value">99.9%</div>
                <div class="stat-label">Uptime</div>
            </div>
            <div class="stat">
                <div class="stat-value">&lt;50ms</div>
                <div class="stat-label">Latency</div>
            </div>
        </div>
    </div>
</body>
</html>
  `);
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`CDN Service running on port ${PORT}`);
});
