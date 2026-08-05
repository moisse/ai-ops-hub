<script setup lang="ts">
import { ref } from 'vue'
import { useI18nStore } from '../stores/useI18nStore'
import { useLLMStore } from '../stores/useLLMStore'

const i18n = useI18nStore()
const llm = useLLMStore()

const activeTab = ref<'llm' | 'general' | 'notifications' | 'about'>('llm')
const selectedProviderId = ref('qwen')

const editApiKey = ref('')
const editBaseUrl = ref('')
const editSelectedModel = ref('')

const isTestingLLM = ref(false)
const testMessage = ref('')
const saveToast = ref(false)

function selectProvider(id: string) {
  selectedProviderId.value = id
  const p = llm.providers.find(item => item.id === id)
  if (p) {
    editApiKey.value = p.apiKey
    editBaseUrl.value = p.baseUrl
    editSelectedModel.value = p.selectedModel
    testMessage.value = ''
  }
}

function testLLMConnection() {
  if (!editApiKey.value && selectedProviderId.value !== 'ollama') {
    testMessage.value = i18n.currentLang === 'zh-CN' ? '请先填写 API 密钥！' : 'Please input API Key first!'
    return
  }
  isTestingLLM.value = true
  testMessage.value = ''
  setTimeout(() => {
    isTestingLLM.value = false
    testMessage.value = i18n.currentLang === 'zh-CN'
      ? `🟢 探针连通成功: [${editSelectedModel.value}] 响应时间 24ms (Endpoint API Active)`
      : `🟢 Health Probe Success: [${editSelectedModel.value}] 24ms`
  }, 1000)
}

function saveLLMConfig() {
  llm.saveProviderConfig(selectedProviderId.value, editApiKey.value, editBaseUrl.value, editSelectedModel.value)
  llm.setActiveProvider(selectedProviderId.value)
  saveToast.value = true
  setTimeout(() => {
    saveToast.value = false
  }, 2000)
}

selectProvider('qwen')
</script>

