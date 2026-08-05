<script setup lang="ts">
import { ref } from 'vue'
import ServerCard from '@/components/ServerCard.vue'
import StatCard from '@/components/StatCard.vue'

// Mock data - 使用占位符，不暴露真实信息
const stats = ref({
  total: 8,
  online: 6,
  warning: 1,
  offline: 1,
  uptime: 99.2,
})

const proxyNodes = ref([
  {
    id: 1,
    name: 'GCP-US-West',
    ip: '192.168.1.100',
    status: 'online',
    latency: 1,
    cpu: 12,
    memory: 45,
    disk: 6,
  },
  {
    id: 2,
    name: 'AWS-EU-Central',
    ip: '192.168.1.101',
    status: 'online',
    latency: 18,
    cpu: 28,
    memory: 62,
    disk: 34,
  },
  {
    id: 3,
    name: 'Azure-HK',
    ip: '192.168.1.102',
    status: 'warning',
    latency: 124,
    cpu: 89,
    memory: 95,
    disk: 78,
  },
])

const aiInfrastructure = ref([
  {
    id: 4,
    name: 'GPU Cluster 01',
    type: 'NVIDIA A100 x8',
    status: 'online',
    metric: '98% UTIL',
  },
  {
    id: 5,
    name: 'Inference Node',
    type: 'LLM-Gateway',
    status: 'offline',
    metric: 'OFFLINE',
  },
  {
    id: 6,
    name: 'Training Rig Alpha',
    type: 'Epoch 45/100',
    status: 'online',
    metric: '48%',
  },
  {
    id: 7,
    name: 'Vector DB',
    type: 'QPS: 12.4k',
    status: 'online',
    metric: 'STABLE',
  },
])
</script>

<template>
  <div class="flex flex-col gap-6">
    <!-- Alert Banner -->
    <div class="bg-[rgba(239,68,68,0.15)] border-l-[3px] border-[#EF4444] rounded-lg p-4 flex items-center gap-3">
      <span class="material-symbols-outlined text-[#EF4444] text-[20px]">warning</span>
      <span class="text-[14px] font-medium text-[#F1F5F9]">2 certificates expiring soon, 1 server offline</span>
      <button class="ml-auto text-[12px] text-[#06B6D4] hover:underline">View Details</button>
    </div>

    <!-- Stats Row -->
    <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
      <StatCard label="Total Servers" :value="stats.total" color="primary" />
      <StatCard label="Online" :value="stats.online" color="success" :showDot="true" />
      <StatCard label="Warning" :value="stats.warning" color="warning" :showDot="true" />
      <StatCard label="Offline" :value="stats.offline" color="error" :showDot="true" />
      <StatCard label="Uptime" :value="stats.uptime + '%'" color="primary" />
    </div>

    <!-- Proxy Nodes -->
    <div>
      <h3 class="text-[18px] font-bold text-[#F1F5F9] mb-4 border-b border-[#1E293B] pb-2 pl-3 border-l-[3px] border-[#06B6D4]">
        Proxy Nodes
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ServerCard
          v-for="node in proxyNodes"
          :key="node.id"
          :server="node"
        />
      </div>
    </div>

    <!-- AI Infrastructure -->
    <div>
      <h3 class="text-[18px] font-bold text-[#F1F5F9] mb-4 border-b border-[#1E293B] pb-2 pl-3 border-l-[3px] border-[#06B6D4]">
        AI Infrastructure
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          v-for="node in aiInfrastructure"
          :key="node.id"
          class="card card-hover flex flex-col gap-4"
        >
          <div class="flex justify-between items-start">
            <div class="flex items-center gap-2">
              <div :class="['status-dot', `status-dot-${node.status}`]"></div>
              <span class="text-[14px] font-semibold text-[#F1F5F9]">{{ node.name }}</span>
            </div>
            <span class="material-symbols-outlined text-[#06B6D4] text-[16px]">memory</span>
          </div>
          <div class="flex flex-col gap-2">
            <div class="flex justify-between text-[13px] font-mono text-[#94A3B8]">
              <span>{{ node.type }}</span>
              <span :class="node.status === 'offline' ? 'text-[#EF4444]' : 'text-[#10B981]'">
                {{ node.metric }}
              </span>
            </div>
          </div>
          <div class="flex gap-2 mt-auto pt-2">
            <button
              :class="[
                'w-full py-2 rounded-lg text-[11px] font-bold uppercase tracking-wide transition-all',
                node.status === 'offline'
                  ? 'bg-[rgba(239,68,68,0.1)] border border-[#EF4444] text-[#EF4444] hover:bg-[rgba(239,68,68,0.2)]'
                  : 'bg-[rgba(6,182,212,0.1)] border border-[#06B6D4] text-[#06B6D4] hover:bg-[rgba(6,182,212,0.2)]'
              ]"
            >
              {{ node.status === 'offline' ? 'RESTART' : 'AI OPS' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
</style>
