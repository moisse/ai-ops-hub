import { Router } from 'express';
import { Client } from 'ssh2';

const router = Router();
const connections = new Map();

router.post('/connect', (req, res) => {
  const { serverId, host, port, username, privateKey } = req.body;

  if (connections.has(serverId)) {
    return res.json({ success: true, message: 'Already connected' });
  }

  const conn = new Client();
  
  conn.on('ready', () => {
    connections.set(serverId, conn);
    res.json({ success: true, message: 'Connected' });
  });

  conn.on('error', (err) => {
    res.status(500).json({ success: false, error: err.message });
  });

  const connectConfig = {
    host,
    port: port || 22,
    username,
  };

  if (privateKey) {
    connectConfig.privateKey = privateKey;
  }

  conn.connect(connectConfig);
});

router.post('/disconnect', (req, res) => {
  const { serverId } = req.body;
  const conn = connections.get(serverId);
  
  if (conn) {
    conn.end();
    connections.delete(serverId);
  }
  
  res.json({ success: true });
});

router.post('/execute', (req, res) => {
  const { serverId, command } = req.body;
  const conn = connections.get(serverId);

  if (!conn) {
    return res.status(400).json({ success: false, error: 'Not connected' });
  }

  conn.exec(command, (err, stream) => {
    if (err) {
      return res.status(500).json({ success: false, error: err.message });
    }

    let output = '';
    stream
      .on('close', (code, signal) => {
        res.json({ success: true, output, code });
      })
      .on('data', (data) => {
        output += data.toString();
      })
      .stderr.on('data', (data) => {
        output += data.toString();
      });
  });
});

router.get('/sessions', (req, res) => {
  const sessions = Array.from(connections.keys()).map(id => ({
    serverId: id,
    connected: true,
  }));
  res.json(sessions);
});

export default router;
