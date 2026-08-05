// Production server - serves frontend + proxies API to backend
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PROD_PORT || 3002;
const API_URL = `http://localhost:${process.env.API_PORT || 3000}`;

// Serve frontend static files
app.use(express.static(path.join(__dirname, 'frontend/dist')));

// Manual API proxy
app.use('/api', async (req, res) => {
  try {
    const url = new URL(req.url, API_URL);
    const response = await fetch(url.toString(), {
      method: req.method,
      headers: {
        'Content-Type': req.headers['content-type'] || 'application/json',
      },
      body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined,
    });
    
    const data = await response.text();
    res.status(response.status).set('Content-Type', response.headers.get('content-type') || 'application/json').send(data);
  } catch (err) {
    res.status(502).json({ error: 'API server unavailable' });
  }
});

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/dist/index.html'));
});

createServer(app).listen(PORT, () => {
  console.log(`AI Ops Hub running on http://localhost:${PORT}`);
  console.log(`API proxy -> ${API_URL}`);
});