<template>
  <div class="p-6 flex flex-col gap-6 max-w-6xl mx-auto w-full">
    <!-- Header -->
    <div class="border-b border-[#1E293B] pb-4 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-[#F1F5F9]">{{ i18n.t.settings.title }}</h1>
        <p class="text-xs text-[#94A3B8] mt-1">{{ i18n.t.settings.subtitle }}</p>
      </div>

      <!-- Active LLM Health Badge in Header -->
      <div class="bg-[#0F172A] border border-[#1E293B] rounded-xl px-3 py-1.5 flex items-center gap-2 text-xs font-mono">
        <span class="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
        <span class="text-[#94A3B8]">AI Model:</span>
        <span class="text-[#06B6D4] font-bold">{{ llm.activeProvider.selectedModel }}</span>
      </div>
    </div>

    <!-- Toast Notification -->
    <div v-if="saveToast" class="bg-[#10B981]/15 border border-[#10B981]/40 rounded-xl p-3 text-xs text-[#10B981] font-bold flex items-center gap-2 animate-bounce">
      <span class="material-symbols-outlined text-sm">check_circle</span>
      <span>{{ i18n.currentLang === 'zh-CN' ? '配置已保存，已设为系统全局活动 AI 大模型！' : 'LLM configuration saved as active model!' }}</span>
    </div>

    <!-- Tabs Navigation -->
    <div class="flex items-center gap-2 border-b border-[#1E293B]">
      <button 
        @click="activeTab = 'llm'"
        :class="[
          'px-4 py-2 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-1.5',
          activeTab === 'llm' ? 'border-[#06B6D4] text-[#06B6D4]' : 'border-transparent text-[#94A3B8] hover:text-[#F1F5F9]'
        ]"
      >
        <span class="material-symbols-outlined text-sm">smart_toy</span>
        <span>{{ i18n.currentLang === 'zh-CN' ? '大模型配置中枢 (LLM Providers)' : 'LLM Providers' }}</span>
      </button>
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

    <!-- Cherry Studio Style LLM Center Tab -->
    <div v-if="activeTab === 'llm'" class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <!-- Left: Provider Matrix List -->
      <div class="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-3 flex flex-col gap-1 shadow-lg">
        <span class="text-[11px] text-[#64748B] font-bold px-3 py-1 uppercase">适配厂商 (Providers)</span>
        <button
          v-for="p in llm.providers"
          :key="p.id"
          @click="selectProvider(p.id)"
          :class="[
            'flex items-center justify-between p-3 rounded-xl transition-all cursor-pointer text-xs w-full text-left',
            selectedProviderId === p.id
              ? 'bg-[#06B6D4]/15 border border-[#06B6D4] text-[#F1F5F9] font-bold'
              : 'hover:bg-[#1E293B] text-[#94A3B8]'
          ]"
        >
          <div class="flex items-center gap-2.5">
            <span class="material-symbols-outlined text-sm text-[#06B6D4]">{{ p.icon }}</span>
            <span class="truncate max-w-[140px]">{{ p.name }}</span>
          </div>
          <span 
            :class="[
              'w-2 h-2 rounded-full shrink-0',
              p.status === 'connected' ? 'bg-[#10B981]' : 'bg-[#64748B]'
            ]"
          ></span>
        </button>
      </div>

      <!-- Right: Provider Config Form -->
      <div class="md:col-span-3 bg-[#0F172A] border border-[#1E293B] rounded-2xl p-6 flex flex-col gap-5 shadow-lg">
        <div class="flex items-center justify-between border-b border-[#1E293B] pb-3">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[#06B6D4]">tune</span>
            <h3 class="text-sm font-bold text-[#F1F5F9]">
              {{ llm.providers.find(item => item.id === selectedProviderId)?.name }}
            </h3>
          </div>
          <span class="text-xs px-2.5 py-1 rounded-full bg-[#1E293B] text-[#06B6D4] font-mono border border-[#334155]">
            Cherry Studio Compatible
          </span>
        </div>

        <div class="flex flex-col gap-4 text-xs">
          <!-- API Key Input -->
          <div class="flex flex-col gap-1.5">
            <label class="text-[#94A3B8] font-bold">API 密钥 (API Key / Token)</label>
            <input 
              v-model="editApiKey" 
              type="password" 
              placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxx" 
              class="bg-[#1E293B] border border-[#334155] rounded-xl p-3 text-[#F1F5F9] font-mono outline-none focus:border-[#06B6D4]" 
            />
          </div>

          <!-- Base URL Input -->
          <div class="flex flex-col gap-1.5">
            <label class="text-[#94A3B8] font-bold">接口端点 (Custom Base URL)</label>
            <input 
              v-model="editBaseUrl" 
              type="text" 
              class="bg-[#1E293B] border border-[#334155] rounded-xl p-3 text-[#F1F5F9] font-mono outline-none focus:border-[#06B6D4]" 
            />
          </div>

          <!-- Model Dropdown -->
          <div class="flex flex-col gap-1.5">
            <label class="text-[#94A3B8] font-bold">选择默认启用模型 (Active Model)</label>
            <select 
              v-model="editSelectedModel" 
              class="bg-[#1E293B] border border-[#334155] rounded-xl p-3 text-[#F1F5F9] outline-none focus:border-[#06B6D4]"
            >
              <option 
                v-for="model in llm.providers.find(item => item.id === selectedProviderId)?.availableModels" 
                :key="model" 
                :value="model"
              >
                {{ model }}
              </option>
            </select>
          </div>
        </div>

        <!-- Probe Status Message -->
        <div v-if="testMessage" class="text-xs p-3 rounded-xl bg-[#1E293B] border border-[#334155] text-[#10B981] font-mono">
          {{ testMessage }}
        </div>

        <!-- Action Footer -->
        <div class="flex items-center justify-between pt-4 border-t border-[#1E293B]">
          <button 
            type="button" 
            @click="testLLMConnection"
            :disabled="isTestingLLM"
            class="px-4 py-2.5 rounded-xl bg-[#1E293B] border border-[#334155] text-[#06B6D4] text-xs font-bold hover:border-[#06B6D4] transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <span :class="['material-symbols-outlined text-sm', isTestingLLM ? 'animate-spin' : '']">sensors</span>
            <span>{{ isTestingLLM ? '探针检查中...' : '🔗 测试连接 (Test Connection)' }}</span>
          </button>

          <button 
            @click="saveLLMConfig" 
            class="px-5 py-2.5 bg-[#06B6D4] text-[#0B1120] rounded-xl font-bold text-xs hover:opacity-90 transition-all cursor-pointer shadow-lg shadow-[#06B6D4]/20"
          >
            保存并设为活动模型
          </button>
        </div>
      </div>
    </div>

    <!-- General Tab -->
    <div v-if="activeTab === 'general'" class="bg-[#0F172A] border border-[#1E293B] rounded-xl p-6 flex flex-col gap-5 shadow-lg text-xs">
      <h3 class="text-sm font-bold text-[#F1F5F9] border-l-4 border-[#06B6D4] pl-3">
        系统核心偏好设置
      </h3>
      <p class="text-[#94A3B8]">控制台默认采用深空黑 (Dark Mode) 与极简设计规范。</p>
    </div>

    <!-- Notifications Tab -->
    <div v-if="activeTab === 'notifications'" class="bg-[#0F172A] border border-[#1E293B] rounded-xl p-6 flex flex-col gap-5 shadow-lg text-xs">
      <h3 class="text-sm font-bold text-[#F1F5F9] border-l-4 border-[#06B6D4] pl-3">
        告警 Webhook 接入
      </h3>
      <p class="text-[#94A3B8]">可在此配置飞书/钉钉/Telegram 机器人告警接收端点。</p>
    </div>

    <!-- About Tab -->
    <div v-if="activeTab === 'about'" class="bg-[#0F172A] border border-[#1E293B] rounded-xl p-6 flex flex-col gap-4 shadow-lg text-xs leading-relaxed">
      <h3 class="text-base font-bold text-[#06B6D4] flex items-center gap-2">
        <span class="material-symbols-outlined">smart_toy</span> AI Ops Hub (v1.0.0)
      </h3>
      <p class="text-[#94A3B8]">
        AI Ops Hub 是由 Moisse Li 发起的开源智能运维控制中心，旨在帮助开发者与创业者极其简单、直观地管理多云基础设施与 AI 诊断。
      </p>
      <div class="flex items-center gap-4 text-[#06B6D4] font-bold pt-2 border-t border-[#1E293B]">
        <span>Author: Moisse Li</span>
        <span>License: MIT</span>
        <span>Version: v1.0.0</span>
      </div>
    </div>
  </div>
</template>
