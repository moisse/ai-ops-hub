import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Database
const dbPath = path.join(__dirname, '../data/ai-ops.db');
const db = new Database(dbPath);

// Initialize tables
db.exec(`
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
    status TEXT DEFAULT 'unknown',
    last_seen DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS services (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    server_id INTEGER REFERENCES servers(id),
    name TEXT NOT NULL,
    type TEXT,
    port INTEGER,
    status TEXT DEFAULT 'unknown',
    last_check DATETIME,
    UNIQUE(server_id, name)
  );

  CREATE TABLE IF NOT EXISTS certificates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    server_id INTEGER REFERENCES servers(id),
    type TEXT NOT NULL,
    name TEXT NOT NULL,
    path TEXT,
    expiry_date DATETIME,
    days_remaining INTEGER,
    notified BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS audit_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    server_id INTEGER REFERENCES servers(id),
    user TEXT NOT NULL,
    action TEXT NOT NULL,
    command TEXT,
    result TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Servers CRUD
app.get('/api/servers', (req, res) => {
  const servers = db.prepare('SELECT * FROM servers ORDER BY created_at DESC').all();
  res.json(servers);
});

app.post('/api/servers', (req, res) => {
  const { name, alias, ip, port, user, os, cloud_provider, region } = req.body;
  const stmt = db.prepare(`
    INSERT INTO servers (name, alias, ip, port, user, os, cloud_provider, region)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const result = stmt.run(name, alias, ip, port || 22, user || 'root', os, cloud_provider, region);
  res.json({ id: result.lastInsertRowid, ...req.body });
});

app.get('/api/servers/:id', (req, res) => {
  const server = db.prepare('SELECT * FROM servers WHERE id = ?').get(req.params.id);
  if (!server) return res.status(404).json({ error: 'Server not found' });
  res.json(server);
});

app.put('/api/servers/:id', (req, res) => {
  const { name, alias, ip, port, user, os, cloud_provider, region, status } = req.body;
  const stmt = db.prepare(`
    UPDATE servers SET name=?, alias=?, ip=?, port=?, user=?, os=?, cloud_provider=?, region=?, status=?, last_seen=CURRENT_TIMESTAMP
    WHERE id=?
  `);
  stmt.run(name, alias, ip, port, user, os, cloud_provider, region, status, req.params.id);
  res.json({ id: req.params.id, ...req.body });
});

app.delete('/api/servers/:id', (req, res) => {
  db.prepare('DELETE FROM servers WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

// Services
app.get('/api/servers/:id/services', (req, res) => {
  const services = db.prepare('SELECT * FROM services WHERE server_id = ?').all(req.params.id);
  res.json(services);
});

// Certificates
app.get('/api/certificates', (req, res) => {
  const certs = db.prepare('SELECT * FROM certificates ORDER BY expiry_date ASC').all();
  res.json(certs);
});

app.get('/api/certificates/expiring', (req, res) => {
  const certs = db.prepare('SELECT * FROM certificates WHERE days_remaining <= 30 AND days_remaining > 0 ORDER BY days_remaining ASC').all();
  res.json(certs);
});

// Audit log
app.get('/api/audit-log', (req, res) => {
  const logs = db.prepare('SELECT * FROM audit_log ORDER BY created_at DESC LIMIT 100').all();
  res.json(logs);
});

app.listen(PORT, () => {
  console.log(`AI Ops Hub API running on http://localhost:${PORT}`);
});
