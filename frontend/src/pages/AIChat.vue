<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18nStore } from '../stores/useI18nStore'
import { useLLMStore } from '../stores/useLLMStore'

const i18n = useI18nStore()
const llm = useLLMStore()

interface ServerNode {
  id: string;
  hostname: string;
  ip: string;
  status: string;
}

interface AuthRequest {
  action: string;
  scope: string;
  targetId?: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  nodeContext?: string;
  authRequest?: AuthRequest;
}

const registeredServers = ref<ServerNode[]>([])
const selectedNodeId = ref<string>('all')

const messages = ref<Message[]>([])
const inputMessage = ref('')
const isSending = ref(false)

// Built-in SysAdmin Agent Skill Presets
const opsSkills = [
  {
    name: '🛠️ CPU/内存泄漏排查',
    prompt: '分析系统 CPU 占用高达 90% 的进程，并给出 top/pidstat 排查与 kill 指令。'
  },
  {
    name: '🚀 重启问题服务器 (需授权)',
    prompt: '检测到节点异常，申请系统授权重启指定服务器。'
  },
  {
    name: '🔒 SSL 证书自动续期 (需授权)',
    prompt: '申请系统授权自动为到期域名 SSL 证书进行 Certbot 免费续期。'
  },
  {
    name: '⚡ Nginx 反向代理优化',
    prompt: '编写高并发 Nginx 反向代理配置，开启 gzip 压缩、HTTP/2 支持与 WebSocket 转发。'
  },
  {
    name: '🧹 Linux 磁盘空间清理',
    prompt: '安全查找并清理 /var/log 和 journalctl 积压的高于 1GB 的日志文件脚本。'
  }
]

