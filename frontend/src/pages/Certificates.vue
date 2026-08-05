<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18nStore } from '../stores/useI18nStore'

const i18n = useI18nStore()

interface Certificate {
  id: string;
  name: string;
  type: string;
  server: string;
  expiryDate: string;
  daysLeft: number | null;
  status: string;
}

const certs = ref<Certificate[]>([])
const search = ref('')
const selectedType = ref('All Types')
const selectedStatus = ref('All Status')
const isScanning = ref(false)

// Modal State
const showAddModal = ref(false)
const newCertName = ref('')
const newCertType = ref('SSL Certificate')
const newCertServer = ref('Prod-Server-01')
const newCertExpiry = ref('2026-12-31')

async function loadCerts() {
  try {
    const res = await fetch('/api/certificates')
    if (res.ok) {
      certs.value = await res.json()
    }
  } catch (e) {
    console.warn('API certs fallback')
  }
}

const filteredCerts = computed(() => {
  return certs.value.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.value.toLowerCase()) || c.server.toLowerCase().includes(search.value.toLowerCase())
    const matchType = selectedType.value === 'All Types' || c.type === selectedType.value
    const matchStatus = selectedStatus.value === 'All Status' || c.status === selectedStatus.value
    return matchSearch && matchType && matchStatus
  })
})

function triggerScan() {
  isScanning.value = true
  setTimeout(() => {
    isScanning.value = false
  }, 1200)
}

function addCertificate() {
  if (!newCertName.value) return
  certs.value.push({
    id: 'c_' + Date.now(),
    name: newCertName.value,
    type: newCertType.value,
    server: newCertServer.value,
    expiryDate: newCertExpiry.value,
    daysLeft: 180,
    status: 'Normal'
  })
  showAddModal.value = false
  newCertName.value = ''
}

function deleteCert(id: string) {
  certs.value = certs.value.filter(c => c.id !== id)
}

onMounted(() => {
  loadCerts()
})
</script>

