# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned
- Phase 4: Netdata Integration
- Phase 5: Certificate auto-scan
- Phase 6: Batch operations + Ansible

---

## [0.3.0] - 2026-08-05

### Added
- Frontend API integration layer (`utils/api.ts`)
- Dashboard fetches real data from backend API
- Fallback to mock data when API unavailable
- SSH connection routes (connect/disconnect/execute)
- AI Chat route with keyword matching
- `chat_history` database table

---

## [0.2.0] - 2026-08-05

### Added
- SSH routes (`/api/ssh/connect`, `/api/ssh/disconnect`, `/api/ssh/execute`)
- Chat route (`/api/chat`)
- Updated backend with new route imports
- Added `ssh2` dependency

---

## [0.1.1] - 2026-08-05

### Added
- AI Chat page with conversation interface
- Terminal page with multi-tab support
- Certificates page with filtering and table
- Settings page with 4 tabs (Servers, Notifications, Security, About)
- Updated App.vue with page routing
- Updated Sidebar with navigation events

---

## [0.1.0] - 2026-08-05

### Added
- Project initialization
- Vue 3 + TypeScript + Vite scaffold
- Tailwind CSS dark theme (Deep Space)
- Dashboard page with stats row and server cards
- ServerCard component with CPU/MEM progress bars
- StatCard component
- Sidebar navigation
- TopNav component
- Express + SQLite backend
- Servers CRUD API
- Services/Certificates/Audit APIs
- Database schema (servers, services, certificates, audit_log)
- README, CHANGELOG, CONTRIBUTING docs
- .gitignore with security rules
- .env.example template

[Unreleased]: https://github.com/moisse/ai-ops-hub/compare/v0.3.0...HEAD
[0.3.0]: https://github.com/moisse/ai-ops-hub/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/moisse/ai-ops-hub/compare/v0.1.1...v0.2.0
[0.1.1]: https://github.com/moisse/ai-ops-hub/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/moisse/ai-ops-hub/releases/tag/v0.1.0
