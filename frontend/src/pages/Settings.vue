<script setup lang="ts">
import { ref } from 'vue'
import { useI18nStore } from '../stores/useI18nStore'

const i18n = useI18nStore()
const activeTab = ref('general')

const apiKey = ref('sk_live_your_api_key_here')
const webhookUrl = ref('https://open.feishu.cn/open-apis/bot/v2/hook/example')
const saveToast = ref(false)

function saveSettings() {
  saveToast.value = true
  setTimeout(() => {
    saveToast.value = false
  }, 2000)
}
</script>

<template>
  <div class="p-6 flex flex-col gap-6 max-w-6xl mx-auto w-full">
    <!-- Header -->
    <div class="border-b border-[#1E293B] pb-4">
      <h1 class="text-2xl font-bold text-[#F1F5F9]">{{ i18n.t.settings.title }}</h1>
      <p class="text-xs text-[#94A3B8] mt-1">{{ i18n.t.settings.subtitle }}</p>
    </div>

    <!-- Toast Notification -->
    <div v-if="saveToast" class="bg-[#10B981]/15 border border-[#10B981]/40 rounded-xl p-3 text-xs text-[#10B981] font-bold flex items-center gap-2 animate-bounce">
      <span class="material-symbols-outlined text-sm">check_circle</span>
      <span>{{ i18n.currentLang === 'zh-CN' ? '系统配置保存成功！' : 'Settings saved successfully!' }}</span>
    </div>

    <!-- Tabs Navigation -->
    <div class="flex items-center gap-2 border-b border-[#1E293B]">
      <button 
        @click="activeTab = 'general'"
        :class="[
          'px-4 py-2 text-xs font-bold transition-all border-b-2 cursor-pointer',
          activeTab === 'general' ? 'border-[#06B6D4] text-[#06B6D4]' : 'border-transparent text-[#94A3B8] hover:text-[#F1F5F9]'
        ]"
      >
        {{ i18n.currentLang === 'zh-CN' ? '常规配置 (General)' : 'General' }}
      </button>
      <button 
        @click="activeTab = 'notifications'"
        :class="[
          'px-4 py-2 text-xs font-bold transition-all border-b-2 cursor-pointer',
          activeTab === 'notifications' ? 'border-[#06B6D4] text-[#06B6D4]' : 'border-transparent text-[#94A3B8] hover:text-[#F1F5F9]'
        ]"
      >
        {{ i18n.currentLang === 'zh-CN' ? '告警通知 (Webhook)' : 'Notifications' }}
      </button>
      <button 
        @click="activeTab = 'about'"
        :class="[
          'px-4 py-2 text-xs font-bold transition-all border-b-2 cursor-pointer',
          activeTab === 'about' ? 'border-[#06B6D4] text-[#06B6D4]' : 'border-transparent text-[#94A3B8] hover:text-[#F1F5F9]'
        ]"
      >
        {{ i18n.currentLang === 'zh-CN' ? '关于项目 (About)' : 'About' }}
      </button>
    </div>

    <!-- General Tab -->
    <div v-if="activeTab === 'general'" class="bg-[#0F172A] border border-[#1E293B] rounded-xl p-6 flex flex-col gap-5 shadow-lg">
      <h3 class="text-sm font-bold text-[#F1F5F9] border-l-4 border-[#06B6D4] pl-3">
        {{ i18n.currentLang === 'zh-CN' ? '大模型 API 密钥与集群参数' : 'LLM API Keys & Cluster Settings' }}
      </h3>
      <div class="flex flex-col gap-2 text-xs">
        <label class="text-[#94A3B8] font-bold">{{ i18n.t.settings.apiKey }}</label>
        <input v-model="apiKey" type="password" class="bg-[#1E293B] border border-[#334155] rounded-lg p-3 text-[#F1F5F9] font-mono outline-none focus:border-[#06B6D4]" />
      </div>
      <div class="flex items-center justify-end">
        <button @click="saveSettings" class="px-5 py-2.5 bg-[#06B6D4] text-[#0B1120] rounded-lg font-bold text-xs hover:opacity-90 transition-all cursor-pointer">
          {{ i18n.t.settings.save }}
        </button>
      </div>
    </div>

    <!-- Notifications Tab -->
    <div v-if="activeTab === 'notifications'" class="bg-[#0F172A] border border-[#1E293B] rounded-xl p-6 flex flex-col gap-5 shadow-lg">
      <h3 class="text-sm font-bold text-[#F1F5F9] border-l-4 border-[#06B6D4] pl-3">
        {{ i18n.currentLang === 'zh-CN' ? '飞书 / Telegram Webhook 机器人告警' : 'Feishu / Telegram Webhook Alerting' }}
      </h3>
      <div class="flex flex-col gap-2 text-xs">
        <label class="text-[#94A3B8] font-bold">Webhook Endpoint URL</label>
        <input v-model="webhookUrl" type="text" class="bg-[#1E293B] border border-[#334155] rounded-lg p-3 text-[#F1F5F9] font-mono outline-none focus:border-[#06B6D4]" />
      </div>
      <div class="flex items-center justify-end">
        <button @click="saveSettings" class="px-5 py-2.5 bg-[#06B6D4] text-[#0B1120] rounded-lg font-bold text-xs hover:opacity-90 transition-all cursor-pointer">
          {{ i18n.t.settings.save }}
        </button>
      </div>
    </div>

    <!-- About Tab -->
    <div v-if="activeTab === 'about'" class="bg-[#0F172A] border border-[#1E293B] rounded-xl p-6 flex flex-col gap-4 shadow-lg text-xs leading-relaxed">
      <h3 class="text-base font-bold text-[#06B6D4] flex items-center gap-2">
        <span class="material-symbols-outlined">smart_toy</span> AI Ops Hub (v1.0.0)
      </h3>
      <p class="text-[#94A3B8]">
        {{ i18n.currentLang === 'zh-CN' 
          ? 'AI Ops Hub 是由 Moisse Li 发起的开源智能运维控制中心，旨在帮助开发者与创业者极其简单、直观地管理多云基础设施与 AI 诊断。'
          : 'AI Ops Hub is an open-source AI-driven operations control center founded by Moisse Li, designed to simplify multi-cloud infrastructure monitoring.'
        }}
      </p>
      <div class="flex items-center gap-4 text-[#06B6D4] font-bold pt-2 border-t border-[#1E293B]">
        <span>Author: Moisse Li</span>
        <span>License: MIT</span>
        <span>Version: v1.0.0</span>
      </div>
    </div>
  </div>
</template>