<template>
  <div class="p-6 flex flex-col gap-6 max-w-7xl mx-auto w-full">
    <!-- Title Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1E293B] pb-4">
      <div>
        <h1 class="text-2xl font-bold text-[#F1F5F9]">{{ i18n.t.certificates.title }}</h1>
        <p class="text-xs text-[#94A3B8] mt-1">{{ i18n.t.certificates.subtitle }}</p>
      </div>
      <div class="flex items-center gap-3">
        <button 
          @click="showAddModal = true"
          class="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#06B6D4] text-[#0B1120] font-bold text-xs hover:opacity-90 transition-all cursor-pointer shadow-lg shadow-[#06B6D4]/20"
        >
          <span class="material-symbols-outlined text-sm">add</span>
          <span>{{ i18n.currentLang === 'zh-CN' ? '添加证书/密钥防护' : 'Add Certificate/Key' }}</span>
        </button>

        <button 
          @click="triggerScan" 
          :disabled="isScanning"
          class="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#1E293B] border border-[#334155] text-[#06B6D4] font-bold text-xs hover:border-[#06B6D4] transition-all cursor-pointer disabled:opacity-50"
        >
          <span :class="['material-symbols-outlined text-sm', isScanning ? 'animate-spin' : '']">sync</span>
          <span>{{ isScanning ? (i18n.currentLang === 'zh-CN' ? '正在扫描...' : 'Scanning...') : i18n.t.certificates.scan }}</span>
        </button>
      </div>
    </div>

    <!-- Filters Row -->
    <div class="flex flex-col md:flex-row items-center gap-3">
      <div class="relative flex-1 w-full">
        <span class="material-symbols-outlined absolute left-3 top-2.5 text-[#64748B] text-sm">search</span>
        <input 
          v-model="search" 
          :placeholder="i18n.t.certificates.searchPlaceholder" 
          class="w-full bg-[#0F172A] border border-[#1E293B] rounded-lg pl-9 pr-4 py-2 text-xs text-[#F1F5F9] outline-none focus:border-[#06B6D4]" 
        />
      </div>
      <select v-model="selectedType" class="bg-[#0F172A] border border-[#1E293B] rounded-lg px-3 py-2 text-xs text-[#F1F5F9] outline-none focus:border-[#06B6D4]">
        <option value="All Types">{{ i18n.t.certificates.allTypes }}</option>
        <option value="SSH Key">SSH Key</option>
        <option value="SSL Certificate">SSL Certificate</option>
        <option value="Domain">Domain</option>
      </select>
      <select v-model="selectedStatus" class="bg-[#0F172A] border border-[#1E293B] rounded-lg px-3 py-2 text-xs text-[#F1F5F9] outline-none focus:border-[#06B6D4]">
        <option value="All Status">{{ i18n.t.certificates.allStatus }}</option>
        <option value="Normal">Normal</option>
        <option value="Expiring">Expiring</option>
        <option value="Expired">Expired</option>
      </select>
    </div>

    <!-- Pure Empty State -->
    <div v-if="filteredCerts.length === 0" class="bg-[#0F172A] border border-dashed border-[#1E293B] rounded-2xl p-12 flex flex-col items-center justify-center text-center gap-3">
      <span class="material-symbols-outlined text-3xl text-[#06B6D4]">verified_user</span>
      <h3 class="text-sm font-bold text-[#F1F5F9]">
        {{ i18n.currentLang === 'zh-CN' ? '系统暂无关联防护证书/密钥' : 'No Certificates Managed' }}
      </h3>
      <p class="text-xs text-[#94A3B8]">
        {{ i18n.currentLang === 'zh-CN' ? '系统已准备就绪，点击右上角 [+ 添加证书/密钥防护] 开始追踪到期提醒！' : 'Click [+ Add Certificate/Key] above to track expiry alerts.' }}
      </p>
      <button @click="showAddModal = true" class="px-4 py-2 bg-[#06B6D4] text-[#0B1120] rounded-lg font-bold text-xs hover:opacity-90">
        + {{ i18n.currentLang === 'zh-CN' ? '添加证书/密钥防护' : 'Add Certificate' }}
      </button>
    </div>

    <!-- Table -->
    <div v-else class="bg-[#0F172A] border border-[#1E293B] rounded-xl overflow-hidden shadow-lg">
      <table class="w-full text-left text-xs border-collapse">
        <thead class="bg-[#1E293B]/60 text-[#94A3B8] font-bold border-b border-[#1E293B]">
          <tr>
            <th class="p-4">{{ i18n.t.certificates.name }}</th>
            <th class="p-4">{{ i18n.t.certificates.type }}</th>
            <th class="p-4">{{ i18n.t.certificates.server }}</th>
            <th class="p-4">{{ i18n.t.certificates.expiryDate }}</th>
            <th class="p-4">{{ i18n.t.certificates.daysLeft }}</th>
            <th class="p-4">{{ i18n.t.certificates.status }}</th>
            <th class="p-4 text-right">操作</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-[#1E293B]">
          <tr v-for="c in filteredCerts" :key="c.id" class="hover:bg-[#1E293B]/40 transition-colors">
            <td class="p-4 font-bold text-[#F1F5F9]">{{ c.name }}</td>
            <td class="p-4 text-[#94A3B8]">{{ c.type }}</td>
            <td class="p-4 font-mono text-[#06B6D4]">{{ c.server }}</td>
            <td class="p-4 font-mono text-[#94A3B8]">{{ c.expiryDate }}</td>
            <td class="p-4 font-mono font-bold">
              <span v-if="c.daysLeft === null || c.daysLeft === undefined" class="text-[#64748B]">-</span>
              <span v-else-if="c.daysLeft < 0" class="text-[#EF4444]">{{ c.daysLeft }} {{ i18n.currentLang === 'zh-CN' ? '天' : 'days' }}</span>
              <span v-else-if="c.daysLeft < 60" class="text-[#F59E0B]">{{ c.daysLeft }} {{ i18n.currentLang === 'zh-CN' ? '天' : 'days' }}</span>
              <span v-else class="text-[#10B981]">{{ c.daysLeft }} {{ i18n.currentLang === 'zh-CN' ? '天' : 'days' }}</span>
            </td>
            <td class="p-4">
              <span 
                :class="[
                  'px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider',
                  c.status === 'Normal' ? 'bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30' : 
                  (c.status === 'Expiring' ? 'bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/30' : 'bg-[#EF4444]/15 text-[#EF4444] border border-[#EF4444]/30')
                ]"
              >
                {{ c.status }}
              </span>
            </td>
            <td class="p-4 text-right">
              <button @click="deleteCert(c.id)" class="text-[#64748B] hover:text-[#EF4444] transition-colors" title="删除证书">
                <span class="material-symbols-outlined text-sm">delete</span>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add Certificate Modal -->
    <div v-if="showAddModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div class="bg-[#0F172A] border border-[#1E293B] rounded-2xl w-full max-w-md p-6 flex flex-col gap-4 shadow-2xl">
        <h3 class="text-base font-bold text-[#F1F5F9] border-b border-[#1E293B] pb-3">
          {{ i18n.currentLang === 'zh-CN' ? '添加证书 / SSH 密钥防护' : 'Add Certificate/Key Tracker' }}
        </h3>
        <div class="flex flex-col gap-3 text-xs">
          <label class="text-[#94A3B8]">证书 / 密钥名称</label>
          <input v-model="newCertName" placeholder="e.g. SSL (*.aiops.net)" class="bg-[#1E293B] border border-[#334155] rounded-lg p-2.5 text-[#F1F5F9] outline-none focus:border-[#06B6D4]" />

          <label class="text-[#94A3B8]">防护类型</label>
          <select v-model="newCertType" class="bg-[#1E293B] border border-[#334155] rounded-lg p-2.5 text-[#F1F5F9] outline-none focus:border-[#06B6D4]">
            <option value="SSL Certificate">SSL Certificate (HTTPS 证书)</option>
            <option value="SSH Key">SSH Key (主机公钥)</option>
            <option value="Domain">Domain (域名到期)</option>
          </select>

          <label class="text-[#94A3B8]">关联服务器 / 节点</label>
          <input v-model="newCertServer" placeholder="Prod-Server-01" class="bg-[#1E293B] border border-[#334155] rounded-lg p-2.5 text-[#F1F5F9] outline-none focus:border-[#06B6D4]" />

          <label class="text-[#94A3B8]">到期时间 (Expiry Date)</label>
          <input v-model="newCertExpiry" type="date" class="bg-[#1E293B] border border-[#334155] rounded-lg p-2.5 text-[#F1F5F9] outline-none focus:border-[#06B6D4]" />
        </div>
        <div class="flex items-center justify-end gap-3 mt-4 pt-3 border-t border-[#1E293B]">
          <button @click="showAddModal = false" class="px-4 py-2 rounded-lg bg-[#1E293B] text-[#94A3B8] text-xs font-bold hover:bg-[#334155]">Cancel</button>
          <button @click="addCertificate" class="px-4 py-2 rounded-lg bg-[#06B6D4] text-[#0B1120] text-xs font-bold hover:opacity-90">Confirm</button>
        </div>
      </div>
    </div>
  </div>
</template>
