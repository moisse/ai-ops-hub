<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18nStore } from '../stores/useI18nStore'

const router = useRouter()
const i18n = useI18nStore()
const username = ref('Admin')

const userInitial = computed(() => {
  return username.value ? username.value.charAt(0).toUpperCase() : 'A'
})

function loadUser() {
  try {
    const raw = localStorage.getItem('ai_ops_user')
    if (raw) {
      const u = JSON.parse(raw)
      if (u.username) {
        username.value = u.username
      }
    }
  } catch (e) {
    console.warn('Failed to parse user initial')
  }
}

function handleLogout() {
  localStorage.removeItem('ai_ops_token')
  localStorage.removeItem('ai_ops_user')
  router.push('/login')
}

onMounted(() => {
  loadUser()
})
</script>

<template>
  <nav class="hidden md:flex justify-between items-center px-8 w-full h-[56px] fixed top-0 right-0 z-40 bg-[#0B1120] border-b border-[#1E293B] pl-[260px]">
    <div class="flex items-center gap-6">
      <h2 class="text-[16px] font-bold text-[#F1F5F9] shrink-0">{{ i18n.t.logoTitle }}</h2>
      <div class="flex items-center gap-6 h-full">
        <router-link to="/dashboard" class="text-[13px] text-[#94A3B8] hover:text-[#06B6D4] transition-colors h-full flex items-center font-medium">Nodes</router-link>
        <router-link to="/dashboard" class="text-[13px] text-[#94A3B8] hover:text-[#06B6D4] transition-colors h-full flex items-center font-medium">Clusters</router-link>
        <router-link to="/certificates" class="text-[13px] text-[#94A3B8] hover:text-[#06B6D4] transition-colors h-full flex items-center font-medium">Security</router-link>
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

      <button @click="handleLogout" class="text-[#94A3B8] hover:text-[#EF4444] transition-colors flex items-center gap-1 text-xs font-bold" title="退出登录">
        <span class="material-symbols-outlined text-sm">logout</span>
      </button>

      <!-- Dynamic User Avatar Initial -->
      <router-link to="/settings" class="w-8 h-8 rounded-full border border-[#06B6D4]/50 bg-[#06B6D4]/10 flex items-center justify-center cursor-pointer hover:border-[#06B6D4] transition-all" :title="username">
        <span class="text-[12px] font-bold text-[#06B6D4]">{{ userInitial }}</span>
      </router-link>
    </div>
  </nav>
</template>
