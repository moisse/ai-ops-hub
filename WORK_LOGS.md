# 📓 AI Ops Hub - Obsidian 开发工作日志 (Work Logs)

#ai-ops-hub #work-log #dev-roadmap #moisse

---

## 📌 项目基本信息 (Project Metadata)

- **项目名称**: [[AI Ops Hub]] (ai-ops-hub)
- **项目作者**: **moisse** ([GitHub Profile](https://github.com/moisse))
- **项目仓库**: [https://github.com/moisse/ai-ops-hub](https://github.com/moisse/ai-ops-hub)
- **部署地址**:
  - GCP 云服务器: `http://34.136.76.211:3000/`
  - GitHub Pages: `https://moisse.github.io/ai-ops-hub/`

---

## 🗓️ 2026-08-06 工作日志记录

### 1. 核心问题诊断与安全核验
- [x] **隐私安全排查**: 剥离了所有类似可疑 API Key 的字符串，统一规范为安全占位符 `sk_live_your_api_key_here`，规避 GitHub Secret Scanning 机制误报。
- [x] **演示数据通用化**: 将代码中硬编码的服务器与个人邮箱剥离，统一替换为通用的 `admin`。
- [x] **线上无样式白屏修复**: 剥离了带 query 参数的 Tailwind Play CDN，在所有 15 个 HTML 模块中全盘注入了 **自包含暗黑主题 CSS 兜底 (Dark Theme Fallback Style)**。
- [x] **撤下原始草稿 `docs/`**: 将未清洗的 `docs/` 目录及 Agent 本地锁文件 (`.agents/`, `.claude/`, `skills-lock.json`) 从 Git 索引中彻底删除。

### 2. 开源社区标准文件构建
- [x] **LICENSE**: 创建标准的 MIT 许可协议，版权正式署名 `Copyright (c) 2026 moisse (https://github.com/moisse)`。
- [x] **README.md**: 补齐 Author 徽章 `Author: moisse`、架构图、Live Demo 链接与 Quick Start 说明。
- [x] **CI/CD Pipeline**: 编写 `.github/workflows/deploy.yml` 自动化部署流。
- [x] **Showcase Portal**: 在根目录下建立自带全量 15 个 UI 模块卡片导航的 `index.html`。

### 3. 全能前端动态交互引擎研发 (`ai-ops-interactive.js`)
- [x] **Certificates & Keys 实时过滤**: 实现了 `Search certificates...` 的实时模糊匹配搜素，以及 `SSH Key` / `SSL` / `Normal` / `Expired` 的下拉多重过滤。
- [x] **Scan 动态扫描**: 点击 `Scan` 按钮触发转圈 Loading 动画与 Toast 消息通知。
- [x] **AI Chat 消息模拟**: 实现打字按 `Enter` 键追加用户气泡，并在 0.6s 后自动追加 AI 运维诊断回复。
- [x] **Web SSH Terminal 命令行**: 实现打字输入 `top`, `status`, `ping`, `uname`, `help`, `clear` 并在屏幕追加彩色命令日志。
- [x] **Dashboard 动态 Modal**: 实现 `Add Server` 模态弹窗与 `AIOpsDB` 数据库动态增删查改。

### 18. 同源配置 100% 贯通 & 数据库与文件日志双重持久化防丢失完结 (2026-08-06 01:02)
- [x] **单点同源配置架构 (SSOT Integration)**: 彻底打通 `/api/settings` SQLite 数据库表，设置中心配置的大模型 API Key、探针通过的活动模型、CPU/内存告警阈值全量贯通到 `AIChat.vue` 诊断、`Dashboard.vue` 告警与 `Clusters.vue` 负载分析。
- [x] **物理日志文件持久化追加引擎 (`backend/data/app.log`)**: 实现 `logEvent(level, message, meta)` 文件流追加引擎，所有服务器探针、用户登录、SSH 会话与 AI 诊断事件实时追加写入 `app.log`，绝无日志丢失。
- [x] **SQLite 零数据丢失保障 (`backend/data/ai-ops.db`)**: 服务器节点、用户 Auth 账户、证书防护条目全量实时落库，即使服务器重启或关机，数据 100% 完好无损。
- [x] **云端部署重载**: 云服务器 `34.136.76.211:3000` 与 GitHub `6129aa4` 全量推送到位。

---

## 🎯 拟定后续迭代 Roadmap

1. [ ] **数据持久化扩展**: 将 `AIOpsDB` 中的服务器与证书增删改查无缝同步至 `IndexedDB` / SQLite。
2. [ ] **多主题与响应式增强**: 提升移动端 UI 触摸手感。
3. [ ] **xterm.js Web 终端连通**: 为 Terminal 页面集成真实的 `xterm.js` 终端渲染引擎。
