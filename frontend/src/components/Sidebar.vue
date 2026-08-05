<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18nStore } from '../stores/useI18nStore'

const router = useRouter()
const route = useRoute()
const i18n = useI18nStore()

const navItems = computed(() => [
  { icon: 'dashboard', label: i18n.t.nav.dashboard, page: '/dashboard' },
  { icon: 'view_module', label: i18n.t.topnav.clusters, page: '/clusters' },
  { icon: 'smart_toy', label: i18n.t.nav.chat, page: '/chat' },
  { icon: 'terminal', label: i18n.t.nav.terminal, page: '/terminal' },
  { icon: 'verified_user', label: i18n.t.nav.certificates, page: '/certificates' },
  { icon: 'settings', label: i18n.t.nav.settings, page: '/settings' },
])

function navigateTo(path: string) {
  router.push(path)
}

function isActive(path: string) {
  return route.path === path
}
</script>

<template>
  <aside class="hidden md:flex flex-col h-screen w-[240px] overflow-y-auto fixed left-0 top-0 bg-[#0F172A] border-r border-[#1E293B] z-50">
    <!-- Logo Header -->
    <div class="px-5 py-6 flex flex-col gap-1.5 border-b border-[#1E293B]">
      <h1 class="text-[17px] font-bold text-[#06B6D4] flex items-center gap-2">
        <span class="material-symbols-outlined">smart_toy</span> {{ i18n.t.logoTitle }}
      </h1>
      <p class="text-[11px] text-[#64748B] font-medium">{{ i18n.t.missionControl }}</p>
    </div>

    <!-- Unified 6 Navigation Items -->
    <nav class="flex-1 px-3 py-4 flex flex-col gap-1.5">
      <button
        v-for="item in navItems"
        :key="item.label"
        @click="navigateTo(item.page)"
        :class="[
          'flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all cursor-pointer w-full text-left',
          isActive(item.page)
            ? 'bg-[#06B6D4]/15 text-[#06B6D4] border-l-4 border-[#06B6D4] font-bold shadow-md'
            : 'text-[#94A3B8] hover:bg-[#1E293B] hover:text-[#F1F5F9] font-medium'
        ]"
      >
        <span class="material-symbols-outlined text-[19px] shrink-0">{{ item.icon }}</span>
        <span class="text-[13px] truncate">{{ item.label }}</span>
      </button>
    </nav>

    <!-- Bottom Health Status & Copyright -->
    <div class="px-4 py-4 border-t border-[#1E293B] mt-auto flex flex-col gap-3">
      <div class="bg-[#1E293B]/70 rounded-xl p-2.5 flex items-center justify-between border border-[#334155]">
        <span class="text-[11px] font-bold text-[#10B981] uppercase tracking-wide flex items-center gap-1.5">
          <span class="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
          {{ i18n.t.serverHealthOptimal }}
        </span>
      </div>
      
      <!-- Creator Copyright Attribution Line -->
      <div class="text-[11px] text-[#64748B] font-mono text-center pt-1 border-t border-[#1E293B]/60">
        Design by <span class="text-[#06B6D4] font-bold">Moisse</span> 2026
      </div>
    </div>
  </aside>
</template>
