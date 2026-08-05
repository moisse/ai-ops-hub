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

### 12. 0 节点在线率数理修正 & Cherry Studio 大模型中心 & DevOps SRE 技能库全线上线 (2026-08-06 00:44)
- [x] **0 节点在线率数理严谨修正 (`Dashboard.vue`)**: 彻底消除了服务器总数为 0 时在线率显示 100% 的逻辑 Bug，当 `total === 0` 时严谨输出 `0.0%`。
- [x] **专业 SSH 凭据添加弹窗 (`Dashboard.vue`)**: 支持配置 `Hostname`、`IP`、`SSH 端口 (默认 22)`、`用户名 (root/ubuntu)`、`鉴权类型 (密码 Password vs SSH 私钥 Private Key)`，并集成 `[🔗 测试 SSH 连通性]` 探针。
- [x] **Cherry Studio 风格大模型配置中心 (`Settings.vue` & `useLLMStore.ts`)**: 适配通义千问 Qwen、DeepSeek、智谱 GLM、月之暗面 Kimi、豆包、OpenAI、Claude、Gemini、Ollama，支持 API Key 测试探针、模型下拉选择与系统默认连通性常驻指示灯。
- [x] **内置 DevOps SRE 运维 Skill 提示词库 (`AIChat.vue`)**: 为 AI 诊断助手注入专业 SysAdmin 系统运维提示词，并提供 CPU/内存泄漏排查、Docker 崩盘诊断、SSL 自动续期脚本一键加载预设。
- [x] **证书防护与 Web SSH 终端弹窗 (`Certificates.vue` & `Terminal.vue`)**: 增加 `[+ 添加证书/密钥防护]` 与 `[+ 新建 Web SSH 连线]` 弹窗，支持开多 SSH 会话标签。

---

## 🎯 拟定后续迭代 Roadmap

1. [ ] **数据持久化扩展**: 将 `AIOpsDB` 中的服务器与证书增删改查无缝同步至 `IndexedDB` / SQLite。
2. [ ] **多主题与响应式增强**: 提升移动端 UI 触摸手感。
3. [ ] **xterm.js Web 终端连通**: 为 Terminal 页面集成真实的 `xterm.js` 终端渲染引擎。
