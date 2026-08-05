const API_BASE = '/api';

export interface Server {
  id: number;
  name: string;
  alias?: string;
  ip: string;
  port: number;
  user: string;
  status: 'online' | 'warning' | 'offline' | 'unknown';
  cpu?: number;
  memory?: number;
  disk?: number;
  latency?: number;
}

export async function fetchServers(): Promise<Server[]> {
  const res = await fetch(`${API_BASE}/servers`);
  if (!res.ok) throw new Error('Failed to fetch servers');
  return res.json();
}

export async function createServer(data: Partial<Server>): Promise<Server> {
  const res = await fetch(`${API_BASE}/servers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create server');
  return res.json();
}

export async function updateServer(id: number, data: Partial<Server>): Promise<Server> {
  const res = await fetch(`${API_BASE}/servers/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update server');
  return res.json();
}

export async function deleteServer(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/servers/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete server');
}

export async function connectSSH(serverId: number, config: {
  host: string;
  port: number;
  username: string;
  privateKey?: string;
}): Promise<{ success: boolean }> {
  const res = await fetch(`${API_BASE}/ssh/connect`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ serverId, ...config }),
  });
  return res.json();
}

export async function executeCommand(serverId: number, command: string): Promise<{
  success: boolean;
  output?: string;
  code?: number;
}> {
  const res = await fetch(`${API_BASE}/ssh/execute`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ serverId, command }),
  });
  return res.json();
}

export async function sendChatMessage(message: string, serverContext?: string): Promise<{
  success: boolean;
  response: string;
}> {
  const res = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, serverContext }),
  });
  return res.json();
}
