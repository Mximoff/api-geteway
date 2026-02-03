const express = require('express');
const app = express();
const PORT = 8080;

app.get('/health', (req, res) => {
  res.send('OK');
});

app.get('/api/status', (req, res) => {
  res.json({
    status: 'online',
    service: 'API Gateway',
    version: '1.0.0'
  });
});

app.get('/', (req, res) => {
  res.send(
    <!DOCTYPE html>
    <html>
    <head>
      <title>API Gateway</title>
      <style>
        body {
          font-family: Arial;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0;
        }
        .container {
          background: white;
          padding: 40px;
          border-radius: 20px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
          text-align: center;
        }
        h1 { color: #667eea; }
        .status {
          background: #4ade80;
          color: white;
          padding: 10px 20px;
          border-radius: 20px;
          display: inline-block;
          margin-top: 20px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🚀 API Gateway</h1>
        <p>Service is running smoothly</p>
        <div class="status">● Online</div>
      </div>
    </body>
    </html>
  );
});

app.listen(PORT, () => {
  console.log('API Gateway running on port ' + PORT);
});
