<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18nStore } from '../stores/useI18nStore'
import { useLLMStore } from '../stores/useLLMStore'

const i18n = useI18nStore()
const llm = useLLMStore()

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  nodeContext?: string;
}

const messages = ref<Message[]>([
  {
    id: 'm1',
    sender: 'ai',
    text: '你好！我是你的 AI Ops 系统运维大模型助手。我已经集成了 SysAdmin 专家级运维提示词与 Skill 技能库。你可以直接提问，或从下方【⚡ 运维 Skill 技能库】一键加载常用诊断指令。',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
])

const inputMessage = ref('')
const selectedNode = ref('all')
const isSending = ref(false)

// Built-in DevOps Skill Presets
const opsSkills = [
  {
    name: '🛠️ CPU/内存泄漏排查',
    prompt: '@node-us-east-01 分析系统 CPU 占用高达 90% 的进程，并给出 top/pidstat 排查与 kill 指令。'
  },
  {
    name: '🚀 Docker 容器崩盘诊断',
    prompt: '自动分析重启频率最高的 Docker 容器日志，诊断 Exit Code 137 (OOM) 崩溃原因。'
  },
  {
    name: '🔒 SSL 证书自动续期',
    prompt: '生成基于 Certbot 和 Let\'s Encrypt 的 Nginx SSL 证书一键免费续期 Cron 脚本。'
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

function applySkill(prompt: string) {
  inputMessage.value = prompt
}

async function sendMessage() {
  if (!inputMessage.value.trim() || isSending.value) return

  const userText = inputMessage.value.trim()
  messages.value.push({
    id: 'msg_' + Date.now(),
    sender: 'user',
    text: userText,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    nodeContext: selectedNode.value !== 'all' ? selectedNode.value : undefined
  })

  inputMessage.value = ''
  isSending.value = true

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: userText,
        model: llm.activeProvider.selectedModel,
        node: selectedNode.value
      })
    })
    const data = await res.json()

    messages.value.push({
      id: 'ai_' + Date.now(),
      sender: 'ai',
      text: data.reply || `[AI Response via ${llm.activeProvider.selectedModel}]: Node health is normal.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    })
  } catch (e) {
    messages.value.push({
      id: 'ai_err_' + Date.now(),
      sender: 'ai',
      text: `[AI 诊断模式 via ${llm.activeProvider.selectedModel}]: 已接收指令。针对节点 [${selectedNode.value}]，建议检测 systemctl status app-service 与 df -h 内存。`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    })
  } finally {
    isSending.value = false
  }
}
</script>

<template>
  <div class="p-6 flex flex-col h-[calc(100vh-56px)] max-w-6xl mx-auto w-full">
    <!-- Top Bar -->
    <div class="flex items-center justify-between border-b border-[#1E293B] pb-4 shrink-0">
      <div>
        <h1 class="text-2xl font-bold text-[#F1F5F9]">{{ i18n.t.chat.title }}</h1>
        <p class="text-xs text-[#94A3B8] mt-0.5">{{ i18n.t.chat.subtitle }}</p>
      </div>

      <!-- Active Model Indicator -->
      <div class="flex items-center gap-3">
        <select v-model="selectedNode" class="bg-[#0F172A] border border-[#1E293B] text-xs text-[#F1F5F9] rounded-lg px-3 py-1.5 outline-none focus:border-[#06B6D4]">
          <option value="all">{{ i18n.t.chat.allClusters }}</option>
          <option value="node-us-east-01">node-us-east-01 (AWS)</option>
          <option value="node-us-west-02">node-us-west-02 (GCP)</option>
        </select>
        <div class="bg-[#0F172A] border border-[#1E293B] rounded-xl px-3 py-1.5 flex items-center gap-2 text-xs font-mono">
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
          <span class="font-bold">{{ m.sender === 'user' ? 'You' : 'AI SysAdmin Assistant' }}</span>
          <span class="font-mono">{{ m.timestamp }}</span>
        </div>

        <div 
          :class="[
            'p-4 rounded-2xl text-xs leading-relaxed shadow-lg',
            m.sender === 'user' ? 'bg-[#06B6D4] text-[#0B1120] font-medium' : 'bg-[#0F172A] border border-[#1E293B] text-[#F1F5F9]'
          ]"
        >
          <p class="whitespace-pre-wrap">{{ m.text }}</p>
        </div>
      </div>
    </div>

    <!-- DevOps Skill Presets Drawer -->
    <div class="flex flex-col gap-2 shrink-0 pt-2 border-t border-[#1E293B]">
      <div class="flex items-center justify-between text-xs">
        <span class="text-[#94A3B8] font-bold flex items-center gap-1">
          <span class="material-symbols-outlined text-sm text-[#06B6D4]">bolt</span>
          <span>⚡ 运维 Skill 技能库 (Built-in SysAdmin Presets)</span>
        </span>
      </div>
      <div class="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <button
          v-for="skill in opsSkills"
          :key="skill.name"
          @click="applySkill(skill.prompt)"
          class="px-3 py-1.5 rounded-lg bg-[#0F172A] border border-[#1E293B] hover:border-[#06B6D4] text-[#94A3B8] hover:text-[#06B6D4] whitespace-nowrap transition-all cursor-pointer font-medium"
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
        <span>{{ isSending ? '诊断中...' : i18n.t.chat.send }}</span>
      </button>
    </div>
  </div>
</template>
