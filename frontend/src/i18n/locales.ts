export interface LocaleMessages {
  logoTitle: string;
  missionControl: string;
  serverHealthOptimal: string;
  systemOverview: string;
  nav: {
    dashboard: string;
    chat: string;
    terminal: string;
    certificates: string;
    settings: string;
    tasks: string;
    profile: string;
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
    metrics: string;
    viewLogs: string;
  };
  certificates: {
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    allTypes: string;
    allStatus: string;
    allServers: string;
    scan: string;
    name: string;
    type: string;
    server: string;
    expiryDate: string;
    daysLeft: string;
    status: string;
  };
  terminal: {
    title: string;
    subtitle: string;
    sessionTitle: string;
  };
  chat: {
    title: string;
    subtitle: string;
    inputPlaceholder: string;
    send: string;
  };
  settings: {
    title: string;
    subtitle: string;
    apiKey: string;
    save: string;
  };
}

export const zhCN: LocaleMessages = {
  logoTitle: 'AI Ops 智能运维枢纽',
  missionControl: '任务控制中心',
  serverHealthOptimal: '服务器状态: 优良',
  systemOverview: '系统全局总览',
  nav: {
    dashboard: '仪表盘控制台',
    chat: 'AI 运维助手',
    terminal: 'Web SSH 终端 Monitor',
    certificates: '密钥与证书管理',
    settings: '系统设置中心',
    tasks: '任务队列',
    profile: '个人中心'
  },
  dashboard: {
    title: 'AI 运维控制台 Dashboard',
    subtitle: '实时跨云服务器节点监控与 GPU 算力调度中心',
    totalServers: '服务器总数',
    online: '在线节点',
    warning: '告警节点',
    offline: '离线节点',
    uptime: '平均在线率',
    proxyNodes: '代理节点集群',
    addServer: '添加服务器节点',
    metrics: '查看指标',
    viewLogs: '查看日志'
  },
  certificates: {
    title: '密钥与 SSL/TLS 证书',
    subtitle: '跨云基础设施安全证书与 SSH 密钥生命周期管理',
    searchPlaceholder: '搜索证书名称、域名或服务器...',
    allTypes: '所有类型',
    allStatus: '所有状态',
    allServers: '所有服务器',
    scan: '全面安全扫描',
    name: '证书/密钥名称',
    type: '类型',
    server: '关联服务器',
    expiryDate: '到期日期',
    daysLeft: '剩余天数',
    status: '安全状态'
  },
  terminal: {
    title: 'Web SSH 终端模拟器',
    subtitle: '多节点实时命令行监控与指令下发',
    sessionTitle: '活动终端 Session'
  },
  chat: {
    title: 'AI 智能运维助手',
    subtitle: '基于 LLM 大模型的实时日志诊断与自然语言指令控制',
    inputPlaceholder: '输入运维指令或询问大模型 (如: "分析 server-03 异常原因")...',
    send: '发送指令'
  },
  settings: {
    title: '系统参数设置',
    subtitle: 'API 密钥配置、集群端点映射与告警阈值',
    apiKey: '主 API 密钥 (Primary API Key)',
    save: '保存系统配置'
  }
};

export const enUS: LocaleMessages = {
  logoTitle: 'AI Ops Hub',
  missionControl: 'Mission Control',
  serverHealthOptimal: 'Server Health: Optimal',
  systemOverview: 'System Overview',
  nav: {
    dashboard: 'Dashboard',
    chat: 'AI Chat',
    terminal: 'Terminal',
    certificates: 'Certificates & Keys',
    settings: 'Settings',
    tasks: 'Tasks',
    profile: 'User Profile'
  },
  dashboard: {
    title: 'Operations Dashboard',
    subtitle: 'Real-time multi-cloud server metrics and GPU compute cluster control',
    totalServers: 'Total Servers',
    online: 'Online',
    warning: 'Warning',
    offline: 'Offline',
    uptime: 'Uptime Rate',
    proxyNodes: 'Proxy Node Clusters',
    addServer: 'Add Server Node',
    metrics: 'METRICS',
    viewLogs: 'VIEW LOGS'
  },
  certificates: {
    title: 'Certificates & Keys',
    subtitle: 'Manage SSL/TLS and SSH keys across infrastructure',
    searchPlaceholder: 'Search certificates, domains or servers...',
    allTypes: 'All Types',
    allStatus: 'All Status',
    allServers: 'All Servers',
    scan: 'Security Scan',
    name: 'NAME',
    type: 'TYPE',
    server: 'SERVER',
    expiryDate: 'EXPIRY DATE',
    daysLeft: 'DAYS LEFT',
    status: 'STATUS'
  },
  terminal: {
    title: 'Web SSH Terminal',
    subtitle: 'Live CLI monitoring and command execution across nodes',
    sessionTitle: 'Active SSH Session'
  },
  chat: {
    title: 'AI Operations Assistant',
    subtitle: 'LLM-powered log diagnostics and natural language infrastructure control',
    inputPlaceholder: 'Type an operation command or ask AI (e.g., "Why is server-03 slow?")...',
    send: 'Send Command'
  },
  settings: {
    title: 'System Settings',
    subtitle: 'API key management, cluster endpoints, and threshold alerts',
    apiKey: 'Primary API Key',
    save: 'Save Configuration'
  }
};
