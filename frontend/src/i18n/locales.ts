export interface LocaleMessages {
  logoTitle: string;
  missionControl: string;
  serverHealthOptimal: string;
  nav: {
    dashboard: string;
    chat: string;
    terminal: string;
    certificates: string;
    settings: string;
  };
  topnav: {
    nodes: string;
    clusters: string;
    security: string;
  };
  dashboard: {
    title: string;
    subtitle: string;
    totalServers: string;
    online: string;
    warning: string;
    offline: string;
    uptime: string;
    proxyNodes: string;
    addServer: string;
  };
  chat: {
    title: string;
    subtitle: string;
    allClusters: string;
    placeholder: string;
    send: string;
  };
  terminal: {
    title: string;
    subtitle: string;
    addSession: string;
  };
  certificates: {
    title: string;
    subtitle: string;
    scan: string;
    searchPlaceholder: string;
    allTypes: string;
    allStatus: string;
    name: string;
    type: string;
    server: string;
    expiryDate: string;
    daysLeft: string;
    status: string;
  };
  settings: {
    title: string;
    subtitle: string;
  };
}

export const zhCN: LocaleMessages = {
  logoTitle: 'AI Ops 智能运维枢纽',
  missionControl: '任务控制中心',
  serverHealthOptimal: '服务状态: 优良',
  nav: {
    dashboard: '仪表盘控制台',
    chat: 'AI 运维助手',
    terminal: 'Web SSH 终端 Monitor',
    certificates: '证书管理',
    settings: '系统设置中心'
  },
  topnav: {
    nodes: '服务器节点',
    clusters: '集群管理',
    security: '证书管理'
  },
  dashboard: {
    title: '服务器节点集群监控 (Nodes)',
    subtitle: '多云 Server 监控、资源实时监控与 Web SSH/AI 诊断入口',
    totalServers: '服务器总数',
    online: '在线节点',
    warning: '告警节点',
    offline: '离线节点',
    uptime: '平均在线率',
    proxyNodes: '托管服务器节点',
    addServer: '添加服务器节点'
  },
  chat: {
    title: 'AI 智能运维助手',
    subtitle: '基于 LLM 大模型的实时日志诊断与自然语言指令控制',
    allClusters: '全部服务器集群',
    placeholder: '输入运维指令或询问大模型 (如: "分析 server-03 异常原因")...',
    send: '发送指令'
  },
  terminal: {
    title: 'Web SSH 终端 Monitor',
    subtitle: '基于 WebSockets 的跨云服务器在线 SSH 会话终端',
    addSession: '新建 SSH 会话'
  },
  certificates: {
    title: '证书管理 (SSL / SSH / Domain)',
    subtitle: '跨云基础设施安全证书与 SSH 密钥生命周期管理',
    scan: '全面安全扫描',
    searchPlaceholder: '搜索证书名称、域名或服务器...',
    allTypes: '所有类型',
    allStatus: '所有状态',
    name: '证书/密钥名称',
    type: '类型',
    server: '关联服务器',
    expiryDate: '到期日期',
    daysLeft: '剩余天数',
    status: '安全状态'
  },
  settings: {
    title: '系统参数设置',
    subtitle: 'API 密钥配置、集群端点映射与告警阈值'
  }
}

export const enUS: LocaleMessages = {
  logoTitle: 'AI Ops Hub',
  missionControl: 'Mission Control Center',
  serverHealthOptimal: 'Server Health: Optimal',
  nav: {
    dashboard: 'Dashboard',
    chat: 'AI Assistant',
    terminal: 'Web SSH Terminal',
    certificates: 'Certificates',
    settings: 'System Settings'
  },
  topnav: {
    nodes: 'Nodes',
    clusters: 'Clusters',
    security: 'Certificates'
  },
  dashboard: {
    title: 'Server Node Cluster Monitor (Nodes)',
    subtitle: 'Multi-cloud Server Infrastructure & AI Diagnostics',
    totalServers: 'Total Servers',
    online: 'Online',
    warning: 'Warning',
    offline: 'Offline',
    uptime: 'Uptime Rate',
    proxyNodes: 'Managed Server Nodes',
    addServer: 'Add Server Node'
  },
  chat: {
    title: 'AI Operations Assistant',
    subtitle: 'LLM-Powered Real-time Diagnostics & Natural Language Ops',
    allClusters: 'All Server Clusters',
    placeholder: 'Type ops command or ask LLM (e.g., "Why is node-03 slow?")...',
    send: 'Send'
  },
  terminal: {
    title: 'Web SSH Terminal Monitor',
    subtitle: 'WebSocket-based Multi-Cloud Server Web SSH Console',
    addSession: 'New SSH Session'
  },
  certificates: {
    title: 'Certificates (SSL / SSH / Domain)',
    subtitle: 'Multi-cloud Infrastructure Security & Expiry Management',
    scan: 'Full Security Scan',
    searchPlaceholder: 'Search certificate name, domain, or host...',
    allTypes: 'All Types',
    allStatus: 'All Status',
    name: 'Certificate/Key Name',
    type: 'Type',
    server: 'Associated Server',
    expiryDate: 'Expiry Date',
    daysLeft: 'Days Left',
    status: 'Status'
  },
  settings: {
    title: 'System Settings',
    subtitle: 'API Key Configuration & Alert Thresholds'
  }
}

export const messages = {
  'zh-CN': zhCN,
  'en': enUS
}