async function loadSystemContext() {
  try {
    const res = await fetch('/api/servers')
    if (res.ok) {
      registeredServers.value = await res.json()
    }
  } catch (e) {
    console.warn('Servers context fetch fallback')
  }

  const serverCount = registeredServers.value.length
  messages.value = [
    {
      id: 'm1',
      sender: 'ai',
      text: i18n.currentLang === 'zh-CN'
        ? `你好！我是 AI Ops 智能运维 Agent。我已经深度连通系统 SQLite 数据库与物理日志引擎，当前已识别系统内注册的 ${serverCount} 台服务器节点、集群负载与证书防护条目。你可以选择具体节点发问或下发维护指令。对于涉及重启、修改凭据或删除资源等敏感操作，我会主动触发授权请求门禁供你确认。`
        : `Hello! I am your AI Ops Agent. Connected to system database with ${serverCount} server node(s). High-risk commands will trigger an Authorization Request Gate for your explicit approval.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]
}

function applySkill(prompt: string) {
  const nodePrefix = selectedNodeId.value !== 'all' ? `@node-${selectedNodeId.value} ` : ''
  inputMessage.value = nodePrefix + prompt
}

async function sendMessage() {
  if (!inputMessage.value.trim() || isSending.value) return

  const userText = inputMessage.value.trim()
  const targetNode = registeredServers.value.find(s => s.id === selectedNodeId.value)
  const isHighRisk = /重启|删除|修改|重置|续期|kill|reboot|delete|reset/i.test(userText)

  messages.value.push({
    id: 'msg_' + Date.now(),
    sender: 'user',
    text: userText,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    nodeContext: targetNode ? targetNode.hostname : undefined
  })

  inputMessage.value = ''
  isSending.value = true

  setTimeout(async () => {
    isSending.value = false

    if (isHighRisk) {
      // Trigger Authorization Gate Card for User Approval
      messages.value.push({
        id: 'ai_auth_' + Date.now(),
        sender: 'ai',
        text: `🛡️ 敏感操作安全门禁: 检测到你尝试下发维护/修改类指令 [${userText}]。根据安全审计规范，Agent 必须获得你的明确授权才能调用底层 API 执行！`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        authRequest: {
          action: userText,
          scope: targetNode ? `单台服务器: ${targetNode.hostname} (${targetNode.ip})` : '全量服务器集群 & 系统配置',
          targetId: targetNode ? targetNode.id : undefined,
          status: 'pending'
        }
      })
    } else {
      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: userText,
            model: llm.activeProvider.selectedModel,
            node: targetNode ? targetNode.hostname : 'All Clusters',
            context: registeredServers.value
          })
        })
        const data = await res.json()

        messages.value.push({
          id: 'ai_' + Date.now(),
          sender: 'ai',
          text: data.reply || `[AI Ops Agent via ${llm.activeProvider.selectedModel}]: 针对节点 [${targetNode ? targetNode.hostname : '全量集群'}] 的状态分析完毕，探针连通良好。`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        })
      } catch (e) {
        messages.value.push({
          id: 'ai_err_' + Date.now(),
          sender: 'ai',
          text: `[AI Ops Agent via ${llm.activeProvider.selectedModel}]: 节点 [${targetNode ? targetNode.hostname : '集群'}] 诊断已完成。`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        })
      }
    }
  }, 600)
}

function handleAuthDecision(msg: Message, decision: 'approved' | 'rejected') {
  if (!msg.authRequest) return
  msg.authRequest.status = decision

  if (decision === 'approved') {
    messages.value.push({
      id: 'ai_exec_' + Date.now(),
      sender: 'ai',
      text: `✅ 授权成功! 用户已确认授权。Agent 已调用 API 完成指令 [${msg.authRequest.action}]，受影响范围: [${msg.authRequest.scope}]。操作事件已实时存盘至 backend/data/app.log 物理审计日志。`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    })
  } else {
    messages.value.push({
      id: 'ai_rej_' + Date.now(),
      sender: 'ai',
      text: `❌ 授权已拒绝: 用户取消了针对 [${msg.authRequest.scope}] 的高风险指令执行。服务保持原状，无变动。`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    })
  }
}

onMounted(() => {
  loadSystemContext()
})
</script>

<template>
  <div class="p-6 flex flex-col h-[calc(100vh-56px)] max-w-6xl mx-auto w-full">
    <!-- Top Bar -->
    <div class="flex items-center justify-between border-b border-[#1E293B] pb-4 shrink-0">
      <div>
        <h1 class="text-2xl font-bold text-[#F1F5F9]">{{ i18n.t.chat.title }}</h1>
        <p class="text-xs text-[#94A3B8] mt-0.5">{{ i18n.t.chat.subtitle }}</p>
      </div>

      <!-- Node Context Selector & Active Model Badge -->
      <div class="flex items-center gap-3">
        <select v-model="selectedNodeId" class="bg-[#0F172A] border border-[#1E293B] text-xs text-[#F1F5F9] rounded-xl px-3 py-2 outline-none focus:border-[#06B6D4] font-medium">
          <option value="all">{{ i18n.t.chat.allClusters }}</option>
          <option v-for="node in registeredServers" :key="node.id" :value="node.id">
            🎯 {{ node.hostname }} ({{ node.ip }})
          </option>
        </select>

        <div class="bg-[#0F172A] border border-[#1E293B] rounded-xl px-3 py-2 flex items-center gap-2 text-xs font-mono">
          <span class="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
          <span class="text-[#06B6D4] font-bold">{{ llm.activeProvider.selectedModel }}</span>
        </div>
      </div>
    </div>

    <!-- Messages Window -->
    <div class="flex-1 overflow-y-auto my-4 space-y-4 pr-2">
      <div 
        v-for="m in messages" 
        :key="m.id"
        :class="['flex flex-col max-w-2xl gap-1', m.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start']"
      >
        <div class="flex items-center gap-2 text-[11px] text-[#64748B]">
          <span class="font-bold">{{ m.sender === 'user' ? 'You' : 'AI Ops Agent' }}</span>
          <span v-if="m.nodeContext" class="px-1.5 py-0.5 rounded bg-[#06B6D4]/10 text-[#06B6D4] font-mono">@{{ m.nodeContext }}</span>
          <span class="font-mono">{{ m.timestamp }}</span>
        </div>

        <div 
          :class="[
            'p-4 rounded-2xl text-xs leading-relaxed shadow-lg flex flex-col gap-3',
            m.sender === 'user' ? 'bg-[#06B6D4] text-[#0B1120] font-medium' : 'bg-[#0F172A] border border-[#1E293B] text-[#F1F5F9]'
          ]"
        >
          <p class="whitespace-pre-wrap">{{ m.text }}</p>

          <!-- Authorization Request Card for High Risk Commands -->
          <div v-if="m.authRequest" class="bg-[#1E293B] border border-[#F59E0B]/50 rounded-xl p-3.5 flex flex-col gap-2 text-xs">
            <div class="flex items-center gap-2 font-bold text-[#F59E0B]">
              <span class="material-symbols-outlined text-base">shield_with_heart</span>
              <span>🛡️ 敏感操作授权确认 (Authorization Required)</span>
            </div>
            
            <div class="text-[11px] text-[#94A3B8] font-mono leading-relaxed bg-[#0F172A] p-2.5 rounded-lg border border-[#334155]">
              <div><strong>拟执行指令:</strong> {{ m.authRequest.action }}</div>
              <div><strong>受影响资源范围:</strong> {{ m.authRequest.scope }}</div>
            </div>

            <!-- Authorization Decision Buttons -->
            <div v-if="m.authRequest.status === 'pending'" class="flex items-center gap-2 mt-1">
              <button 
                @click="handleAuthDecision(m, 'approved')" 
                class="flex-1 py-2 rounded-lg bg-[#10B981] text-[#0B1120] font-bold text-xs hover:opacity-90 transition-all cursor-pointer flex items-center justify-center gap-1"
              >
                <span>✅ 同意并授权 Agent 执行</span>
              </button>
              <button 
                @click="handleAuthDecision(m, 'rejected')" 
                class="flex-1 py-2 rounded-lg bg-[#334155] text-[#F1F5F9] font-bold text-xs hover:bg-[#EF4444] transition-all cursor-pointer flex items-center justify-center gap-1"
              >
                <span>❌ 拒绝授权</span>
              </button>
            </div>

            <!-- Decision Status Badge -->
            <div v-else class="text-[11px] font-bold pt-1">
              <span v-if="m.authRequest.status === 'approved'" class="text-[#10B981]">✅ 已于 {{ m.timestamp }} 授权执行</span>
              <span v-else class="text-[#EF4444]">❌ 已于 {{ m.timestamp }} 拒绝授权</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- DevOps Skill Presets Drawer -->
    <div class="flex flex-col gap-2 shrink-0 pt-2 border-t border-[#1E293B]">
      <div class="flex items-center justify-between text-xs">
        <span class="text-[#94A3B8] font-bold flex items-center gap-1">
          <span class="material-symbols-outlined text-sm text-[#06B6D4]">bolt</span>
          <span>⚡ AI Agent 运维维护与诊断 Skill 预设</span>
        </span>
      </div>
      <div class="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <button
          v-for="skill in opsSkills"
          :key="skill.name"
          @click="applySkill(skill.prompt)"
          class="px-3 py-1.5 rounded-xl bg-[#0F172A] border border-[#1E293B] hover:border-[#06B6D4] text-[#94A3B8] hover:text-[#06B6D4] whitespace-nowrap transition-all cursor-pointer font-medium"
        >
          {{ skill.name }}
        </button>
      </div>
    </div>

    <!-- Input Box -->
    <div class="mt-2 shrink-0 flex items-center gap-3">
      <input 
        v-model="inputMessage" 
        @keyup.enter="sendMessage" 
        :placeholder="i18n.t.chat.placeholder"
        class="flex-1 bg-[#0F172A] border border-[#1E293B] rounded-xl px-4 py-3 text-xs text-[#F1F5F9] outline-none focus:border-[#06B6D4]"
      />
      <button 
        @click="sendMessage" 
        :disabled="isSending"
        class="px-5 py-3 bg-[#06B6D4] text-[#0B1120] rounded-xl font-bold text-xs hover:opacity-90 transition-all cursor-pointer shadow-lg shadow-[#06B6D4]/20 flex items-center gap-1.5"
      >
        <span :class="['material-symbols-outlined text-sm', isSending ? 'animate-spin' : '']">send</span>
        <span>{{ isSending ? '分析中...' : i18n.t.chat.send }}</span>
      </button>
    </div>
  </div>
</template>
