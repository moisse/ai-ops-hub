<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ServerCard from '@/components/ServerCard.vue'
import StatCard from '@/components/StatCard.vue'
import { fetchServers, type Server } from '@/utils/api'

const stats = ref({
  total: 0,
  online: 0,
  warning: 0,
  offline: 0,
  uptime: 0,
})

const servers = ref<Server[]>([])

onMounted(async () => {
  try {
    const data = await fetchServers()
    servers.value = data
    
    // Calculate stats
    stats.value.total = data.length
    stats.value.online = data.filter(s => s.status === 'online').length
    stats.value.warning = data.filter(s => s.status === 'warning').length
    stats.value.offline = data.filter(s => s.status === 'offline').length
    stats.value.uptime = stats.value.total > 0 
      ? (stats.value.online / stats.value.total * 100) 
      : 0
  } catch (error) {
    console.error('Failed to fetch servers:', error)
    // Use mock data for demo
    servers.value = [
      { id: 1, name: 'GCP-US-West', ip: '192.168.1.100', status: 'online', cpu: 12, memory: 45, disk: 6, latency: 1 },
      { id: 2, name: 'AWS-EU-Central', ip: '192.168.1.101', status: 'online', cpu: 28, memory: 62, disk: 34, latency: 18 },
      { id: 3, name: 'Azure-HK', ip: '192.168.1.102', status: 'warning', cpu: 89, memory: 95, disk: 78, latency: 124 },
    ]
    stats.value = { total: 3, online: 2, warning: 1, offline: 0, uptime: 66.7 }
  }
})
</script>

<template>
  <div class="flex flex-col gap-6">
    <!-- Alert Banner -->
    <div v-if="stats.warning > 0 || stats.offline > 0" class="bg-[rgba(239,68,68,0.15)] border-l-[3px] border-[#EF4444] rounded-lg p-4 flex items-center gap-3">
      <span class="material-symbols-outlined text-[#EF4444] text-[20px]">warning</span>
      <span class="text-[14px] font-medium text-[#F1F5F9]">
        {{ stats.warning }} warning(s), {{ stats.offline }} offline
      </span>
      <button class="ml-auto text-[12px] text-[#06B6D4] hover:underline">View Details</button>
    </div>

    <!-- Stats Row -->
    <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
      <StatCard label="Total Servers" :value="stats.total" color="primary" />
      <StatCard label="Online" :value="stats.online" color="success" :showDot="true" />
      <StatCard label="Warning" :value="stats.warning" color="warning" :showDot="true" />
      <StatCard label="Offline" :value="stats.offline" color="error" :showDot="true" />
      <StatCard label="Uptime" :value="stats.uptime.toFixed(1) + '%'" color="primary" />
    </div>

    <!-- Servers Grid -->
    <div>
      <h3 class="text-[18px] font-bold text-[#F1F5F9] mb-4 border-b border-[#1E293B] pb-2 pl-3 border-l-[3px] border-[#06B6D4]">
        All Servers
      </h3>
      <div v-if="servers.length === 0" class="text-center py-12 text-[#64748B]">
        No servers configured. Go to Settings to add servers.
      </div>
      <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ServerCard
          v-for="server in servers"
          :key="server.id"
          :server="server"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
</style>
