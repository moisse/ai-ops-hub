<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18nStore } from '../stores/useI18nStore'

const i18n = useI18nStore()

interface SSHTab {
  id: string;
  name: string;
  ip: string;
  username: string;
  status: 'connected' | 'disconnected';
  history: string[];
}

const tabs = ref<SSHTab[]>([
  {
    id: 'tab_1',
    name: 'Local Ops Node',
    ip: '127.0.0.1',
    username: 'root',
    status: 'connected',
    history: [
      'AI Ops Hub Web SSH Monitor [Linux 6.6.0-x86_64]',
      'Connected to local node via WebSockets.',
      'Type "help" to view interactive SysAdmin commands.'
    ]
  }
])

const activeTabId = ref('tab_1')
const commandInput = ref('')

// Add New SSH Modal
const showAddSSHModal = ref(false)
const newSSHName = ref('')
const newSSHIp = ref('')
const newSSHPort = ref(22)
const newSSHUser = ref('root')
const newSSHPassword = ref('')

function currentTab() {
  return tabs.value.find(t => t.id === activeTabId.value) || tabs.value[0]
}

function handleCommand() {
  const cmd = commandInput.value.trim()
  if (!cmd) return

  const tab = currentTab()
  tab.history.push(`${tab.username}@${tab.ip}:~$ ${cmd}`)
  commandInput.value = ''

  const lowered = cmd.toLowerCase()
  if (lowered === 'clear') {
    tab.history = []
    return
  }

  if (lowered === 'help') {
    tab.history.push('Available SysAdmin Commands: top, status, ping, uname, df -h, systemctl status')
    return
  }

  if (lowered === 'top' || lowered === 'status') {
    tab.history.push('CPU: 14.2% user, 2.1% sys | MEM: 3.4GB / 8.0GB | DISK: 28% (/dev/sda1)')
    return
  }

  if (lowered === 'ping') {
    tab.history.push('PING 8.8.8.8 (8.8.8.8) 56(84) bytes of data.')
    tab.history.push('64 bytes from 8.8.8.8: icmp_seq=1 ttl=116 time=14.2 ms')
    return
  }

  tab.history.push(`Executing: ${cmd} ... SUCCESS (Exit Code 0)`)
}

function addSSHTab() {
  if (!newSSHIp.value) return
  const id = 'tab_' + Date.now()
  tabs.value.push({
    id,
    name: newSSHName.value || `${newSSHUser.value}@${newSSHIp.value}`,
    ip: newSSHIp.value,
    username: newSSHUser.value,
    status: 'connected',
    history: [
      `Connected to ${newSSHUser.value}@${newSSHIp.value}:${newSSHPort.value} via WebSSH SSH2 Protocol.`,
      `Linux node ready. Type "help" or "status" for diagnostics.`
    ]
  })
  activeTabId.value = id
  showAddSSHModal.value = false
  newSSHName.value = ''
  newSSHIp.value = ''
}

function closeTab(id: string) {
  if (tabs.value.length === 1) return
  tabs.value = tabs.value.filter(t => t.id !== id)
  if (activeTabId.value === id) {
    activeTabId.value = tabs.value[0].id
  }
}
</script>

