<script setup lang="ts">
import { ref } from 'vue'

const certificates = ref([
  {
    id: 1,
    name: 'SSH Key (GCP-US-West)',
    type: 'SSH Key',
    server: 'Server 01',
    expiryDate: '-',
    daysRemaining: null,
    status: 'normal',
  },
  {
    id: 2,
    name: 'SSL (*.example.com)',
    type: 'SSL Certificate',
    server: 'Prod-01',
    expiryDate: '2026-06-30',
    daysRemaining: -36,
    status: 'expired',
  },
  {
    id: 3,
    name: 'Domain (example.com)',
    type: 'Domain',
    server: 'Prod-01',
    expiryDate: '2027-03-15',
    daysRemaining: 222,
    status: 'normal',
  },
  {
    id: 4,
    name: 'SSL (api.example.com)',
    type: 'SSL Certificate',
    server: 'Prod-02',
    expiryDate: '2026-09-15',
    daysRemaining: 41,
    status: 'warning',
  },
])

const filterType = ref('all')
const filterStatus = ref('all')
const filterServer = ref('all')
</script>

<template>
  <div class="p-6">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-[24px] font-bold text-[#F1F5F9] flex items-center gap-2">
        <span class="material-symbols-outlined text-[#06B6D4]">key</span>
        Certificates & Keys
      </h1>
      <div class="flex gap-2">
        <button class="btn-secondary flex items-center gap-2">
          <span class="material-symbols-outlined text-[16px]">refresh</span>
          Scan
        </button>
        <button class="btn-secondary flex items-center gap-2">
          <span class="material-symbols-outlined text-[16px]">settings</span>
          Settings
        </button>
      </div>
    </div>

    <!-- Filters -->
    <div class="flex gap-3 mb-4">
      <select v-model="filterType" class="bg-[#1E293B] border border-[#334155] rounded-lg px-3 py-2 text-[13px] text-[#F1F5F9] focus:outline-none focus:border-[#06B6D4]">
        <option value="all">All Types</option>
        <option value="ssh">SSH Keys</option>
        <option value="ssl">SSL Certificates</option>
        <option value="domain">Domains</option>
      </select>
      <select v-model="filterStatus" class="bg-[#1E293B] border border-[#334155] rounded-lg px-3 py-2 text-[13px] text-[#F1F5F9] focus:outline-none focus:border-[#06B6D4]">
        <option value="all">All Status</option>
        <option value="normal">Normal</option>
        <option value="warning">Expiring Soon</option>
        <option value="expired">Expired</option>
      </select>
      <select v-model="filterServer" class="bg-[#1E293B] border border-[#334155] rounded-lg px-3 py-2 text-[13px] text-[#F1F5F9] focus:outline-none focus:border-[#06B6D4]">
        <option value="all">All Servers</option>
        <option value="server-01">Server 01</option>
        <option value="server-02">Server 02</option>
      </select>
      <div class="flex-1">
        <input
          type="text"
          placeholder="Search certificates..."
          class="w-full bg-[#1E293B] border border-[#334155] rounded-lg px-3 py-2 text-[13px] text-[#F1F5F9] placeholder-[#64748B] focus:outline-none focus:border-[#06B6D4]"
        />
      </div>
    </div>

    <!-- Table -->
    <div class="bg-[#111827] border border-[#1E293B] rounded-xl overflow-hidden">
      <table class="w-full">
        <thead>
          <tr class="bg-[#1E293B] border-b border-[#334155]">
            <th class="text-left px-4 py-3 text-[12px] font-bold text-[#94A3B8] uppercase">Name</th>
            <th class="text-left px-4 py-3 text-[12px] font-bold text-[#94A3B8] uppercase">Type</th>
            <th class="text-left px-4 py-3 text-[12px] font-bold text-[#94A3B8] uppercase">Server</th>
            <th class="text-left px-4 py-3 text-[12px] font-bold text-[#94A3B8] uppercase">Expiry Date</th>
            <th class="text-left px-4 py-3 text-[12px] font-bold text-[#94A3B8] uppercase">Days Left</th>
            <th class="text-left px-4 py-3 text-[12px] font-bold text-[#94A3B8] uppercase">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="cert in certificates"
            :key="cert.id"
            class="border-b border-[#1E293B] hover:bg-[rgba(255,255,255,0.02)] transition-colors"
          >
            <td class="px-4 py-3 text-[13px] text-[#F1F5F9]">{{ cert.name }}</td>
            <td class="px-4 py-3 text-[13px] text-[#94A3B8]">{{ cert.type }}</td>
            <td class="px-4 py-3 text-[13px] text-[#94A3B8]">{{ cert.server }}</td>
            <td class="px-4 py-3 text-[13px] font-mono text-[#94A3B8]">{{ cert.expiryDate }}</td>
            <td class="px-4 py-3 text-[13px] font-mono" :class="cert.daysRemaining && cert.daysRemaining < 0 ? 'text-[#EF4444]' : cert.daysRemaining && cert.daysRemaining < 30 ? 'text-[#F59E0B]' : 'text-[#94A3B8]'">
              {{ cert.daysRemaining !== null ? cert.daysRemaining + ' days' : '-' }}
            </td>
            <td class="px-4 py-3">
              <span
                :class="[
                  'inline-flex items-center px-2 py-1 rounded text-[11px] font-bold',
                  cert.status === 'normal' ? 'bg-[rgba(16,185,129,0.15)] text-[#10B981]' :
                  cert.status === 'warning' ? 'bg-[rgba(245,158,11,0.15)] text-[#F59E0B]' :
                  'bg-[rgba(239,68,68,0.15)] text-[#EF4444]'
                ]"
              >
                {{ cert.status === 'normal' ? '✅ Normal' : cert.status === 'warning' ? '⚠️ Expiring' : '🔴 Expired' }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="flex items-center justify-between mt-4 text-[13px] text-[#94A3B8]">
      <span>Total {{ certificates.length }} items</span>
      <div class="flex items-center gap-2">
        <button class="px-3 py-1 rounded border border-[#334155] hover:border-[#06B6D4] transition-colors">&lt;</button>
        <button class="px-3 py-1 rounded bg-[#06B6D4] text-white">1</button>
        <button class="px-3 py-1 rounded border border-[#334155] hover:border-[#06B6D4] transition-colors">&gt;</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
</style>
