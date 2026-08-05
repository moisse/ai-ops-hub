<script setup lang="ts">
interface Server {
  id: number
  name: string
  ip: string
  status: 'online' | 'warning' | 'offline'
  latency: number
  cpu: number
  memory: number
  disk: number
}

const props = defineProps<{
  server: Server
}>()

function getProgressColor(value: number): string {
  if (value < 60) return 'bg-[#10B981]'
  if (value < 80) return 'bg-[#F59E0B]'
  return 'bg-[#EF4444]'
}

function getLatencyColor(latency: number): string {
  if (latency < 50) return 'text-[#10B981]'
  if (latency < 200) return 'text-[#F59E0B]'
  return 'text-[#EF4444]'
}
</script>

<template>
  <div class="card card-hover flex flex-col gap-4 relative overflow-hidden">
    <!-- Header -->
    <div class="flex justify-between items-start">
      <div class="flex items-center gap-2">
        <div :class="['status-dot', `status-dot-${server.status}`]"></div>
        <span class="text-[14px] font-semibold text-[#F1F5F9]">{{ server.name }}</span>
      </div>
      <span
        class="bg-[#1E293B] px-2 py-1 rounded text-[11px] font-mono border border-[#334155]"
        :class="getLatencyColor(server.latency)"
      >
        {{ server.latency }}ms
      </span>
    </div>

    <!-- Resource Bars -->
    <div class="flex flex-col gap-3">
      <!-- CPU -->
      <div class="flex flex-col gap-1">
        <div class="flex justify-between text-[11px] font-bold uppercase tracking-wide text-[#94A3B8]">
          <span>CPU</span>
          <span>{{ server.cpu }}%</span>
        </div>
        <div class="w-full bg-[#1E293B] rounded-full h-1.5 overflow-hidden">
          <div
            class="h-1.5 rounded-full transition-all duration-500"
            :class="getProgressColor(server.cpu)"
            :style="{ width: server.cpu + '%' }"
          ></div>
        </div>
      </div>

      <!-- Memory -->
      <div class="flex flex-col gap-1">
        <div class="flex justify-between text-[11px] font-bold uppercase tracking-wide text-[#94A3B8]">
          <span>MEM</span>
          <span>{{ server.memory }}%</span>
        </div>
        <div class="w-full bg-[#1E293B] rounded-full h-1.5 overflow-hidden">
          <div
            class="h-1.5 rounded-full transition-all duration-500"
            :class="getProgressColor(server.memory)"
            :style="{ width: server.memory + '%' }"
          ></div>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex gap-2 mt-2">
      <button class="flex-1 bg-[#1E293B] border border-[#334155] hover:border-[#06B6D4] text-[#94A3B8] hover:text-[#06B6D4] text-[11px] font-bold uppercase tracking-wide py-2 rounded-lg transition-all">
        Details
      </button>
      <button class="flex-1 bg-[#1E293B] border border-[#334155] hover:border-[#06B6D4] text-[#94A3B8] hover:text-[#06B6D4] text-[11px] font-bold uppercase tracking-wide py-2 rounded-lg transition-all">
        SSH
      </button>
    </div>
  </div>
</template>
