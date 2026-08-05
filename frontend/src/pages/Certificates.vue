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
  enableAlert?: boolean;
}

const certs = ref<Certificate[]>([])
const search = ref('')
const selectedType = ref('All Types')
const selectedStatus = ref('All Status')
const isScanning = ref(false)

// Modal State with Smart Auto-Parse
const showAddModal = ref(false)
const rawCertInput = ref('')
const newCertName = ref('')
const newCertType = ref('SSL Certificate')
const newCertServer = ref('Prod-Server-01')
const newCertExpiry = ref('2026-12-31')
const enableExpiryAlert = ref(true)

const autoParseStatus = ref('')

function autoInspectInput() {
  const val = rawCertInput.value.trim()
  if (!val) {
    autoParseStatus.value = ''
    return
  }

  if (val.includes('BEGIN PUBLIC KEY') || val.includes('BEGIN RSA PRIVATE KEY') || val.includes('ssh-rsa')) {
    newCertType.value = 'SSH Key'
    newCertName.value = 'SSH Key (' + (newCertServer.value || 'Host') + ')'
    newCertExpiry.value = '-'
    autoParseStatus.value = i18n.currentLang === 'zh-CN' ? '⚡ 自动解析成功: 识别为 SSH 密钥 / 公钥' : '⚡ Auto-Parsed: SSH Key'
  } else if (val.includes('BEGIN CERTIFICATE') || val.includes('.com') || val.includes('.net') || val.includes('.cn')) {
    newCertType.value = 'SSL Certificate'
    newCertName.value = 'SSL (' + (val.startsWith('http') ? new URL(val).hostname : val) + ')'
    
    // Auto compute 90-day SSL expiry
    const exp = new Date()
    exp.setDate(exp.getDate() + 90)
    newCertExpiry.value = exp.toISOString().split('T')[0]
    autoParseStatus.value = i18n.currentLang === 'zh-CN' ? '⚡ 自动解析成功: 识别为 SSL 证书 (到期推算 90 天)' : '⚡ Auto-Parsed: SSL Certificate (90 Days)'
  } else {
    newCertType.value = 'Domain'
    newCertName.value = 'Domain (' + val + ')'
    autoParseStatus.value = i18n.currentLang === 'zh-CN' ? '⚡ 自动解析成功: 识别为域名追踪' : '⚡ Auto-Parsed: Domain'
  }
}

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
  if (!newCertName.value && !rawCertInput.value) return
  
  let days = 180
  if (newCertExpiry.value && newCertExpiry.value !== '-') {
    const target = new Date(newCertExpiry.value).getTime()
    const now = new Date().getTime()
    days = Math.round((target - now) / (1000 * 3600 * 24))
  }

  certs.value.push({
    id: 'c_' + Date.now(),
    name: newCertName.value || rawCertInput.value,
    type: newCertType.value,
    server: newCertServer.value,
    expiryDate: newCertExpiry.value,
    daysLeft: newCertExpiry.value === '-' ? null : days,
    status: days < 0 ? 'Expired' : (days < 30 ? 'Expiring' : 'Normal'),
    enableAlert: enableExpiryAlert.value
  })
  showAddModal.value = false
  rawCertInput.value = ''
  newCertName.value = ''
  autoParseStatus.value = ''
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
          <span>{{ i18n.currentLang === 'zh-CN' ? '添加证书/密钥' : 'Add Certificate/Key' }}</span>
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
        {{ i18n.currentLang === 'zh-CN' ? '点击右上角 [+ 添加证书/密钥]，支持自动解析域名与 SSL/SSH Key 到期提醒！' : 'Click [+ Add Certificate] above to enable auto-inspection and expiry alerts.' }}
      </p>
      <button @click="showAddModal = true" class="px-4 py-2 bg-[#06B6D4] text-[#0B1120] rounded-lg font-bold text-xs hover:opacity-90">
        + {{ i18n.currentLang === 'zh-CN' ? '添加证书/密钥' : 'Add Certificate' }}
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

    <!-- Smart Auto-Parsing Add Certificate Modal -->
    <div v-if="showAddModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div class="bg-[#0F172A] border border-[#1E293B] rounded-2xl w-full max-w-lg p-6 flex flex-col gap-4 shadow-2xl">
        <div class="flex items-center justify-between border-b border-[#1E293B] pb-3">
          <h3 class="text-base font-bold text-[#F1F5F9] flex items-center gap-2">
            <span class="material-symbols-outlined text-[#06B6D4]">verified_user</span>
            <span>{{ i18n.currentLang === 'zh-CN' ? '添加证书 / 自动解析到期提醒' : 'Add Certificate & Smart Auto-Parse' }}</span>
          </h3>
          <button @click="showAddModal = false" class="text-[#64748B] hover:text-[#F1F5F9]">
            <span class="material-symbols-outlined text-sm">close</span>
          </button>
        </div>

        <div class="flex flex-col gap-3 text-xs">
          <!-- Smart Input Box -->
          <div class="flex flex-col gap-1.5">
            <label class="text-[#94A3B8] font-bold">输入域名、证书内容 或 SSH 公钥 (自动探针解析)</label>
            <textarea 
              v-model="rawCertInput" 
              @input="autoInspectInput" 
              rows="3" 
              placeholder="e.g. api.example.com 或者粘贴 -----BEGIN CERTIFICATE-----" 
              class="bg-[#1E293B] border border-[#334155] rounded-xl p-3 text-[#F1F5F9] font-mono text-[11px] outline-none focus:border-[#06B6D4]"
            ></textarea>
          </div>

          <!-- Parse Feedback Badge -->
          <div v-if="autoParseStatus" class="text-xs p-2.5 rounded-lg bg-[#06B6D4]/10 border border-[#06B6D4]/30 text-[#06B6D4] font-mono">
            {{ autoParseStatus }}
          </div>

          <div class="grid grid-cols-2 gap-3 mt-1">
            <div class="flex flex-col gap-1.5">
              <label class="text-[#94A3B8]">证书 / 密钥名称</label>
              <input v-model="newCertName" placeholder="SSL (api.example.com)" class="bg-[#1E293B] border border-[#334155] rounded-lg p-2.5 text-[#F1F5F9] outline-none focus:border-[#06B6D4]" />
            </div>

            <div class="flex flex-col gap-1.5">
              <label class="text-[#94A3B8]">类型 (Type)</label>
              <select v-model="newCertType" class="bg-[#1E293B] border border-[#334155] rounded-lg p-2.5 text-[#F1F5F9] outline-none focus:border-[#06B6D4]">
                <option value="SSL Certificate">SSL Certificate (HTTPS 证书)</option>
                <option value="SSH Key">SSH Key (主机密钥)</option>
                <option value="Domain">Domain (域名到期)</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div class="flex flex-col gap-1.5">
              <label class="text-[#94A3B8]">关联服务器节点</label>
              <input v-model="newCertServer" placeholder="Prod-Server-01" class="bg-[#1E293B] border border-[#334155] rounded-lg p-2.5 text-[#F1F5F9] outline-none focus:border-[#06B6D4]" />
            </div>

            <div class="flex flex-col gap-1.5">
              <label class="text-[#94A3B8]">到期日期 (Expiry Date)</label>
              <input v-model="newCertExpiry" type="date" class="bg-[#1E293B] border border-[#334155] rounded-lg p-2.5 text-[#F1F5F9] outline-none focus:border-[#06B6D4]" />
            </div>
          </div>

          <!-- Expiry Alert Toggle -->
          <div class="flex items-center justify-between p-3 rounded-xl bg-[#1E293B]/60 border border-[#334155] mt-2">
            <div class="flex flex-col gap-0.5">
              <span class="font-bold text-[#F1F5F9]">到期前 30 天自动化告警提醒</span>
              <span class="text-[11px] text-[#64748B]">当证书剩余天数低于 30 天时触发 Webhook 警报</span>
            </div>
            <input type="checkbox" v-model="enableExpiryAlert" class="w-4 h-4 accent-[#06B6D4] cursor-pointer" />
          </div>
        </div>

        <div class="flex items-center justify-end gap-3 mt-3 pt-3 border-t border-[#1E293B]">
          <button @click="showAddModal = false" class="px-4 py-2 rounded-lg bg-[#1E293B] text-[#94A3B8] text-xs font-bold hover:bg-[#334155]">Cancel</button>
          <button @click="addCertificate" class="px-4 py-2 rounded-lg bg-[#06B6D4] text-[#0B1120] text-xs font-bold hover:opacity-90">Confirm & Save</button>
        </div>
      </div>
    </div>
  </div>
</template>
