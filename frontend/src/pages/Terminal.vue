<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18nStore } from '../stores/useI18nStore'

const i18n = useI18nStore()

interface Tab {
  id: string;
  name: string;
  ip: string;
  active: boolean;
}

const tabs = ref<Tab[]>([
  { id: '1', name: 'node-us-east-01.aiops.net', ip: '192.168.1.101', active: true },
  { id: '2', name: 'node-us-west-02.aiops.net', ip: '192.168.1.102', active: false }
])

const activeTab = ref(tabs.value[0])

const commandInput = ref('')
const terminalLogs = ref([
  { text: 'Connecting to node-us-east-01.aiops.net [192.168.1.101:22]...', color: 'text-[#94A3B8]' },
  { text: 'Connection established. Welcome to Ubuntu 26.04 LTS (GNU/Linux 6.8.0 x86_64)', color: 'text-[#10B981]' },
  { text: 'AI Ops Hub Integrated Web SSH Session v1.0.0', color: 'text-[#06B6D4]' },
  { text: 'Type "help", "top", "status", "ping", "uname" or "clear" to execute commands.', color: 'text-[#64748B]' },
  { text: 'moisse@node-us-east-01:~$ ', color: 'text-[#F1F5F9]' }
])

function selectTab(tab: Tab) {
  tabs.value.forEach(t => t.active = (t.id === tab.id))
  activeTab.value = tab
  terminalLogs.value.push({
    text: `Switched SSH session context to [${tab.name}]`,
    color: 'text-[#06B6D4]'
  })
}

function closeTab(tab: Tab) {
  if (tabs.value.length <= 1) return
  tabs.value = tabs.value.filter(t => t.id !== tab.id)
  if (tab.active) {
    selectTab(tabs.value[0])
  }
}

function addTab() {
  const newId = String(Date.now())
  const newTab: Tab = {
    id: newId,
    name: `node-new-${tabs.value.length + 1}.aiops.net`,
    ip: `192.168.1.10${tabs.value.length + 1}`,
    active: false
  }
  tabs.value.push(newTab)
  selectTab(newTab)
}

function handleCommand() {
  const cmd = commandInput.value.trim()
  if (!cmd) return

  // Echo user command
  terminalLogs.value.push({
    text: `moisse@${activeTab.value.name.split('.')[0]}:~$ ${cmd}`,
    color: 'text-[#F1F5F9]'
  })

  commandInput.value = ''

  // Output mock execution
  if (cmd === 'clear') {
    terminalLogs.value = []
    return
  }

  if (cmd === 'help') {
    terminalLogs.value.push({ text: 'Available SSH Commands: top, status, ping, uname, uptime, clear, help', color: 'text-[#06B6D4]' })
  } else if (cmd === 'top' || cmd === 'status') {
    terminalLogs.value.push({ text: '[CPU Usage]: 12.4%  [MEM Used]: 2.1GB / 8.0GB (26.2%)  [Tasks]: 142 total, 1 running', color: 'text-[#10B981]' })
  } else if (cmd === 'ping') {
    terminalLogs.value.push({ text: '64 bytes from 34.136.76.211: icmp_seq=1 ttl=64 time=1.24 ms', color: 'text-[#10B981]' })
  } else if (cmd === 'uname') {
    terminalLogs.value.push({ text: 'Linux node-us-east-01 6.8.0-31-generic #31-Ubuntu SMP x86_64 GNU/Linux', color: 'text-[#94A3B8]' })
  } else {
    terminalLogs.value.push({ text: `bash: command not found: ${cmd}. Type "help" for command list.`, color: 'text-[#EF4444]' })
  }
}
</script>

<template>
  <div class="flex flex-col h-[calc(100vh-56px)] max-w-7xl mx-auto w-full p-4 md:p-6 gap-4">
    <!-- Header -->
    <div class="flex items-center justify-between border-b border-[#1E293B] pb-3">
      <div>
        <h1 class="text-xl font-bold text-[#F1F5F9]">{{ i18n.t.terminal.title }}</h1>
        <p class="text-xs text-[#94A3B8] mt-1">{{ i18n.t.terminal.subtitle }}</p>
      </div>

      <button 
        @click="addTab" 
        class="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1E293B] border border-[#334155] text-xs font-bold text-[#06B6D4] hover:border-[#06B6D4] transition-all cursor-pointer"
      >
        <span class="material-symbols-outlined text-sm">add</span>
        <span>New SSH Session</span>
      </button>
    </div>

    <!-- Terminal Window Component -->
    <div class="flex-1 bg-[#090D16] border border-[#1E293B] rounded-2xl flex flex-col overflow-hidden shadow-2xl">
      <!-- Tabs Bar -->
      <div class="flex items-center bg-[#0F172A] border-b border-[#1E293B] px-2 pt-2 gap-1 overflow-x-auto">
        <div
          v-for="tab in tabs"
          :key="tab.id"
          @click="selectTab(tab)"
          :class="[
            'flex items-center gap-2 px-4 py-2 rounded-t-lg text-xs font-mono transition-all cursor-pointer border-t border-x border-[#1E293B]',
            tab.active 
              ? 'bg-[#090D16] text-[#06B6D4] border-t-2 border-t-[#06B6D4] font-bold' 
              : 'bg-[#1E293B]/40 text-[#94A3B8] hover:bg-[#1E293B]'
          ]"
        >
          <span class="w-2 h-2 rounded-full bg-[#10B981]"></span>
          <span>{{ tab.name }}</span>
          <button @click.stop="closeTab(tab)" class="text-[#64748B] hover:text-[#EF4444] ml-1">
            <span class="material-symbols-outlined text-xs">close</span>
          </button>
        </div>
      </div>

      <!-- ANSI CLI Output Screen -->
      <div class="flex-1 p-4 font-mono text-xs overflow-y-auto flex flex-col gap-1.5 leading-relaxed selection:bg-[#06B6D4]/30">
        <div 
          v-for="(log, idx) in terminalLogs" 
          :key="idx"
          :class="log.color"
        >
          {{ log.text }}
        </div>
      </div>

      <!-- Command Line Input -->
      <div class="bg-[#0F172A] border-t border-[#1E293B] p-3 flex items-center gap-2">
        <span class="font-mono text-xs font-bold text-[#06B6D4]">$</span>
        <input
          v-model="commandInput"
          @keyup.enter="handleCommand"
          type="text"
          placeholder="Type SSH command (top, status, ping, uname, clear)..."
          class="flex-1 bg-transparent border-none outline-none font-mono text-xs text-[#F1F5F9] placeholder-[#64748B]"
        />
        <button @click="handleCommand" class="px-3 py-1 bg-[#06B6D4] text-[#0B1120] rounded text-xs font-mono font-bold hover:opacity-90">
          EXEC
        </button>
      </div>
    </div>
  </div>
</template>
