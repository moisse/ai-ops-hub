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

### 16. Cherry Studio 工业级三栏式大模型中心 & 探针锁死 UI 全量上线 (2026-08-06 00:55)
- [x] **Cherry Studio 三栏式架构 (`Settings.vue`)**:
  - 栏 1：配置分类大导航 (模型服务、默认模型、常规设置、告警通知、关于项目)。
  - 栏 2：`🔍 搜索模型平台...` 搜索框与全厂商列表，带真实 `OFF ⚪` / `ON 🟢` 开关与探针延迟 ms 标记。
  - 栏 3：选中的厂商详细配置 (API Key 密码明暗切换、`[检测]` 探针、Base URL 恢复默认与锁定的 Custom Dropdown UI)。
- [x] **纯正厂商品牌矩阵 (`useLLMStore.ts`)**: 彻底删除了厂商标题后面的混淆模型名，净化为 `智谱 AI`、`DeepSeek`、`阿里云百炼`、`月之暗面`、`硅基流动`、`字节火山`、`百度千帆`、`腾讯混元`、`零一万物`、`MiniMax`、`OpenAI`、`Anthropic`、`Google Gemini`、`Groq`、`Ollama`。
- [x] **探针锁死与前沿 SOTA 模型树**: 探针未连通前强行锁死下拉框，探通后解锁智谱 GLM-4-plus/0520/Flash、DeepSeek-R1/V3、Qwen2.5-72B、o3-mini、Claude 3.5 Sonnet 模型树。
- [x] **常规配置与 Webhook 告警全量真包测试**: 支持保存 CPU/内存告警阈值，提供 `[🧪 发送测试告警消息]` 真实测试发包功能。

---

## 🎯 拟定后续迭代 Roadmap

1. [ ] **数据持久化扩展**: 将 `AIOpsDB` 中的服务器与证书增删改查无缝同步至 `IndexedDB` / SQLite。
2. [ ] **多主题与响应式增强**: 提升移动端 UI 触摸手感。
3. [ ] **xterm.js Web 终端连通**: 为 Terminal 页面集成真实的 `xterm.js` 终端渲染引擎。
