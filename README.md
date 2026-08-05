# AI Ops Hub

**AI 驱动的智能运维中枢** — 用自然语言管理多台服务器

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Vue 3](https://img.shields.io/badge/Vue-3.x-4FC08D?logo=vue.js)](https://vuejs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-22.x-339933?logo=node.js)](https://nodejs.org/)

---

## ✨ 特性

- ️ **统一仪表盘** — 一眼看清所有服务器状态（CPU/内存/磁盘/服务）
- 🤖 **AI 对话运维** — 自然语言执行命令："帮我看看小P的内存"
-  **Web SSH 终端** — 浏览器直接登录任何服务器，不用记密码
-  **密钥证书管理** — 自动扫描到期时间，提前提醒续期
-  **实时监控** — 集成 Netdata，秒级精度性能数据
- 🔔 **智能告警** — 飞书/Telegram 通知，异常自动推送

## 🏗️ 技术栈

| 层级 | 技术 |
|------|------|
| 前端 | Vue 3 + TypeScript + Tailwind CSS + shadcn/ui |
| 后端 | Node.js + Express |
| 数据库 | SQLite |
| 终端 | xterm.js |
| 图表 | ECharts |
| AI | Hermes Agent API |
| 监控 | Netdata |

## 🚀 快速开始

```bash
# 克隆项目
git clone https://github.com/moisse/ai-ops-hub.git
cd ai-ops-hub

# 安装依赖
cd frontend && npm install
cd ../backend && npm install

# 配置环境变量
cp backend/.env.example backend/.env
# 编辑 .env 填入你的配置

# 启动开发
cd frontend && npm run dev
cd backend && npm run dev
```

## 📁 项目结构

```
ai-ops-hub/
├── frontend/          # Vue 3 前端
│   ── src/
│       ├── components/  # 组件
│       ├── pages/       # 页面
│       ├── stores/      # Pinia 状态
│       └── utils/       # 工具函数
├── backend/           # Node.js 后端
│   └── src/
│       ├── routes/      # API 路由
│       ├── services/    # 业务逻辑
│       └── utils/       # 工具函数
├── docs/              # 文档
├── .gitignore
├── LICENSE
└── README.md
```

## 📋 环境变量

复制 `.env.example` 为 `.env` 并填入你的配置：

```env
# 服务器配置
PORT=3000
NODE_ENV=development

# 数据库
DATABASE_URL=./data/ai-ops.db

# AI 配置
HERMES_API_URL=http://localhost:8080
HERMES_API_KEY=your-hermes-api-key

# 通知配置
FEISHU_WEBHOOK_URL=https://open.feishu.cn/open-apis/bot/v2/hook/your-webhook
```

## 🗺️ 路线图

- [x] 项目初始化
- [ ] Phase 1: MVP 仪表盘 + 服务器管理
- [ ] Phase 2: Web SSH 终端
- [ ] Phase 3: AI 对话运维
- [ ] Phase 4: Netdata 监控集成
- [ ] Phase 5: 密钥证书管理
- [ ] Phase 6: 批量运维 + Ansible

## 🤝 贡献

欢迎提交 Issue 和 PR！

## 📄 许可证

MIT License — 详见 [LICENSE](LICENSE)
