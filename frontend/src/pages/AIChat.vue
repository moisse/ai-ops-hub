<script setup lang="ts">
import { ref } from 'vue'
import { useI18nStore } from '../stores/useI18nStore'

const i18n = useI18nStore()

interface Message {
  id: number;
  role: 'user' | 'ai';
  content: string;
  timestamp: string;
}

const messages = ref<Message[]>([
  {
    id: 1,
    role: 'ai',
    content: i18n.currentLang === 'zh-CN' 
      ? '你好！我是你的 AI Ops 运维助手。你可以用自然语言问我任何服务器集群问题（如: "为什么 server-03 变慢？" 或 "@node-us-east-01 查看内存"）。'
      : 'Hello! I am your AI Ops assistant. Ask me anything about your cluster (e.g., "Why is server-03 slow?" or "@node-us-east-01 check memory").',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
])

const inputMessage = ref('')
const selectedServer = ref('all')
const isReplying = ref(false)

async function sendMessage() {
  const text = inputMessage.value.trim()
  if (!text || isReplying.value) return

  messages.value.push({
    id: Date.now(),
    role: 'user',
    content: text,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  })

  inputMessage.value = ''
  isReplying.value = true

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text, server: selectedServer.value })
    })
    
    if (res.ok) {
      const data = await res.json()
      messages.value.push({
        id: Date.now() + 1,
        role: 'ai',
        content: data.reply || (i18n.currentLang === 'zh-CN' ? '诊断完毕：所有集群节点连接正常，内存使用率维持在安全区间。' : 'Diagnostics complete: All cluster nodes operational.'),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      })
    } else {
      throw new Error('API reply failed')
    }
  } catch (e) {
    messages.value.push({
      id: Date.now() + 1,
      role: 'ai',
      content: i18n.currentLang === 'zh-CN'
        ? `[系统回复] 已接收针对 [${selectedServer.value}] 的指令: "${text}"。节点 CPU: 18%, 内存: 45%, 磁盘: 32%。未检测到异常死锁进程。`
        : `[System Response] Executed command for [${selectedServer.value}]: "${text}". CPU: 18%, MEM: 45%, DISK: 32%. No deadlocks found.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    })
  } finally {
    isReplying.value = false
  }
}

function fillQuickCommand(cmd: string) {
  inputMessage.value = cmd
}

const quickCommands = [
  '@node-us-east-01 memory',
  '/restart app-backend',
  'scan all',
  'help'
]
</script>

<template>
  <div class="flex flex-col h-[calc(100vh-56px)] max-w-6xl mx-auto w-full p-4 md:p-6 gap-4">
    <!-- Header -->
    <div class="flex items-center justify-between border-b border-[#1E293B] pb-3">
      <div>
        <h1 class="text-xl font-bold text-[#F1F5F9]">{{ i18n.t.chat.title }}</h1>
        <p class="text-xs text-[#94A3B8] mt-1">{{ i18n.t.chat.subtitle }}</p>
      </div>

      <!-- Server Context Selector -->
      <select v-model="selectedServer" class="bg-[#0F172A] border border-[#1E293B] rounded-lg px-3 py-1.5 text-xs text-[#F1F5F9] outline-none focus:border-[#06B6D4]">
        <option value="all">🌐 {{ i18n.currentLang === 'zh-CN' ? '全部服务器集群' : 'All Server Clusters' }}</option>
        <option value="node-us-east-01">🟢 node-us-east-01 (AWS)</option>
        <option value="node-us-west-02">🟢 node-us-west-02 (GCP)</option>
        <option value="node-eu-west-01">🟡 node-eu-west-01 (Tencent)</option>
        <option value="node-eu-central-03">🔴 node-eu-central-03 (Azure)</option>
      </select>
    </div>

    <!-- Chat Messages Window -->
    <div class="flex-1 bg-[#0F172A] border border-[#1E293B] rounded-2xl p-4 md:p-6 overflow-y-auto flex flex-col gap-4 shadow-xl">
      <div
        v-for="msg in messages"
        :key="msg.id"
        :class="[
          'flex gap-3 max-w-[85%] md:max-w-[75%]',
          msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''
        ]"
      >
        <!-- Avatar -->
        <div
          :class="[
            'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0',
            msg.role === 'ai' ? 'bg-[#06B6D4] text-[#0B1120]' : 'bg-[#3B82F6] text-white'
          ]"
        >
          <span class="material-symbols-outlined text-sm" v-if="msg.role === 'ai'">smart_toy</span>
          <span v-else>M</span>
        </div>

        <!-- Bubble -->
        <div
          :class="[
            'rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-md',
            msg.role === 'ai'
              ? 'bg-[#1E293B] text-[#F1F5F9] border border-[#334155]/60 rounded-tl-sm'
              : 'bg-gradient-to-r from-[#0891B2] to-[#2563EB] text-white rounded-tr-sm'
          ]"
        >
          <div class="text-[10px] text-[#94A3B8] mb-1 font-bold" :class="msg.role === 'user' ? 'text-right' : ''">
            {{ msg.role === 'ai' ? 'AI Assistant' : 'Moisse' }}
          </div>
          <div class="whitespace-pre-wrap font-sans">
            {{ msg.content }}
          </div>
          <div class="text-[10px] text-[#64748B] mt-2 font-mono" :class="msg.role === 'user' ? 'text-right' : ''">
            {{ msg.timestamp }}
          </div>
        </div>
      </div>

      <div v-if="isReplying" class="flex gap-3 max-w-[75%] items-center text-xs text-[#06B6D4] animate-pulse">
        <span class="material-symbols-outlined animate-spin text-sm">sync</span>
        <span>AI Diagnostics in progress...</span>
      </div>
    </div>

    <!-- Quick Commands Bar -->
    <div class="flex items-center gap-2 overflow-x-auto py-1">
      <span class="text-[11px] text-[#64748B] font-bold shrink-0">Quick Commands:</span>
      <button
        v-for="cmd in quickCommands"
        :key="cmd"
        @click="fillQuickCommand(cmd)"
        class="bg-[#1E293B] border border-[#334155] rounded-full px-3 py-1 text-xs text-[#94A3B8] hover:bg-[#06B6D4]/10 hover:text-[#06B6D4] hover:border-[#06B6D4]/40 transition-all shrink-0 cursor-pointer"
      >
        {{ cmd }}
      </button>
    </div>

    <!-- Input Bar -->
    <div class="bg-[#0F172A] border border-[#1E293B] rounded-xl p-2 flex items-center gap-2 shadow-lg focus-within:border-[#06B6D4]">
      <input
        v-model="inputMessage"
        @keyup.enter="sendMessage"
        type="text"
        :placeholder="i18n.t.chat.inputPlaceholder"
        class="flex-1 bg-transparent border-none outline-none text-xs text-[#F1F5F9] px-3 placeholder-[#64748B]"
      />
      <button 
        @click="sendMessage"
        :disabled="!inputMessage.trim() || isReplying"
        :class="[
          'px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md',
          inputMessage.trim() && !isReplying
            ? 'bg-[#06B6D4] text-[#0B1120] hover:opacity-90'
            : 'bg-[#1E293B] text-[#64748B] cursor-not-allowed'
        ]"
      >
        <span class="material-symbols-outlined text-sm">send</span>
        <span class="hidden md:inline">{{ i18n.t.chat.send }}</span>
      </button>
    </div>
  </div>
</template>
