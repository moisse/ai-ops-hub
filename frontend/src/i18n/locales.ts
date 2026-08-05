export interface LocaleMessage {
  title: string;
  subtitle: string;
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
    clusters: string;
    certificates: string;
  };
  dashboard: {
    title: string;
    subtitle: string;
    addServer: string;
    totalServers: string;
    online: string;
    warning: string;
    offline: string;
    uptime: string;
    proxyNodes: string;
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
  };
  certificates: {
    title: string;
    subtitle: string;
    addCert: string;
  };
  settings: {
    title: string;
    subtitle: string;
  };
}

export const zhCN: LocaleMessage = {
  title: "AI Ops 智能运维枢纽",
  subtitle: "基于 LLM 大模型的多云服务器监控与控制面板",
  logoTitle: "AI Ops 智能运维枢纽",
  missionControl: "任务控制中心",
  serverHealthOptimal: "服务状态: 优良",
  nav: {
    dashboard: "仪表盘控制台",
    chat: "AI 运维助手",
    terminal: "SSH 终端",
    certificates: "证书管理",
    settings: "系统设置中心"
  },
  topnav: {
    clusters: "集群管理",
    certificates: "证书管理"
  },
  dashboard: {
    title: "多云服务器仪表盘",
    titleSub: "Multi-Cloud Node Status",
    subtitle: "实时监测 CPU、内存、网络及节点运行状态",
    addServer: "添加服务器节点",
    totalServers: "总服务器节点",
    online: "在线运行",
    warning: "异常告警",
    offline: "离线节点",
    uptime: "节点在线率",
    proxyNodes: "云服务器代理节点"
  },
  chat: {
    title: "AI 智能运维助手",
    subtitle: "基于 LLM 大模型的实时日志诊断与自然语言指令控制",
    allClusters: "全部服务器集群",
    placeholder: "向 AI Ops Agent 描述问题（例如：排查 CPU 占用过高，或删除域名证书）...",
    send: "发送指令"
  },
  terminal: {
    title: "SSH 终端",
    subtitle: "基于 WebSockets 的跨云服务器在线 SSH 会话终端"
  },
  certificates: {
    title: "证书管理",
    subtitle: "SSL/TLS 证书、域名及 SSH 密钥安全到期预警防护",
    addCert: "添加证书/域名防护"
  },
  settings: {
    title: "系统设置中心",
    subtitle: "管理 API 密钥、LLM 大模型提供商、系统常规选项及告警 Notifications"
  }
}

export const enUS: LocaleMessage = {
  title: "AI Ops Control Center",
  subtitle: "LLM-Powered Multi-Cloud Server Monitoring & Control Panel",
  logoTitle: "AI Ops Hub",
  missionControl: "Mission Control Center",
  serverHealthOptimal: "System Health: Optimal",
  nav: {
    dashboard: "Dashboard",
    chat: "AI Assistant",
    terminal: "SSH Terminal",
    certificates: "Certificates",
    settings: "Settings"
  },
  topnav: {
    clusters: "Clusters",
    certificates: "Certificates"
  },
  dashboard: {
    title: "Multi-Cloud Dashboard",
    titleSub: "Multi-Cloud Node Status",
    subtitle: "Real-time monitoring for CPU, Memory, Network & Server Node status",
    addServer: "Add Server Node",
    totalServers: "Total Servers",
    online: "Online",
    warning: "Warning",
    offline: "Offline",
    uptime: "Node Uptime Rate",
    proxyNodes: "Cloud Server Proxy Nodes"
  },
  chat: {
    title: "AI Ops Assistant",
    subtitle: "Real-time Log Diagnosis & Natural Language Control via LLMs",
    allClusters: "All Cloud Clusters",
    placeholder: "Ask AI Ops Agent (e.g. diagnose memory leak, or renew SSL certs)...",
    send: "Send Directive"
  },
  terminal: {
    title: "SSH Terminal",
    subtitle: "Cross-cloud WebSockets Online SSH Session Terminal"
  },
  certificates: {
    title: "Certificates",
    subtitle: "SSL/TLS Certs, Domain & SSH Keys Expiry Warning System",
    addCert: "Add Cert/Domain Guard"
  },
  settings: {
    title: "System Settings",
    subtitle: "Manage API Keys, LLM Providers, General Options & Alarm Notifications"
  }
}

export const messages = {
  'zh-CN': zhCN,
  'en-US': enUS
}
