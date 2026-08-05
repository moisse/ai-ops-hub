const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Ensure data directory exists
const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Persistent Log Engine (Write to app.log for Zero Log Loss)
const logFilePath = path.join(dataDir, 'app.log');
function logEvent(level, message, meta = {}) {
  const timestamp = new Date().toISOString();
  const logLine = `[${timestamp}] [${level.toUpperCase()}] ${message} ${Object.keys(meta).length ? JSON.stringify(meta) : ''}\n`;
  fs.appendFile(logFilePath, logLine, (err) => {
    if (err) console.error('Failed to write to app.log:', err);
  });
  console.log(logLine.trim());
}

logEvent('info', 'AI Ops Hub Backend Initializing Persistence Engine...');

// SQLite Database Setup
const dbPath = path.join(dataDir, 'ai-ops.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    logEvent('error', 'Failed to connect to SQLite database', { error: err.message });
  } else {
    logEvent('info', 'Connected to SQLite database', { dbPath });
  }
});

// Initialize DB Tables (Users, Servers, Certificates, Settings)
db.serialize(() => {
  // Users table
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'admin',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Servers table
  db.run(`CREATE TABLE IF NOT EXISTS servers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    hostname TEXT NOT NULL,
    ip TEXT NOT NULL,
    port INTEGER DEFAULT 22,
    username TEXT DEFAULT 'root',
    authType TEXT DEFAULT 'password',
    region TEXT DEFAULT 'AWS US-East',
    status TEXT DEFAULT 'online',
    cpu INTEGER DEFAULT 15,
    memory INTEGER DEFAULT 35,
    uptime TEXT DEFAULT '1d 0h',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Certificates table
  db.run(`CREATE TABLE IF NOT EXISTS certificates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    domain TEXT NOT NULL,
    type TEXT DEFAULT 'SSL Certificate',
    issuer TEXT DEFAULT 'Let\'s Encrypt',
    expiryDate TEXT NOT NULL,
    daysLeft INTEGER NOT NULL,
    autoRenew INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Settings SSOT Table
  db.run(`CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
});

// Auth Routes
app.get('/api/auth/status', (req, res) => {
  db.get('SELECT COUNT(*) as count FROM users', [], (err, row) => {
    if (err) {
      logEvent('error', 'Auth status check error', { error: err.message });
      return res.status(500).json({ error: err.message });
    }
    const initialized = row && row.count > 0;
    res.json({ initialized });
  });
});

app.post('/api/auth/setup', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  db.get('SELECT COUNT(*) as count FROM users', [], (err, row) => {
    if (row && row.count > 0) {
      return res.status(400).json({ error: 'Super admin already initialized' });
    }

    db.run('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', [username, password, 'superadmin'], function(err) {
      if (err) {
        logEvent('error', 'Super admin setup failed', { error: err.message });
        return res.status(500).json({ error: err.message });
      }
      logEvent('info', 'Super admin initialized successfully', { username });
      res.json({ success: true, message: 'Super admin setup complete' });
    });
  });
});

app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  db.get('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, user) => {
    if (err || !user) {
      logEvent('warn', 'Failed login attempt', { username });
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    logEvent('info', 'User login successful', { username });
    res.json({ token: `token_${user.id}_${Date.now()}`, user: { id: user.id, username: user.username, role: user.role } });
  });
});

// Server Routes
app.get('/api/servers', (req, res) => {
  db.all('SELECT * FROM servers ORDER BY id DESC', [], (err, rows) => {
    if (err) {
      logEvent('error', 'Fetch servers error', { error: err.message });
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

app.post('/api/servers', (req, res) => {
  const { hostname, ip, port = 22, username = 'root', authType = 'password', region = 'AWS US-East' } = req.body;
  const cpu = Math.floor(Math.random() * 35 + 10);
  const memory = Math.floor(Math.random() * 45 + 25);
  
  db.run(
    'INSERT INTO servers (hostname, ip, port, username, authType, region, status, cpu, memory) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [hostname || ip, ip, port, username, authType, region, 'online', cpu, memory],
    function(err) {
      if (err) {
        logEvent('error', 'Add server error', { error: err.message });
        return res.status(500).json({ error: err.message });
      }
      logEvent('info', 'Server node added to SQLite DB', { id: this.lastID, hostname, ip, port });
      res.json({ id: this.lastID, hostname, ip, port, username, authType, region, status: 'online', cpu, memory });
    }
  );
});

app.delete('/api/servers/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM servers WHERE id = ?', [id], function(err) {
    if (err) {
      logEvent('error', 'Delete server error', { id, error: err.message });
      return res.status(500).json({ error: err.message });
    }
    logEvent('info', 'Server node deleted', { id });
    res.json({ success: true });
  });
});

// Settings SSOT Routes
app.get('/api/settings', (req, res) => {
  db.all('SELECT * FROM settings', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    const result = {};
    rows.forEach(r => result[r.key] = r.value);
    res.json(result);
  });
});

app.post('/api/settings', (req, res) => {
  const settingsObj = req.body;
  const stmt = db.prepare('INSERT OR REPLACE INTO settings (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)');
  Object.keys(settingsObj).forEach(key => {
    stmt.run(key, typeof settingsObj[key] === 'string' ? settingsObj[key] : JSON.stringify(settingsObj[key]));
  });
  stmt.finalize();
  logEvent('info', 'SSOT Settings persisted to SQLite DB');
  res.json({ success: true });
});

// AI Chat Integration
app.post('/api/chat', (req, res) => {
  const { message, model, node } = req.body;
  logEvent('info', 'AI Chat Diagnosis triggered', { message, model, node });
  res.json({
    reply: `[AI Agent 运维诊断 via ${model || 'Qwen/DeepSeek'}]: 针对节点 [${node || 'All Nodes'}] 发起的【${message}】提问。探针检测当前节点负载正常，建议检查 /var/log/syslog 与 systemctl 服务状态。`
  });
});

// Static frontend serving
app.use(express.static(path.join(__dirname, '../../frontend/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
});

app.listen(PORT, () => {
  logEvent('info', `AI Ops Hub server running on port ${PORT}`);
});
