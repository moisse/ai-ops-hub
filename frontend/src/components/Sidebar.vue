<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const navItems = [
  { icon: 'dashboard', label: 'Dashboard', page: '/dashboard' },
  { icon: 'chat', label: 'AI Chat', page: '/chat' },
  { icon: 'terminal', label: 'Terminal', page: '/terminal' },
  { icon: 'verified_user', label: 'Certificates', page: '/certificates' },
  { icon: 'settings', label: 'Settings', page: '/settings' },
]

function navigateTo(path: string) {
  router.push(path)
}

function isActive(path: string) {
  return route.path === path
}
</script>

<template>
  <aside class="hidden md:flex flex-col h-screen w-[240px] overflow-y-auto fixed left-0 top-0 bg-[#0F172A] border-r border-[#1E293B] z-50">
    <!-- Logo -->
    <div class="px-4 py-6 flex flex-col gap-2">
      <h1 class="text-[20px] font-bold text-[#06B6D4] flex items-center gap-2">
        <span class="material-symbols-outlined">smart_toy</span> AI Ops Hub
      </h1>
      <p class="text-[13px] text-[#64748B]">Mission Control</p>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 px-2 py-2 flex flex-col gap-1">
      <button
        v-for="item in navItems"
        :key="item.label"
        @click="navigateTo(item.page)"
        :class="[
          'flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all cursor-pointer w-full text-left',
          isActive(item.page)
            ? 'bg-[rgba(6,182,212,0.1)] text-[#06B6D4] border-l-[3px] border-[#06B6D4]'
            : 'text-[#94A3B8] hover:bg-[rgba(255,255,255,0.03)] hover:text-[#F1F5F9]'
        ]"
      >
        <span class="material-symbols-outlined text-[20px]">{{ item.icon }}</span>
        <span class="text-[14px] font-medium">{{ item.label }}</span>
      </button>
    </nav>

    <!-- Bottom Status -->
    <div class="px-4 py-4 border-t border-[#1E293B] mt-auto">
      <div class="bg-[#1E293B] rounded-lg p-3 flex items-center justify-between mb-3 border border-[#334155]">
        <span class="text-[11px] font-bold text-[#10B981] uppercase tracking-wide">Server Health: Optimal</span>
        <div class="w-2 h-2 rounded-full bg-[#10B981]"></div>
      </div>
      <button @click="navigateTo('/dashboard')" class="flex items-center gap-3 px-4 py-2.5 text-[#94A3B8] hover:bg-[rgba(255,255,255,0.03)] hover:text-[#F1F5F9] transition-all cursor-pointer rounded-lg w-full text-left">
        <span class="material-symbols-outlined text-[20px]">analytics</span>
        <span class="text-[14px]">System Overview</span>
      </button>
    </div>
  </aside>
</template>
