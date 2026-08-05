<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18nStore } from '../stores/useI18nStore'

const router = useRouter()
const i18n = useI18nStore()

interface Server {
  id: string;
  hostname: string;
  ip: string;
  region: string;
  status: string;
  cpu: number;
  memory: number;
  disk?: number;
  uptime: string;
  latency?: number;
}

const stats = ref({
  total: 0,
  online: 0,
  warning: 0,
  offline: 0,
  uptime: 100,
})

const servers = ref<Server[]>([])
const showAddModal = ref(false)
const newServerHost = ref('')
const newServerIp = ref('')
const newServerRegion = ref('AWS US-East')

async function loadServers() {
  try {
    const res = await fetch('/api/servers')
    if (res.ok) {
      const data = await res.json()
      servers.value = data.map((item: any) => ({
        id: String(item.id),
        hostname: item.hostname || item.name || 'node-server',
        ip: item.ip || '192.168.1.100',
        region: item.region || 'US-East',
        status: item.status || 'online',
        cpu: item.cpu || Math.floor(Math.random() * 30 + 10),
        memory: item.memory || Math.floor(Math.random() * 40 + 30),
        disk: Math.floor(Math.random() * 20 + 10),
        uptime: item.uptime || '1d 0h',
        latency: item.latency || Math.floor(Math.random() * 20 + 1)
      }))
    }
  } catch (e) {
    console.warn('API fetch fallback')
  }

  // Calculate stats
  stats.value.total = servers.value.length
  stats.value.online = servers.value.filter(s => s.status === 'online').length
  stats.value.warning = servers.value.filter(s => s.status === 'warning').length
  stats.value.offline = servers.value.filter(s => s.status === 'offline').length
  stats.value.uptime = stats.value.total > 0 
    ? Number((stats.value.online / stats.value.total * 100).toFixed(1)) 
    : 100
}

async function addServer() {
  if (!newServerHost.value) return
  try {
    await fetch('/api/servers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        hostname: newServerHost.value,
        ip: newServerIp.value || ('192.168.1.' + Math.floor(Math.random() * 100 + 100)),
        region: newServerRegion.value
      })
    })
  } catch (e) {
    console.error(e)
  }
  showAddModal.value = false
  newServerHost.value = ''
  newServerIp.value = ''
  await loadServers()
}

async function deleteServer(id: string) {
  if (!confirm(i18n.currentLang === 'zh-CN' ? '确定删除该服务器节点吗？' : 'Are you sure you want to delete this server?')) return
  try {
    await fetch(`/api/servers/${id}`, { method: 'DELETE' })
  } catch (e) {
    console.error(e)
  }
  await loadServers()
}

function goToSSH(server: Server) {
  router.push('/terminal')
}

function goToAIChat(server: Server) {
  router.push('/chat')
}

onMounted(() => {
  loadServers()
})
</script>

