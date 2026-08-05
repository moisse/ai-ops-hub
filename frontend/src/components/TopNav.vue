<script setup lang="ts">
import { useI18nStore } from '../stores/useI18nStore'

const i18n = useI18nStore()
</script>

<template>
  <nav class="hidden md:flex justify-between items-center px-6 w-full h-[56px] fixed top-0 right-0 z-40 bg-[#0B1120] border-b border-[#1E293B] ml-[240px]">
    <div class="flex items-center gap-4">
      <h2 class="text-[18px] font-bold text-[#F1F5F9]">{{ i18n.t.logoTitle }}</h2>
      <div class="flex items-center gap-6 h-full">
        <router-link to="/dashboard" class="text-[14px] text-[#94A3B8] hover:text-[#06B6D4] transition-colors h-full flex items-center">Nodes</router-link>
        <router-link to="/dashboard" class="text-[14px] text-[#94A3B8] hover:text-[#06B6D4] transition-colors h-full flex items-center">Clusters</router-link>
        <router-link to="/certificates" class="text-[14px] text-[#94A3B8] hover:text-[#06B6D4] transition-colors h-full flex items-center">Security</router-link>
      </div>
    </div>
    <div class="flex items-center gap-4">
      <!-- i18n Language Toggle Button -->
      <button 
        @click="i18n.toggleLanguage()" 
        class="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg border border-[#334155] bg-[#1E293B] text-[#06B6D4] hover:border-[#06B6D4] transition-all cursor-pointer font-bold"
        title="切换中英文 / Switch Language"
      >
        <span class="material-symbols-outlined text-sm">translate</span>
        <span>{{ i18n.currentLang === 'zh-CN' ? '中文' : 'EN' }}</span>
      </button>

      <button class="text-[#94A3B8] hover:text-[#06B6D4] transition-colors">
        <span class="material-symbols-outlined">notifications</span>
      </button>
      <button class="text-[#94A3B8] hover:text-[#06B6D4] transition-colors">
        <span class="material-symbols-outlined">help</span>
      </button>
      <router-link to="/settings" class="w-8 h-8 rounded-full border border-[#334155] bg-[#1E293B] flex items-center justify-center cursor-pointer hover:border-[#06B6D4]">
        <span class="text-[12px] font-bold text-[#06B6D4]">M</span>
      </router-link>
    </div>
  </nav>
</template>
