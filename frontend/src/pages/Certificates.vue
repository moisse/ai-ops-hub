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

async function loadCerts() {
  try {
    const res = await fetch('/api/certificates')
    if (res.ok) {
      certs.value = await res.json()
    }
  } catch (e) {
    console.warn('API certs fallback')
  }

  if (certs.value.length === 0) {
    certs.value = [
      { id: 'c1', name: 'SSH Key (GCP-US-West)', type: 'SSH Key', server: 'Server 01', expiryDate: '-', daysLeft: null, status: 'Normal' },
      { id: 'c2', name: 'SSL (*.example.com)', type: 'SSL Certificate', server: 'Prod-01', expiryDate: '2026-06-30', daysLeft: -36, status: 'Expired' },
      { id: 'c3', name: 'Domain (example.com)', type: 'Domain', server: 'Prod-01', expiryDate: '2027-03-15', daysLeft: 222, status: 'Normal' },
      { id: 'c4', name: 'SSL (api.example.com)', type: 'SSL Certificate', server: 'Prod-02', expiryDate: '2026-09-15', daysLeft: 41, status: 'Expiring' }
    ]
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
      <button 
        @click="triggerScan" 
        :disabled="isScanning"
        class="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#06B6D4] text-[#0B1120] font-bold text-xs hover:opacity-90 transition-all cursor-pointer shadow-lg shadow-[#06B6D4]/20 disabled:opacity-50"
      >
        <span :class="['material-symbols-outlined text-sm', isScanning ? 'animate-spin' : '']">sync</span>
        <span>{{ isScanning ? (i18n.currentLang === 'zh-CN' ? '正在扫描...' : 'Scanning...') : i18n.t.certificates.scan }}</span>
      </button>
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

    <!-- Table -->
    <div class="bg-[#0F172A] border border-[#1E293B] rounded-xl overflow-hidden shadow-lg">
      <table class="w-full text-left text-xs border-collapse">
        <thead class="bg-[#1E293B]/60 text-[#94A3B8] font-bold border-b border-[#1E293B]">
          <tr>
            <th class="p-4">{{ i18n.t.certificates.name }}</th>
            <th class="p-4">{{ i18n.t.certificates.type }}</th>
            <th class="p-4">{{ i18n.t.certificates.server }}</th>
            <th class="p-4">{{ i18n.t.certificates.expiryDate }}</th>
            <th class="p-4">{{ i18n.t.certificates.daysLeft }}</th>
            <th class="p-4">{{ i18n.t.certificates.status }}</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-[#1E293B]">
          <tr v-for="c in filteredCerts" :key="c.id" class="hover:bg-[#1E293B]/40 transition-colors">
            <td class="p-4 font-bold text-[#F1F5F9]">{{ c.name }}</td>
            <td class="p-4 text-[#94A3B8]">{{ c.type }}</td>
            <td class="p-4 font-mono text-[#06B6D4]">{{ c.server }}</td>
            <td class="p-4 font-mono text-[#94A3B8]">{{ c.expiryDate }}</td>
            <td class="p-4 font-mono font-bold">
              <span v-if="c.daysLeft === null" class="text-[#64748B]">-</span>
              <span v-else-if="c.daysLeft < 0" class="text-[#EF4444]">{{ c.daysLeft }}d</span>
              <span v-else-if="c.daysLeft < 60" class="text-[#F59E0B]">{{ c.daysLeft }}d</span>
              <span v-else class="text-[#10B981]">{{ c.daysLeft }}d</span>
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
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