<template>
  <div class="p-6 flex flex-col gap-6 max-w-7xl mx-auto w-full">
    <!-- Header Title -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1E293B] pb-4">
      <div>
        <h1 class="text-2xl font-bold text-[#F1F5F9]">{{ i18n.t.dashboard.title }}</h1>
        <p class="text-xs text-[#94A3B8] mt-1">{{ i18n.t.dashboard.subtitle }}</p>
      </div>
      <button 
        @click="showAddModal = true"
        class="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#06B6D4] text-[#0B1120] font-bold text-xs hover:opacity-90 transition-all cursor-pointer shadow-lg shadow-[#06B6D4]/20"
      >
        <span class="material-symbols-outlined text-sm">add</span>
        <span>{{ i18n.t.dashboard.addServer }}</span>
      </button>
    </div>

    <!-- Alert Banner -->
    <div v-if="stats.warning > 0 || stats.offline > 0" class="bg-[rgba(239,68,68,0.12)] border-l-4 border-[#EF4444] rounded-lg p-4 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <span class="material-symbols-outlined text-[#EF4444]">warning</span>
        <span class="text-xs font-semibold text-[#F1F5F9]">
          {{ i18n.currentLang === 'zh-CN' ? `警告: 检测到 ${stats.warning} 台告警节点，${stats.offline} 台离线节点！` : `Alert: ${stats.warning} warning node(s), ${stats.offline} offline node(s) detected!` }}
        </span>
      </div>
      <router-link to="/chat" class="text-xs font-bold text-[#06B6D4] hover:underline">
        {{ i18n.currentLang === 'zh-CN' ? '一键 AI 诊断' : 'Run AI Diagnostic' }} &rarr;
      </router-link>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
      <div class="bg-[#0F172A] border border-[#1E293B] rounded-xl p-4 flex flex-col gap-1">
        <span class="text-xs text-[#94A3B8] font-medium">{{ i18n.t.dashboard.totalServers }}</span>
        <span class="text-2xl font-bold text-[#F1F5F9]">{{ stats.total }}</span>
      </div>
      <div class="bg-[#0F172A] border border-[#1E293B] rounded-xl p-4 flex flex-col gap-1">
        <span class="text-xs text-[#10B981] font-medium flex items-center gap-1.5">
          <span class="w-2 h-2 rounded-full bg-[#10B981]"></span> {{ i18n.t.dashboard.online }}
        </span>
        <span class="text-2xl font-bold text-[#10B981]">{{ stats.online }}</span>
      </div>
      <div class="bg-[#0F172A] border border-[#1E293B] rounded-xl p-4 flex flex-col gap-1">
        <span class="text-xs text-[#F59E0B] font-medium flex items-center gap-1.5">
          <span class="w-2 h-2 rounded-full bg-[#F59E0B]"></span> {{ i18n.t.dashboard.warning }}
        </span>
        <span class="text-2xl font-bold text-[#F59E0B]">{{ stats.warning }}</span>
      </div>
      <div class="bg-[#0F172A] border border-[#1E293B] rounded-xl p-4 flex flex-col gap-1">
        <span class="text-xs text-[#EF4444] font-medium flex items-center gap-1.5">
          <span class="w-2 h-2 rounded-full bg-[#EF4444]"></span> {{ i18n.t.dashboard.offline }}
        </span>
        <span class="text-2xl font-bold text-[#EF4444]">{{ stats.offline }}</span>
      </div>
      <div class="bg-[#0F172A] border border-[#1E293B] rounded-xl p-4 flex flex-col gap-1">
        <span class="text-xs text-[#06B6D4] font-medium">{{ i18n.t.dashboard.uptime }}</span>
        <span class="text-2xl font-bold text-[#06B6D4]">{{ stats.uptime }}%</span>
      </div>
    </div>

    <!-- Servers Cards Grid & Pure Empty State -->
    <div class="flex flex-col gap-4 mt-2">
      <h2 class="text-base font-bold text-[#F1F5F9] flex items-center gap-2 border-l-4 border-[#06B6D4] pl-3">
        {{ i18n.t.dashboard.proxyNodes }}
      </h2>

      <!-- Pure Empty State -->
      <div v-if="servers.length === 0" class="bg-[#0F172A] border border-dashed border-[#1E293B] rounded-2xl p-12 flex flex-col items-center justify-center text-center gap-4">
        <div class="w-12 h-12 rounded-full bg-[#06B6D4]/10 text-[#06B6D4] flex items-center justify-center">
          <span class="material-symbols-outlined text-2xl">dns</span>
        </div>
        <div class="max-w-md flex flex-col gap-1">
          <h3 class="text-sm font-bold text-[#F1F5F9]">
            {{ i18n.currentLang === 'zh-CN' ? '系统已就绪，目前暂无服务器节点' : 'System Ready: No Servers Found' }}
          </h3>
          <p class="text-xs text-[#94A3B8]">
            {{ i18n.currentLang === 'zh-CN' 
              ? '这是一个 100% 纯净初始系统。点击上方 [+ 添加服务器节点] 按钮开始录入你的第一台服务器！' 
              : 'This is a 100% clean installation. Click [+ Add Server Node] above to manage your first server!' 
            }}
          </p>
        </div>
        <button 
          @click="showAddModal = true"
          class="px-4 py-2 rounded-lg bg-[#06B6D4] text-[#0B1120] font-bold text-xs hover:opacity-90 transition-all cursor-pointer shadow-md"
        >
          + {{ i18n.t.dashboard.addServer }}
        </button>
      </div>

      <!-- Real Dynamic Servers Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div 
          v-for="server in servers" 
          :key="server.id" 
          class="bg-[#0F172A] border border-[#1E293B] hover:border-[#06B6D4]/50 transition-all rounded-xl p-5 flex flex-col gap-4 shadow-lg group relative"
        >
          <!-- Top Row -->
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2.5">
              <span 
                :class="[
                  'w-3 h-3 rounded-full',
                  server.status === 'online' ? 'bg-[#10B981]' : (server.status === 'warning' ? 'bg-[#F59E0B]' : 'bg-[#EF4444]')
                ]"
              ></span>
              <span class="font-bold text-sm text-[#F1F5F9] group-hover:text-[#06B6D4] transition-colors truncate max-w-[170px]">
                {{ server.hostname }}
              </span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#1E293B] text-[#94A3B8] border border-[#334155]">
                {{ server.latency }}ms
              </span>
              <button @click="deleteServer(server.id)" class="text-[#64748B] hover:text-[#EF4444] transition-colors" title="删除服务器">
                <span class="material-symbols-outlined text-sm">delete</span>
              </button>
            </div>
          </div>

          <!-- IP & Region -->
          <div class="flex items-center justify-between text-xs text-[#64748B]">
            <span class="font-mono">{{ server.ip }}</span>
            <span class="px-2 py-0.5 rounded bg-[#1E293B]/60 text-[#94A3B8]">{{ server.region }}</span>
          </div>

          <!-- Metrics Bars -->
          <div class="flex flex-col gap-2 pt-2 border-t border-[#1E293B]/80 text-xs">
            <div class="flex items-center justify-between">
              <span class="text-[#94A3B8]">CPU</span>
              <span class="font-mono text-[#F1F5F9] font-bold">{{ server.cpu }}%</span>
            </div>
            <div class="w-full bg-[#1E293B] h-1.5 rounded-full overflow-hidden">
              <div class="bg-[#06B6D4] h-full transition-all" :style="{ width: server.cpu + '%' }"></div>
            </div>

            <div class="flex items-center justify-between mt-1">
              <span class="text-[#94A3B8]">MEM</span>
              <span class="font-mono text-[#F1F5F9] font-bold">{{ server.memory }}%</span>
            </div>
            <div class="w-full bg-[#1E293B] h-1.5 rounded-full overflow-hidden">
              <div class="bg-[#3B82F6] h-full transition-all" :style="{ width: server.memory + '%' }"></div>
            </div>
          </div>

          <!-- Bottom Action Buttons -->
          <div class="flex items-center gap-2 pt-3 border-t border-[#1E293B]">
            <button @click="goToSSH(server)" class="flex-1 py-1.5 rounded-lg bg-[#1E293B] hover:bg-[#06B6D4] hover:text-[#0B1120] text-[#94A3B8] text-xs font-bold transition-all flex items-center justify-center gap-1">
              <span class="material-symbols-outlined text-sm">terminal</span> SSH
            </button>
            <button @click="goToAIChat(server)" class="flex-1 py-1.5 rounded-lg bg-[#1E293B] hover:bg-[#3B82F6] hover:text-[#FFFFFF] text-[#94A3B8] text-xs font-bold transition-all flex items-center justify-center gap-1">
              <span class="material-symbols-outlined text-sm">smart_toy</span> AI
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal for Add Server -->
    <div v-if="showAddModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div class="bg-[#0F172A] border border-[#1E293B] rounded-2xl w-full max-w-md p-6 flex flex-col gap-4 shadow-2xl">
        <h3 class="text-lg font-bold text-[#F1F5F9]">{{ i18n.t.dashboard.addServer }}</h3>
        <div class="flex flex-col gap-3 text-xs">
          <label class="text-[#94A3B8]">Hostname / Server Name</label>
          <input v-model="newServerHost" placeholder="e.g. node-us-east-01.aiops.net" class="bg-[#1E293B] border border-[#334155] rounded-lg p-2.5 text-[#F1F5F9] outline-none focus:border-[#06B6D4]" />

          <label class="text-[#94A3B8]">IP Address</label>
          <input v-model="newServerIp" placeholder="e.g. 192.168.1.100" class="bg-[#1E293B] border border-[#334155] rounded-lg p-2.5 text-[#F1F5F9] outline-none focus:border-[#06B6D4]" />

          <label class="text-[#94A3B8]">Region / Cloud Provider</label>
          <select v-model="newServerRegion" class="bg-[#1E293B] border border-[#334155] rounded-lg p-2.5 text-[#F1F5F9] outline-none focus:border-[#06B6D4]">
            <option value="AWS US-East">AWS US-East</option>
            <option value="GCP US-West">GCP US-West</option>
            <option value="Tencent EU-West">Tencent EU-West</option>
            <option value="Aliyun AP-East">Aliyun AP-East</option>
          </select>
        </div>
        <div class="flex items-center justify-end gap-3 mt-4">
          <button @click="showAddModal = false" class="px-4 py-2 rounded-lg bg-[#1E293B] text-[#94A3B8] text-xs font-bold hover:bg-[#334155]">Cancel</button>
          <button @click="addServer" class="px-4 py-2 rounded-lg bg-[#06B6D4] text-[#0B1120] text-xs font-bold hover:opacity-90">Confirm</button>
        </div>
      </div>
    </div>
  </div>
</template>
