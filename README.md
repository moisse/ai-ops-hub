# 🤖 AI Ops Hub (AI 智能运维枢纽)

> **面向开发者与创业者的多云服务器监控、Web SSH 终端与大模型 AI 诊断中枢**

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Vue3](https://img.shields.io/badge/frontend-Vue%203%20%7C%20Vite%20%7C%20TailwindCSS-06B6D4.svg)
![Backend](https://img.shields.io/badge/backend-Express%20%7C%20SQLite-10B981.svg)
![Version](https://img.shields.io/badge/version-v1.0.0-orange.svg)

---

## 📌 项目初衷与核心痛点

创始人 **Moisse Li**（上海该隐科技合伙人）在管理跨云基础设施（AWS / GCP / 腾讯云 / 阿里云 / Azure）时，总结了广大开发者与创业者的四大核心运维痛点：

1. **工具极度分散**：SSH 客户端、监控面板、SSL 证书追踪器各自独立，缺少统一管理入口；
2. **凭据混淆丢失**：排障时经常遗忘服务器 IP、SSH 端口、登录用户名与密钥/密码；
3. **证书过期警示**：SSL 证书或域名到期导致服务意外中断，缺乏提前告警；
4. **排障门槛高**：凌晨服务器告警时，非专业 DevOps 工程师难以迅速定位 CPU 爆满与容器崩溃原因。

**AI Ops Hub** 旨在提供一个 100% 纯净初始、一键部署、界面极具科技感、内置 Cherry Studio 风格大模型与 SysAdmin 运维 Skill 的一体化控制中心。

---

## 🚀 核心功能特性 (Features)

### 1. 🛡️ 首次登录超级管理员初始化向导 (Super Admin Setup Wizard)
- **100% 纯净系统**：部署初始化时数据库为空，无任何写死假数据；
- **自主设定超管账号与密码**：首次访问自动进入初始化向导，设定管理员凭据；
- **JWT / Session 路由拦截**：未登录用户强行访问自动重定向至 `/login`。

### 2. 🎛️ Cherry Studio 风格多厂商大模型配置中枢 (LLM Provider Management)
- **主流大模型全适配**：
  - **国内厂商**：通义千问 (Qwen / DashScope)、DeepSeek (深度求索)、智谱清言 (GLM-4)、月之暗面 (Kimi / Moonshot)、字节豆包 (Doubao)；
  - **国外与本地模型**：OpenAI (GPT-4o)、Anthropic (Claude 3.5 Sonnet)、Google Gemini、Ollama (本地私有化大模型)；
- **探针检测与健康指示**：支持一键 `[🔗 测试连接]`，并在顶栏常驻显示活动模型与连通指示灯（`🤖 AI 模型: DeepSeek-V3 🟢`）。

### 3. 🔑 专业 SSH 凭据服务器管理 (Server CRUD)
- **全套工业级参数**：支持配置 Hostname、IP / 域名、**SSH 端口 (默认 22)**、**登录用户名 (root/ubuntu)**；
- **双鉴权模式**：支持密码验证 (Password) 与 SSH 私钥 (Private Key) 验证；
- **一键探针检测**：提供 `[🔗 测试 SSH 连通性]` 按钮。

### 4. 🌐 多云集群自动分组与负载看板 (Cloud Clusters)
- **多云归类**：按 AWS、GCP、腾讯云、阿里云、Azure / 私有云自动进行集群分组；
- **集群资源看板**：实时聚合显示集群节点数、平均 CPU 占用、平均内存占用与 Ping 延迟。

### 5. 🔒 证书管理与智能自动解析 (Certificates & Auto-Inspect)
- **文案无歧义**：聚焦 SSL 证书、SSH Key 与域名生命周期管理；
- **智能自动解析**：输入域名或粘贴证书内容时，自动识别类型并推算到期时间与剩余天数；
- **到期提醒**：提供 **“开启到期前 30 天自动化告警提醒”** 开关。

### 6. ⚡ 内置 DevOps SRE 运维 Skill 提示词库 (SysAdmin AI Skills)
- **专业提示词**：注入 SysAdmin 专家级 Persona；
- **一键技能加载**：
  - 🛠️ `[CPU/内存泄漏排查]`
  - 🚀 `[Docker 容器崩盘诊断]`
  - 🔒 `[SSL 证书免费续期脚本生成]`
  - ⚡ `[Nginx 反向代理配置生成]`
  - 🧹 `[Linux 磁盘空间安全清理]`

---

## 🛠️ 技术架构 (Tech Stack)

```
ai-ops-hub/
├── frontend/             # Vue 3 + Vite + Tailwind CSS + Pinia + Vue Router
│   ├── src/
│   │   ├── pages/        # Dashboard, Clusters, AIChat, Terminal, Certificates, Settings, Login
│   │   ├── stores/       # LLM Store, i18n Store
│   │   └── i18n/         # Bilingual Locales (zh-CN default / en)
└── backend/              # Node.js + Express + better-sqlite3
    └── src/index.js      # REST API & Auth Routes
```

---

## 💻 快速部署指南 (Quick Start)

### 1. 克隆代码仓库
```bash
git clone https://github.com/moisse/ai-ops-hub.git
cd ai-ops-hub
```

### 2. 启动前端与后端 (开发模式)
```bash
# 启动后端
cd backend
npm install
npm run dev

# 启动前端
cd ../frontend
npm install
npm run dev
```

### 3. 构建生产 bundle 并启动
```bash
cd frontend && npm run build
cd ../backend && npm start
```

访问 `http://localhost:3000` 即可开启你的智能运维之旅！

---

## 📄 许可证 (License)

本项目基于 [MIT License](LICENSE) 开源发布。

**Design & Developed by Moisse Li 2026**
