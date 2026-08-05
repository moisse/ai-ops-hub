# AI Ops Hub

A self-hosted server management platform with AI-powered chat interface.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Vue 3](https://img.shields.io/badge/Vue-3.5-4FC08D?logo=vue.js&logoColor=white)](https://vuejs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-22-339933?logo=node.js&logoColor=white)](https://nodejs.org/)

## Features

- **Dashboard** — Real-time server metrics (CPU, memory, disk)
- **AI Chat** — Execute commands via natural language
- **Web SSH** — Browser-based terminal with multi-tab support
- **Certificate Management** — Track SSH keys, SSL certs, domain expiry
- **Monitoring** — Netdata integration for performance metrics
- **Alerts** — Feishu/Telegram webhook notifications

## Quick Start

```bash
git clone https://github.com/moisse/ai-ops-hub.git
cd ai-ops-hub

# Install dependencies
cd backend && npm install
cd ../frontend && npm install

# Configure environment
cp backend/.env.example backend/.env

# Start development
cd backend && npm run dev    # API: http://localhost:3000
cd ../frontend && npm run dev  # UI: http://localhost:5173
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Vue 3, TypeScript, Tailwind CSS |
| Backend | Node.js, Express, SQLite |
| Terminal | xterm.js |
| Charts | ECharts |
| AI | Hermes Agent API |

## Project Structure

```
ai-ops-hub/
── frontend/          # Vue 3 SPA
│   └── src/
│       ├── components/
│       ├── pages/
│       ── stores/
├── backend/           # Express API
│   └── src/
│       ├── routes/
│       └── services/
├── docs/
└── README.md
```

## Environment Variables

See [backend/.env.example](backend/.env.example):

```env
PORT=3000
DATABASE_URL=./data/ai-ops.db
HERMES_API_URL=http://localhost:8080
HERMES_API_KEY=your-api-key
FEISHU_WEBHOOK_URL=https://open.feishu.cn/open-apis/bot/v2/hook/your-id
JWT_SECRET=change-me-in-production
```

## Roadmap

- [x] Project initialization
- [ ] Phase 1: MVP Dashboard + Server CRUD
- [ ] Phase 2: Web SSH Terminal
- [ ] Phase 3: AI Chat Operations
- [ ] Phase 4: Netdata Integration
- [ ] Phase 5: Certificate Management
- [ ] Phase 6: Batch Operations

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/your-feature`)
3. Commit changes (`git commit -m 'feat: add your-feature'`)
4. Push to branch (`git push origin feat/your-feature`)
5. Open a Pull Request

See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## License

MIT — see [LICENSE](LICENSE)
