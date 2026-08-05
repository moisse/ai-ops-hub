<script setup lang="ts">
import { ref } from 'vue'

const servers = ref([
  { id: 1, name: 'GCP-US-West', ip: '192.168.1.100', status: 'online' },
  { id: 2, name: 'AWS-EU-Central', ip: '192.168.1.101', status: 'online' },
  { id: 3, name: 'Azure-HK', ip: '192.168.1.102', status: 'warning' },
])

const tabs = ref([
  { id: 1, name: 'GCP-US-West', status: 'online' },
])

const activeTab = ref(1)
</script>

<template>
  <div class="flex h-[calc(100vh-56px)]">
    <!-- Left: Server List -->
    <aside class="w-[220px] bg-[#0F172A] border-r border-[#1E293B] flex flex-col">
      <div class="px-3 py-4">
        <div class="text-[12px] font-bold text-[#64748B] uppercase mb-2">Quick Connect</div>
        <button
          v-for="server in servers"
          :key="server.id"
          class="w-full h-11 px-3 rounded-lg flex items-center gap-2 hover:bg-[rgba(255,255,255,0.03)] transition-all mb-1"
        >
          <div :class="['w-1.5 h-1.5 rounded-full', server.status === 'online' ? 'bg-[#10B981]' : 'bg-[#F59E0B]']"></div>
          <div class="flex-1 text-left">
            <div class="text-[13px] text-[#F1F5F9]">{{ server.name }}</div>
            <div class="text-[11px] text-[#64748B]">{{ server.ip }}</div>
          </div>
        </button>
      </div>

      <div class="px-3 py-4 border-t border-[#1E293B]">
        <div class="text-[12px] font-bold text-[#64748B] uppercase mb-2">Favorites</div>
        <div class="text-[13px] text-[#64748B] italic">No favorites yet</div>
      </div>

      <div class="px-3 py-4 border-t border-[#1E293B]">
        <div class="text-[12px] font-bold text-[#64748B] uppercase mb-2">Recent</div>
        <div class="text-[13px] text-[#64748B] italic">No recent connections</div>
      </div>
    </aside>

    <!-- Right: Terminal Area -->
    <div class="flex-1 flex flex-col">
      <!-- Tab Bar -->
      <div class="h-9 bg-[#0F172A] border-b border-[#1E293B] flex items-center px-2 gap-1">
        <div
          v-for="tab in tabs"
          :key="tab.id"
          :class="[
            'h-8 px-3 rounded-t-lg flex items-center gap-2 cursor-pointer transition-all',
            activeTab === tab.id
              ? 'bg-[#111827] text-[#F1F5F9] border-b-2 border-[#06B6D4]'
              : 'text-[#94A3B8] hover:bg-[rgba(255,255,255,0.03)]'
          ]"
        >
          <div :class="['w-1.5 h-1.5 rounded-full', tab.status === 'online' ? 'bg-[#10B981]' : 'bg-[#F59E0B]']"></div>
          <span class="text-[13px]">{{ tab.name }}</span>
          <button class="text-[#64748B] hover:text-[#EF4444] transition-colors ml-1">
            <span class="material-symbols-outlined text-[14px]">close</span>
          </button>
        </div>
        <button class="text-[12px] text-[#06B6D4] hover:text-[#0891B2] transition-colors px-2">
          + New Connection
        </button>
      </div>

      <!-- Terminal Display -->
      <div class="flex-1 bg-black p-3 font-mono text-[14px] text-[#E2E8F0] overflow-y-auto">
        <div class="flex items-center gap-2">
          <span class="text-[#10B981]">moisse@gcp-us-west</span>
          <span class="text-[#64748B]">:</span>
          <span class="text-[#3B82F6]">~</span>
          <span class="text-[#64748B]">$</span>
          <span class="animate-pulse">_</span>
        </div>
      </div>

      <!-- Bottom Toolbar -->
      <div class="h-9 bg-[#111827] border-t border-[#1E293B] flex items-center px-3 gap-4">
        <button class="text-[12px] text-[#94A3B8] hover:text-[#06B6D4] transition-colors flex items-center gap-1">
          <span class="material-symbols-outlined text-[14px]">upload</span>
          Upload
        </button>
        <button class="text-[12px] text-[#94A3B8] hover:text-[#06B6D4] transition-colors flex items-center gap-1">
          <span class="material-symbols-outlined text-[14px]">download</span>
          Download
        </button>
        <button class="text-[12px] text-[#94A3B8] hover:text-[#06B6D4] transition-colors flex items-center gap-1 ml-auto">
          <span class="material-symbols-outlined text-[14px]">fullscreen</span>
          Fullscreen
        </button>
        <button class="text-[12px] text-[#94A3B8] hover:text-[#06B6D4] transition-colors flex items-center gap-1">
          <span class="material-symbols-outlined text-[14px]">settings</span>
          Settings
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
</style>