<template>
  <div class="p-6 flex flex-col h-[calc(100vh-56px)] max-w-7xl mx-auto w-full">
    <!-- Header -->
    <div class="flex items-center justify-between border-b border-[#1E293B] pb-4 shrink-0">
      <div>
        <h1 class="text-2xl font-bold text-[#F1F5F9]">{{ i18n.t.terminal.title }}</h1>
        <p class="text-xs text-[#94A3B8] mt-1">{{ i18n.t.terminal.subtitle }}</p>
      </div>

      <button 
        @click="showAddSSHModal = true"
        class="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#06B6D4] text-[#0B1120] font-bold text-xs hover:opacity-90 transition-all cursor-pointer shadow-lg shadow-[#06B6D4]/20"
      >
        <span class="material-symbols-outlined text-sm">terminal</span>
        <span>{{ i18n.currentLang === 'zh-CN' ? '新建 Web SSH 连线' : 'New SSH Connection' }}</span>
      </button>
    </div>

    <!-- Tabs Bar -->
    <div class="flex items-center gap-2 mt-4 shrink-0 overflow-x-auto border-b border-[#1E293B] pb-1">
      <div 
        v-for="t in tabs" 
        :key="t.id"
        @click="activeTabId = t.id"
        :class="[
          'flex items-center gap-2.5 px-4 py-2 rounded-t-xl border-t border-x text-xs cursor-pointer transition-all font-mono',
          activeTabId === t.id
            ? 'bg-[#0F172A] border-[#06B6D4] text-[#06B6D4] font-bold'
            : 'bg-[#1E293B]/40 border-transparent text-[#94A3B8] hover:text-[#F1F5F9]'
        ]"
      >
        <span class="w-2 h-2 rounded-full bg-[#10B981]"></span>
        <span>{{ t.name }}</span>
        <button v-if="tabs.length > 1" @click.stop="closeTab(t.id)" class="hover:text-[#EF4444]">
          <span class="material-symbols-outlined text-xs">close</span>
        </button>
      </div>
    </div>

    <!-- Terminal Window -->
    <div class="flex-1 bg-[#090D16] border border-[#1E293B] rounded-b-2xl p-4 font-mono text-xs text-[#10B981] flex flex-col justify-between overflow-hidden shadow-2xl">
      <!-- Output Area -->
      <div class="flex-1 overflow-y-auto space-y-2 pr-2">
        <div v-for="(line, idx) in currentTab().history" :key="idx" class="leading-relaxed whitespace-pre-wrap">
          {{ line }}
        </div>
      </div>

      <!-- Input Line -->
      <div class="flex items-center gap-2 pt-3 border-t border-[#1E293B]/80 mt-2 shrink-0">
        <span class="text-[#06B6D4] font-bold">{{ currentTab().username }}@{{ currentTab().ip }}:~$</span>
        <input 
          v-model="commandInput" 
          @keyup.enter="handleCommand"
          placeholder="Type command e.g. top, status, ping, clear..." 
          class="flex-1 bg-transparent text-[#F1F5F9] outline-none border-none font-mono text-xs" 
        />
      </div>
    </div>

    <!-- Add SSH Modal -->
    <div v-if="showAddSSHModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div class="bg-[#0F172A] border border-[#1E293B] rounded-2xl w-full max-w-md p-6 flex flex-col gap-4 shadow-2xl">
        <h3 class="text-base font-bold text-[#F1F5F9] border-b border-[#1E293B] pb-3">
          {{ i18n.currentLang === 'zh-CN' ? '新建 Web SSH 终端连线' : 'New Web SSH Terminal Session' }}
        </h3>
        <div class="flex flex-col gap-3 text-xs">
          <label class="text-[#94A3B8]">连线会话名称</label>
          <input v-model="newSSHName" placeholder="e.g. AWS-Production-01" class="bg-[#1E293B] border border-[#334155] rounded-lg p-2.5 text-[#F1F5F9] outline-none focus:border-[#06B6D4]" />

          <label class="text-[#94A3B8]">目标 IP 地址 / 域名</label>
          <input v-model="newSSHIp" placeholder="192.168.1.100" class="bg-[#1E293B] border border-[#334155] rounded-lg p-2.5 text-[#F1F5F9] outline-none focus:border-[#06B6D4]" />

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="text-[#94A3B8]">端口 (Port)</label>
              <input v-model.number="newSSHPort" type="number" placeholder="22" class="bg-[#1E293B] border border-[#334155] rounded-lg p-2.5 text-[#F1F5F9] outline-none focus:border-[#06B6D4]" />
            </div>
            <div>
              <label class="text-[#94A3B8]">用户名 (User)</label>
              <input v-model="newSSHUser" placeholder="root" class="bg-[#1E293B] border border-[#334155] rounded-lg p-2.5 text-[#F1F5F9] outline-none focus:border-[#06B6D4]" />
            </div>
          </div>

          <label class="text-[#94A3B8]">密码 / 密钥凭据</label>
          <input v-model="newSSHPassword" type="password" placeholder="••••••••" class="bg-[#1E293B] border border-[#334155] rounded-lg p-2.5 text-[#F1F5F9] outline-none focus:border-[#06B6D4]" />
        </div>
        <div class="flex items-center justify-end gap-3 mt-4 pt-3 border-t border-[#1E293B]">
          <button @click="showAddSSHModal = false" class="px-4 py-2 rounded-lg bg-[#1E293B] text-[#94A3B8] text-xs font-bold hover:bg-[#334155]">Cancel</button>
          <button @click="addSSHTab" class="px-4 py-2 rounded-lg bg-[#06B6D4] text-[#0B1120] text-xs font-bold hover:opacity-90">Connect</button>
        </div>
      </div>
    </div>
  </div>
</template>
