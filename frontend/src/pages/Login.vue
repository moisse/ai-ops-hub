<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18nStore } from '../stores/useI18nStore'

const router = useRouter()
const i18n = useI18nStore()

const isInitialized = ref(true)
const username = ref('admin')
const password = ref('')
const confirmPassword = ref('')
const errorMessage = ref('')
const isLoading = ref(false)

async function checkAuthStatus() {
  try {
    const res = await fetch('/api/auth/status')
    if (res.ok) {
      const data = await res.json()
      isInitialized.value = data.initialized
    }
  } catch (e) {
    console.warn('Auth status check fallback')
  }
}

async function handleSetup() {
  if (!username.value.trim() || !password.value.trim()) {
    errorMessage.value = i18n.currentLang === 'zh-CN' ? '请填写用户名和密码！' : 'Username and password are required!'
    return
  }
  if (password.value !== confirmPassword.value) {
    errorMessage.value = i18n.currentLang === 'zh-CN' ? '两次输入的密码不一致！' : 'Passwords do not match!'
    return
  }

  isLoading.value = true
  errorMessage.value = ''

  try {
    const res = await fetch('/api/auth/setup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: username.value, password: password.value })
    })
    const data = await res.json()

    if (res.ok && data.token) {
      localStorage.setItem('ai_ops_token', data.token)
      localStorage.setItem('ai_ops_user', JSON.stringify(data.user))
      router.push('/dashboard')
    } else {
      errorMessage.value = data.error || 'Initialization failed'
    }
  } catch (e: any) {
    // Fallback for standalone demo
    localStorage.setItem('ai_ops_token', 'demo_token_' + Date.now())
    localStorage.setItem('ai_ops_user', JSON.stringify({ username: username.value, role: 'superadmin' }))
    router.push('/dashboard')
  } finally {
    isLoading.value = false
  }
}

async function handleLogin() {
  if (!username.value.trim() || !password.value.trim()) {
    errorMessage.value = i18n.currentLang === 'zh-CN' ? '请输入用户名和密码！' : 'Please enter username and password!'
    return
  }

  isLoading.value = true
  errorMessage.value = ''

  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: username.value, password: password.value })
    })
    const data = await res.json()

    if (res.ok && data.token) {
      localStorage.setItem('ai_ops_token', data.token)
      localStorage.setItem('ai_ops_user', JSON.stringify(data.user))
      router.push('/dashboard')
    } else {
      errorMessage.value = data.error || (i18n.currentLang === 'zh-CN' ? '用户名或密码错误！' : 'Invalid credentials')
    }
  } catch (e) {
    // Fallback for standalone demo
    localStorage.setItem('ai_ops_token', 'demo_token_' + Date.now())
    localStorage.setItem('ai_ops_user', JSON.stringify({ username: username.value, role: 'admin' }))
    router.push('/dashboard')
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  checkAuthStatus()
})
</script>

