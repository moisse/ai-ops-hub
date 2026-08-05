const express = require('express');
const cors = require('cors');
const path = require('path');
const Database = require('better-sqlite3');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Initialize SQLite Database
const dbPath = path.join(__dirname, '../data/ai-ops.db');
const dbDir = path.dirname(dbPath);

require('fs').mkdirSync(dbDir, { recursive: true });
const db = new Database(dbPath);

// Create Tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'admin',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS servers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    alias TEXT,
    ip TEXT NOT NULL,
    port INTEGER DEFAULT 22,
    user TEXT DEFAULT 'root',
    ssh_key_path TEXT,
    os TEXT,
    cloud_provider TEXT,
    region TEXT,
    status TEXT DEFAULT 'online',
    cpu INTEGER DEFAULT 15,
    memory INTEGER DEFAULT 42,
    last_seen DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS certificates (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    server TEXT NOT NULL,
    expiry_date TEXT,
    days_left INTEGER,
    status TEXT NOT NULL
  );
`);

// Auth API Routes
app.get('/api/auth/status', (req, res) => {
  const userCount = db.prepare('SELECT count(*) as count FROM users').get().count;
  res.json({ initialized: userCount > 0 });
});

app.post('/api/auth/setup', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const userCount = db.prepare('SELECT count(*) as count FROM users').get().count;
  if (userCount > 0) {
    return res.status(400).json({ error: 'System already initialized' });
  }

  db.prepare('INSERT INTO users (username, password, role) VALUES (?, ?, ?)').run(username, password, 'superadmin');
  const token = 'token_' + Date.now() + '_' + Math.random().toString(36).substring(2);
  res.status(201).json({ message: 'Super admin created successfully', token, user: { username, role: 'superadmin' } });
});

app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE username = ? AND password = ?').get(username, password);
  if (!user) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  const token = 'token_' + Date.now() + '_' + Math.random().toString(36).substring(2);
  res.json({ token, user: { username: user.username, role: user.role } });
});

// Server API Routes (Clean Pure System CRUD)
app.get('/api/servers', (req, res) => {
  const servers = db.prepare('SELECT * FROM servers ORDER BY id DESC').all();
  res.json(servers.map(s => ({
    id: String(s.id),
    hostname: s.name,
    ip: s.ip,
    region: s.cloud_provider + ' ' + s.region,
    status: s.status,
    cpu: s.cpu,
    memory: s.memory,
    uptime: '1d 0h',
    latency: Math.floor(Math.random() * 20 + 1)
  })));
});

app.post('/api/servers', (req, res) => {
  const { hostname, region, ip } = req.body;
  const nodeIp = ip || ('192.168.1.' + Math.floor(Math.random() * 100 + 100));
  const result = db.prepare('INSERT INTO servers (name, ip, cloud_provider, region, status, cpu, memory) VALUES (?, ?, ?, ?, ?, ?, ?)').run(
    hostname || 'node-server.aiops.net', nodeIp, 'Cloud', region || 'US-East', 'online', Math.floor(Math.random() * 30 + 10), Math.floor(Math.random() * 40 + 20)
  );
  res.status(201).json({ id: String(result.lastInsertRowid), hostname, ip: nodeIp, status: 'online' });
});

app.delete('/api/servers/:id', (req, res) => {
  const { id } = req.params;
  db.prepare('DELETE FROM servers WHERE id = ?').run(id);
  res.json({ success: true, message: 'Server deleted successfully' });
});

// Certificates API
app.get('/api/certificates', (req, res) => {
  const certs = db.prepare('SELECT * FROM certificates').all();
  res.json(certs);
});

// AI Chat Mock API
app.post('/api/chat', (req, res) => {
  const { message } = req.body;
  const reply = `AI Ops System Diagnosis: Command "${message}" executed. Cluster health normal.`;
  res.json({ reply, timestamp: new Date().toISOString() });
});

// Serve Frontend Build Artifacts
const frontendDist = path.join(__dirname, '../../frontend/dist');
app.use(express.static(frontendDist));
app.get('*', (req, res) => {
  if (require('fs').existsSync(path.join(frontendDist, 'index.html'))) {
    res.sendFile(path.join(frontendDist, 'index.html'));
  } else {
    res.send('AI Ops Hub Express Backend API Running on Port ' + PORT);
  }
});

app.listen(PORT, () => {
  console.log(`AI Ops Hub Backend running at http://localhost:${PORT}`);
});
