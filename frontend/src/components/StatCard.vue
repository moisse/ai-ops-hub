<script setup lang="ts">
interface StatCardProps {
  label: string
  value: string | number
  color: 'primary' | 'success' | 'warning' | 'error'
  showDot?: boolean
}

const props = defineProps<StatCardProps>()

const colorMap = {
  primary: '#06B6D4',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
}
</script>

<template>
  <div class="card card-hover flex flex-col gap-2">
    <span class="text-[11px] font-bold uppercase tracking-wide text-[#94A3B8]">
      {{ label }}
    </span>
    <div class="flex items-center gap-2">
      <span
        class="text-[30px] font-bold"
        :style="{ color: colorMap[color] }"
      >
        {{ value }}
      </span>
      <div
        v-if="showDot"
        class="w-2 h-2 rounded-full"
        :style="{ backgroundColor: colorMap[color] }"
      ></div>
    </div>
  </div>
</template>
