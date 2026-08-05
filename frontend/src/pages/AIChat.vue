<script setup lang="ts">
import { ref } from 'vue'

const messages = ref([
  {
    id: 1,
    role: 'ai',
    content: 'Hello! I\'m your AI operations assistant. How can I help you today?',
    timestamp: '10:00 AM',
  },
])

const inputMessage = ref('')
const selectedServer = ref('all')

function sendMessage() {
  if (!inputMessage.value.trim()) return

  messages.value.push({
    id: messages.value.length + 1,
    role: 'user',
    content: inputMessage.value,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  })

  // Mock AI response
  setTimeout(() => {
    messages.value.push({
      id: messages.value.length + 1,
      role: 'ai',
      content: 'I received your command. Processing...',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    })
  }, 500)

  inputMessage.value = ''
}

const quickCommands = [
  '@server-01 memory',
  '/restart app',
  'scan all',
  'help',
]
</script>

<template>
  <div class="flex h-[calc(100vh-56px)]">
    <!-- Left: Conversation List -->
    <aside class="w-[200px] bg-[#0F172A] border-r border-[#1E293B] flex flex-col">
      <button class="m-3 h-9 bg-[rgba(6,182,212,0.1)] border border-dashed border-[#06B6D4] rounded-lg text-[13px] text-[#06B6D4] hover:bg-[rgba(6,182,212,0.2)] transition-all">
        + New Chat
      </button>
      <div class="flex-1 overflow-y-auto px-2">
        <div class="h-12 px-3 rounded-lg bg-[rgba(6,182,212,0.1)] border-l-2 border-[#06B6D4] mb-1">
          <div class="text-[13px] text-[#F1F5F9] truncate">Current Session</div>
          <div class="text-[11px] text-[#64748B] truncate">AI operations chat</div>
        </div>
      </div>
    </aside>

    <!-- Right: Chat Area -->
    <div class="flex-1 flex flex-col">
      <!-- Server Context Selector -->
      <div class="px-6 py-3 border-b border-[#1E293B]">
        <select v-model="selectedServer" class="bg-[#111827] border border-[#1E293B] rounded-lg px-3 py-2 text-[14px] text-[#F1F5F9] focus:outline-none focus:border-[#06B6D4]">
          <option value="all">All Servers</option>
          <option value="server-01">Server 01 (GCP)</option>
          <option value="server-02">Server 02 (AWS)</option>
          <option value="server-03">Server 03 (Azure)</option>
        </select>
      </div>

      <!-- Messages -->
      <div class="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
        <div
          v-for="msg in messages"
          :key="msg.id"
          :class="[
            'flex gap-3 max-w-[70%]',
            msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''
          ]"
        >
          <!-- Avatar -->
          <div
            :class="[
              'w-8 h-8 rounded-full flex items-center justify-center text-[14px] font-bold',
              msg.role === 'ai' ? 'bg-[#06B6D4] text-white' : 'bg-[#3B82F6] text-white'
            ]"
          >
            {{ msg.role === 'ai' ? '' : 'M' }}
          </div>

          <!-- Message Bubble -->
          <div
            :class="[
              'rounded-2xl px-4 py-3',
              msg.role === 'ai'
                ? 'bg-[#1E293B] rounded-bl-sm'
                : 'bg-gradient-to-br from-[#0891B2] to-[#2563EB] rounded-br-sm'
            ]"
          >
            <div class="text-[12px] text-[#64748B] mb-1" :class="msg.role === 'user' ? 'text-right' : ''">
              {{ msg.role === 'ai' ? 'AI Assistant' : 'Moisse' }}
            </div>
            <div class="text-[14px] text-[#F1F5F9] leading-relaxed">
              {{ msg.content }}
            </div>
            <div class="text-[11px] text-[#64748B] mt-2" :class="msg.role === 'user' ? 'text-right' : ''">
              {{ msg.timestamp }}
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Commands -->
      <div class="px-6 py-2 flex gap-2">
        <button
          v-for="cmd in quickCommands"
          :key="cmd"
          class="bg-[#1E293B] border border-[#334155] rounded-full px-3 py-1 text-[12px] text-[#94A3B8] hover:bg-[rgba(6,182,212,0.1)] hover:text-[#06B6D4] hover:border-[rgba(6,182,212,0.3)] transition-all"
        >
          {{ cmd }}
        </button>
      </div>

      <!-- Input Area -->
      <div class="px-6 py-4 border-t border-[#1E293B]">
        <div class="bg-[#111827] border border-[#1E293B] rounded-xl px-4 py-3 flex items-center gap-3">
          <input
            v-model="inputMessage"
            @keyup.enter="sendMessage"
            type="text"
            placeholder="Enter command or question... e.g., @server-01 check memory"
            class="flex-1 bg-transparent border-none outline-none text-[14px] text-[#F1F5F9] placeholder-[#64748B]"
          />
          <button class="text-[#64748B] hover:text-[#06B6D4] transition-colors">
            <span class="material-symbols-outlined text-[20px]">attach_file</span>
          </button>
          <button
            @click="sendMessage"
            :class="[
              'w-8 h-8 rounded-full flex items-center justify-center transition-all',
              inputMessage.trim()
                ? 'bg-[#06B6D4] text-white'
                : 'bg-[#334155] text-[#64748B]'
            ]"
          >
            <span class="material-symbols-outlined text-[18px]">send</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
</style>