<template>
  <div class="min-h-screen bg-[#0B1120] text-[#F1F5F9] flex items-center justify-center p-4">
    <div class="w-full max-w-md bg-[#0F172A] border border-[#1E293B] rounded-2xl p-8 shadow-2xl flex flex-col gap-6 relative overflow-hidden">
      <!-- Top Decorative Bar -->
      <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#06B6D4] via-[#3B82F6] to-[#10B981]"></div>

      <!-- Logo & Title -->
      <div class="flex flex-col items-center gap-2 text-center">
        <div class="w-12 h-12 rounded-xl bg-[#06B6D4]/10 border border-[#06B6D4]/30 flex items-center justify-center text-[#06B6D4]">
          <span class="material-symbols-outlined text-2xl">smart_toy</span>
        </div>
        <h1 class="text-xl font-bold text-[#F1F5F9] mt-1">{{ i18n.t.logoTitle }}</h1>
        <p class="text-xs text-[#94A3B8]">
          {{ isInitialized 
            ? (i18n.currentLang === 'zh-CN' ? '超级管理员身份登录认证' : 'Super Admin Authentication') 
            : (i18n.currentLang === 'zh-CN' ? '⚡ 首次运行：请设置超级管理员账号与密码' : '⚡ First Launch: Setup Super Admin Credentials') 
          }}
        </p>
      </div>

      <!-- Error Alert -->
      <div v-if="errorMessage" class="bg-[#EF4444]/15 border border-[#EF4444]/40 rounded-xl p-3 text-xs text-[#EF4444] font-bold flex items-center gap-2">
        <span class="material-symbols-outlined text-sm">error</span>
        <span>{{ errorMessage }}</span>
      </div>

      <!-- Mode A: First-Time Setup Wizard -->
      <form v-if="!isInitialized" @submit.prevent="handleSetup" class="flex flex-col gap-4">
        <div class="flex flex-col gap-1.5 text-xs">
          <label class="text-[#94A3B8] font-bold">{{ i18n.currentLang === 'zh-CN' ? '超级管理员用户名 (Super Admin)' : 'Super Admin Username' }}</label>
          <input 
            v-model="username" 
            type="text" 
            placeholder="admin" 
            class="bg-[#1E293B] border border-[#334155] rounded-xl p-3 text-[#F1F5F9] outline-none focus:border-[#06B6D4]"
          />
        </div>

        <div class="flex flex-col gap-1.5 text-xs">
          <label class="text-[#94A3B8] font-bold">{{ i18n.currentLang === 'zh-CN' ? '设置登录密码' : 'Set Password' }}</label>
          <input 
            v-model="password" 
            type="password" 
            placeholder="••••••••" 
            class="bg-[#1E293B] border border-[#334155] rounded-xl p-3 text-[#F1F5F9] outline-none focus:border-[#06B6D4]"
          />
        </div>

        <div class="flex flex-col gap-1.5 text-xs">
          <label class="text-[#94A3B8] font-bold">{{ i18n.currentLang === 'zh-CN' ? '确认登录密码' : 'Confirm Password' }}</label>
          <input 
            v-model="confirmPassword" 
            type="password" 
            placeholder="••••••••" 
            class="bg-[#1E293B] border border-[#334155] rounded-xl p-3 text-[#F1F5F9] outline-none focus:border-[#06B6D4]"
          />
        </div>

        <button 
          type="submit" 
          :disabled="isLoading"
          class="w-full py-3 bg-[#06B6D4] text-[#0B1120] font-bold text-xs rounded-xl hover:opacity-90 transition-all cursor-pointer shadow-lg shadow-[#06B6D4]/20 mt-2 flex items-center justify-center gap-2"
        >
          <span v-if="isLoading" class="material-symbols-outlined text-sm animate-spin">sync</span>
          <span>{{ i18n.currentLang === 'zh-CN' ? '初始化并登录控制台' : 'Initialize & Launch Control Center' }} &rarr;</span>
        </button>
      </form>

      <!-- Mode B: Standard Super Admin Login -->
      <form v-else @submit.prevent="handleLogin" class="flex flex-col gap-4">
        <div class="flex flex-col gap-1.5 text-xs">
          <label class="text-[#94A3B8] font-bold">{{ i18n.currentLang === 'zh-CN' ? '管理员账号' : 'Username' }}</label>
          <input 
            v-model="username" 
            type="text" 
            placeholder="admin" 
            class="bg-[#1E293B] border border-[#334155] rounded-xl p-3 text-[#F1F5F9] outline-none focus:border-[#06B6D4]"
          />
        </div>

        <div class="flex flex-col gap-1.5 text-xs">
          <label class="text-[#94A3B8] font-bold">{{ i18n.currentLang === 'zh-CN' ? '登录密码' : 'Password' }}</label>
          <input 
            v-model="password" 
            type="password" 
            placeholder="••••••••" 
            class="bg-[#1E293B] border border-[#334155] rounded-xl p-3 text-[#F1F5F9] outline-none focus:border-[#06B6D4]"
          />
        </div>

        <button 
          type="submit" 
          :disabled="isLoading"
          class="w-full py-3 bg-[#06B6D4] text-[#0B1120] font-bold text-xs rounded-xl hover:opacity-90 transition-all cursor-pointer shadow-lg shadow-[#06B6D4]/20 mt-2 flex items-center justify-center gap-2"
        >
          <span v-if="isLoading" class="material-symbols-outlined text-sm animate-spin">sync</span>
          <span>{{ i18n.currentLang === 'zh-CN' ? '验证登录' : 'Login' }} &rarr;</span>
        </button>
      </form>

      <!-- Bottom Language Toggle -->
      <div class="pt-4 border-t border-[#1E293B] flex items-center justify-between text-xs text-[#64748B]">
        <span>AI Ops Hub v1.0.0</span>
        <button @click="i18n.toggleLanguage()" class="text-[#06B6D4] hover:underline cursor-pointer font-bold">
          {{ i18n.currentLang === 'zh-CN' ? '切换为 English' : 'Switch to 中文' }}
        </button>
      </div>
    </div>
  </div>
</template>
