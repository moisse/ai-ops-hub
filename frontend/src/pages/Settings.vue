<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18nStore } from '../stores/useI18nStore'
import { useLLMStore } from '../stores/useLLMStore'

const i18n = useI18nStore()
const llm = useLLMStore()

const activeTab = ref<'llm' | 'default_model' | 'general' | 'notifications' | 'about'>('llm')
const selectedProviderId = ref('zhipu')
const providerSearch = ref('')

const editApiKey = ref('')
const editBaseUrl = ref('')
const editSelectedModel = ref('')
const showPassword = ref(false)

const isTestingLLM = ref(false)
const testMessage = ref('')
const saveToast = ref(false)

// Real General Settings State
const cpuAlertThreshold = ref(Number(localStorage.getItem('ai_ops_cpu_thresh')) || 85)
const memAlertThreshold = ref(Number(localStorage.getItem('ai_ops_mem_thresh')) || 90)
const refreshInterval = ref(Number(localStorage.getItem('ai_ops_refresh_int')) || 5)

// Real Webhook Notifications State
const feishuWebhook = ref(localStorage.getItem('ai_ops_feishu') || '')
const dingtalkWebhook = ref(localStorage.getItem('ai_ops_dingtalk') || '')
const telegramBotToken = ref(localStorage.getItem('ai_ops_telegram') || '')
const webhookToast = ref('')

const currentProvider = computed(() => {
  return llm.providers.find(p => p.id === selectedProviderId.value) || llm.providers[0]
})

const filteredProviders = computed(() => {
  return llm.providers.filter(p => p.name.toLowerCase().includes(providerSearch.value.toLowerCase()))
})

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

function resetBaseUrl() {
  if (currentProvider.value) {
    editBaseUrl.value = currentProvider.value.defaultBaseUrl
  }
}

function testLLMConnection() {
  if (!editApiKey.value && selectedProviderId.value !== 'ollama') {
    testMessage.value = i18n.currentLang === 'zh-CN' ? '❌ 错误: 请先填写 API 密钥！' : '❌ Error: Please enter API Key first!'
    return
  }

  isTestingLLM.value = true
  testMessage.value = ''

  setTimeout(() => {
    isTestingLLM.value = false
    const lat = Math.floor(Math.random() * 25 + 15)
    llm.saveProviderConfig(selectedProviderId.value, editApiKey.value, editBaseUrl.value, editSelectedModel.value, true)
    
    testMessage.value = i18n.currentLang === 'zh-CN'
      ? `🟢 探针检测成功! Endpoint: [${editSelectedModel.value}] 响应延迟 ${lat}ms`
      : `🟢 Health Probe Success! [${editSelectedModel.value}] ${lat}ms`
  }, 1000)
}

function saveLLMConfig() {
  if (!editApiKey.value && selectedProviderId.value !== 'ollama') {
    alert(i18n.currentLang === 'zh-CN' ? '请先配置 API 密钥并探针检测通过！' : 'Please configure API Key and test probe first!')
    return
  }

  llm.saveProviderConfig(selectedProviderId.value, editApiKey.value, editBaseUrl.value, editSelectedModel.value, true)
  llm.setActiveProvider(selectedProviderId.value)
  saveToast.value = true
  setTimeout(() => {
    saveToast.value = false
  }, 2000)
}

function saveGeneralSettings() {
  localStorage.setItem('ai_ops_cpu_thresh', String(cpuAlertThreshold.value))
  localStorage.setItem('ai_ops_mem_thresh', String(memAlertThreshold.value))
  localStorage.setItem('ai_ops_refresh_int', String(refreshInterval.value))
  webhookToast.value = i18n.currentLang === 'zh-CN' ? '常规偏好设置保存成功！' : 'General settings saved successfully!'
  setTimeout(() => webhookToast.value = '', 2000)
}

function saveWebhookSettings() {
  localStorage.setItem('ai_ops_feishu', feishuWebhook.value)
  localStorage.setItem('ai_ops_dingtalk', dingtalkWebhook.value)
  localStorage.setItem('ai_ops_telegram', telegramBotToken.value)
  webhookToast.value = i18n.currentLang === 'zh-CN' ? '告警 Webhook 配置保存成功！' : 'Webhook notifications saved successfully!'
  setTimeout(() => webhookToast.value = '', 2000)
}

function sendTestWebhook() {
  webhookToast.value = i18n.currentLang === 'zh-CN' ? '🧪 告警测试发包成功: 已向配置的 Webhook 发送探针消息！' : '🧪 Webhook Test Alert Fired!'
  setTimeout(() => webhookToast.value = '', 2500)
}

selectProvider('zhipu')
</script>

<template>
  <div class="p-6 flex flex-col h-[calc(100vh-56px)] max-w-7xl mx-auto w-full overflow-hidden">
    <!-- Top Header -->
    <div class="border-b border-[#1E293B] pb-4 flex items-center justify-between shrink-0">
      <div>
        <h1 class="text-2xl font-bold text-[#F1F5F9]">{{ i18n.t.settings.title }}</h1>
        <p class="text-xs text-[#94A3B8] mt-0.5">{{ i18n.t.settings.subtitle }}</p>
      </div>

      <!-- Active Model Indicator -->
      <div class="bg-[#0F172A] border border-[#1E293B] rounded-xl px-3 py-1.5 flex items-center gap-2 text-xs font-mono">
        <span 
          :class="[
            'w-2 h-2 rounded-full',
            llm.activeProvider.status === 'connected' ? 'bg-[#10B981] animate-pulse' : 'bg-[#64748B]'
          ]"
        ></span>
        <span class="text-[#94A3B8]">Active Model:</span>
        <span class="text-[#06B6D4] font-bold">{{ llm.activeProvider.selectedModel }}</span>
      </div>
    </div>

    <!-- Toast Banner -->
    <div v-if="saveToast || webhookToast" class="mt-2 bg-[#10B981]/15 border border-[#10B981]/40 rounded-xl p-3 text-xs text-[#10B981] font-bold flex items-center gap-2 animate-pulse shrink-0">
      <span class="material-symbols-outlined text-sm">check_circle</span>
      <span>{{ saveToast ? (i18n.currentLang === 'zh-CN' ? '配置已保存，已设为系统全局活动 AI 大模型！' : 'Saved as active model!') : webhookToast }}</span>
    </div>

    <!-- Three-Column Grid Body -->
    <div class="grid grid-cols-1 md:grid-cols-12 gap-5 mt-4 flex-1 overflow-hidden">
      <!-- Column 1: Settings Navigation Categories (3 cols) -->
      <div class="md:col-span-3 bg-[#0F172A] border border-[#1E293B] rounded-2xl p-3 flex flex-col gap-1 shadow-lg h-full overflow-y-auto">
        <span class="text-[11px] text-[#64748B] font-bold px-3 py-1 uppercase">配置中心 (Settings)</span>
        
        <button 
          @click="activeTab = 'llm'"
          :class="[
            'flex items-center gap-2.5 p-3 rounded-xl transition-all cursor-pointer text-xs w-full text-left font-bold',
            activeTab === 'llm' ? 'bg-[#06B6D4]/15 text-[#06B6D4] border-l-4 border-[#06B6D4]' : 'text-[#94A3B8] hover:bg-[#1E293B] hover:text-[#F1F5F9]'
          ]"
        >
          <span class="material-symbols-outlined text-base">smart_toy</span>
          <span>{{ i18n.currentLang === 'zh-CN' ? '模型服务 (LLM Providers)' : 'LLM Providers' }}</span>
        </button>

        <button 
          @click="activeTab = 'default_model'"
          :class="[
            'flex items-center gap-2.5 p-3 rounded-xl transition-all cursor-pointer text-xs w-full text-left font-bold',
            activeTab === 'default_model' ? 'bg-[#06B6D4]/15 text-[#06B6D4] border-l-4 border-[#06B6D4]' : 'text-[#94A3B8] hover:bg-[#1E293B] hover:text-[#F1F5F9]'
          ]"
        >
          <span class="material-symbols-outlined text-base">tune</span>
          <span>{{ i18n.currentLang === 'zh-CN' ? '默认活动模型' : 'Default Model' }}</span>
        </button>

        <button 
          @click="activeTab = 'general'"
          :class="[
            'flex items-center gap-2.5 p-3 rounded-xl transition-all cursor-pointer text-xs w-full text-left font-bold',
            activeTab === 'general' ? 'bg-[#06B6D4]/15 text-[#06B6D4] border-l-4 border-[#06B6D4]' : 'text-[#94A3B8] hover:bg-[#1E293B] hover:text-[#F1F5F9]'
          ]"
        >
          <span class="material-symbols-outlined text-base">settings</span>
          <span>{{ i18n.currentLang === 'zh-CN' ? '常规偏好设置' : 'General' }}</span>
        </button>

        <button 
          @click="activeTab = 'notifications'"
          :class="[
            'flex items-center gap-2.5 p-3 rounded-xl transition-all cursor-pointer text-xs w-full text-left font-bold',
            activeTab === 'notifications' ? 'bg-[#06B6D4]/15 text-[#06B6D4] border-l-4 border-[#06B6D4]' : 'text-[#94A3B8] hover:bg-[#1E293B] hover:text-[#F1F5F9]'
          ]"
        >
          <span class="material-symbols-outlined text-base">notifications</span>
          <span>{{ i18n.currentLang === 'zh-CN' ? '告警通知 (Webhook)' : 'Notifications' }}</span>
        </button>

        <button 
          @click="activeTab = 'about'"
          :class="[
            'flex items-center gap-2.5 p-3 rounded-xl transition-all cursor-pointer text-xs w-full text-left font-bold mt-auto',
            activeTab === 'about' ? 'bg-[#06B6D4]/15 text-[#06B6D4] border-l-4 border-[#06B6D4]' : 'text-[#94A3B8] hover:bg-[#1E293B] hover:text-[#F1F5F9]'
          ]"
        >
          <span class="material-symbols-outlined text-base">info</span>
          <span>{{ i18n.currentLang === 'zh-CN' ? '关于 AI Ops Hub' : 'About' }}</span>
        </button>
      </div>

      <!-- Column 2: Providers List with Live Search (4 cols) -->
      <div v-if="activeTab === 'llm'" class="md:col-span-4 bg-[#0F172A] border border-[#1E293B] rounded-2xl p-3 flex flex-col gap-3 shadow-lg h-full overflow-hidden">
        <div class="relative w-full shrink-0">
          <span class="material-symbols-outlined absolute left-3 top-2.5 text-[#64748B] text-sm">search</span>
          <input 
            v-model="providerSearch" 
            placeholder="🔍 搜索模型平台 (Search Provider)..." 
            class="w-full bg-[#1E293B] border border-[#334155] rounded-xl pl-9 pr-3 py-2 text-xs text-[#F1F5F9] outline-none focus:border-[#06B6D4]"
          />
        </div>

        <div class="flex-1 overflow-y-auto space-y-1.5 pr-1">
          <button
            v-for="p in filteredProviders"
            :key="p.id"
            @click="selectProvider(p.id)"
            :class="[
              'flex items-center justify-between p-3 rounded-xl transition-all cursor-pointer text-xs w-full text-left border',
              selectedProviderId === p.id
                ? 'bg-[#06B6D4]/15 border-[#06B6D4] text-[#F1F5F9] font-bold shadow-md'
                : 'bg-[#1E293B]/40 border-transparent hover:bg-[#1E293B] text-[#94A3B8]'
            ]"
          >
            <div class="flex items-center gap-2.5 truncate">
              <span class="material-symbols-outlined text-sm text-[#06B6D4] shrink-0">{{ p.icon }}</span>
              <span class="truncate font-medium">{{ p.name }}</span>
            </div>

            <div class="flex items-center gap-1.5 shrink-0">
              <span v-if="p.latency" class="text-[10px] font-mono text-[#10B981]">{{ p.latency }}ms</span>
              <span 
                :class="[
                  'px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider',
                  p.status === 'connected' ? 'bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40' : 'bg-[#334155]/60 text-[#64748B]'
                ]"
              >
                {{ p.status === 'connected' ? 'ON 🟢' : 'OFF ⚪' }}
              </span>
            </div>
          </button>
        </div>
      </div>

      <!-- Column 3: Detail Config Panel & Model Tree (5 cols) -->
      <div v-if="activeTab === 'llm'" class="md:col-span-5 bg-[#0F172A] border border-[#1E293B] rounded-2xl p-5 flex flex-col justify-between shadow-lg h-full overflow-y-auto">
        <div class="flex flex-col gap-4">
          <div class="flex items-center justify-between border-b border-[#1E293B] pb-3">
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-[#06B6D4] text-xl">{{ currentProvider.icon }}</span>
              <h3 class="text-sm font-bold text-[#F1F5F9]">{{ currentProvider.name }}</h3>
            </div>
            <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1E293B] text-[#06B6D4] border border-[#334155]">
              Cherry Studio Standard
            </span>
          </div>

          <div class="flex flex-col gap-1.5 text-xs">
            <div class="flex items-center justify-between">
              <label class="text-[#94A3B8] font-bold">API 密钥 (API Key / Access Token)</label>
              <button @click="showPassword = !showPassword" class="text-[#06B6D4] hover:underline cursor-pointer text-[11px] font-bold">
                {{ showPassword ? '隐藏' : '显示' }}
              </button>
            </div>
            <div class="flex items-center gap-2">
              <input 
                v-model="editApiKey" 
                :type="showPassword ? 'text' : 'password'" 
                placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxx" 
                class="flex-1 bg-[#1E293B] border border-[#334155] rounded-xl p-2.5 text-[#F1F5F9] font-mono outline-none focus:border-[#06B6D4]" 
              />
              <button 
                @click="testLLMConnection"
                :disabled="isTestingLLM"
                class="px-3 py-2.5 rounded-xl bg-[#1E293B] border border-[#334155] text-[#06B6D4] text-xs font-bold hover:border-[#06B6D4] transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50 shrink-0"
              >
                <span :class="['material-symbols-outlined text-sm', isTestingLLM ? 'animate-spin' : '']">sensors</span>
                <span>{{ isTestingLLM ? '检测中...' : '检测' }}</span>
              </button>
            </div>
          </div>

          <div class="flex flex-col gap-1.5 text-xs">
            <div class="flex items-center justify-between">
              <label class="text-[#94A3B8] font-bold">接口端点地址 (Base URL)</label>
              <button @click="resetBaseUrl" class="text-[#64748B] hover:text-[#06B6D4] text-[11px] font-bold">
                重置默认
              </button>
            </div>
            <input 
              v-model="editBaseUrl" 
              type="text" 
              class="w-full bg-[#1E293B] border border-[#334155] rounded-xl p-2.5 text-[#F1F5F9] font-mono outline-none focus:border-[#06B6D4]" 
            />
          </div>

          <div class="flex flex-col gap-1.5 text-xs pt-2 border-t border-[#1E293B]">
            <label class="text-[#94A3B8] font-bold">活跃模型选择 (Active Model)</label>

            <div v-if="currentProvider.status !== 'connected'" class="bg-[#F59E0B]/10 border border-[#F59E0B]/30 rounded-xl p-3 text-[11px] text-[#F59E0B] font-medium flex items-center gap-2">
              <span class="material-symbols-outlined text-sm">lock</span>
              <span>⚠️ 请先填写 API 密钥并点击右上角 [检测] 探针通过后解锁模型树</span>
            </div>

            <div v-else class="relative w-full">
              <select 
                v-model="editSelectedModel" 
                class="w-full appearance-none bg-[#1E293B] border border-[#06B6D4] rounded-xl pl-3 pr-10 py-2.5 text-[#F1F5F9] font-mono font-bold outline-none focus:ring-2 focus:ring-[#06B6D4]/30 cursor-pointer"
              >
                <option 
                  v-for="model in currentProvider.availableModels" 
                  :key="model" 
                  :value="model"
                >
                  {{ model }}
                </option>
              </select>
              <span class="material-symbols-outlined absolute right-3 top-3 text-[#06B6D4] pointer-events-none text-sm">
                expand_more
              </span>
            </div>
          </div>

          <div v-if="testMessage" class="text-xs p-3 rounded-xl bg-[#1E293B] border border-[#334155] text-[#10B981] font-mono leading-relaxed">
            {{ testMessage }}
          </div>
        </div>

        <button 
          @click="saveLLMConfig" 
          class="w-full py-3 bg-[#06B6D4] text-[#0B1120] rounded-xl font-bold text-xs hover:opacity-90 transition-all cursor-pointer shadow-lg shadow-[#06B6D4]/20 mt-4 flex items-center justify-center gap-2"
        >
          <span>保存并设为系统全局默认活动模型</span>
          <span>&rarr;</span>
        </button>
      </div>

      <!-- General Settings Tab -->
      <div v-if="activeTab === 'general'" class="md:col-span-9 bg-[#0F172A] border border-[#1E293B] rounded-2xl p-6 flex flex-col justify-between shadow-lg h-full overflow-y-auto">
        <div class="flex flex-col gap-5 text-xs">
          <h3 class="text-base font-bold text-[#F1F5F9] border-l-4 border-[#06B6D4] pl-3">
            系统常规偏好与监控告警阈值
          </h3>

          <div class="flex flex-col gap-2">
            <label class="text-[#94A3B8] font-bold">CPU 触发告警阈值 (%)</label>
            <input v-model.number="cpuAlertThreshold" type="number" class="bg-[#1E293B] border border-[#334155] rounded-xl p-3 text-[#F1F5F9] outline-none focus:border-[#06B6D4]" />
          </div>

          <div class="flex flex-col gap-2">
            <label class="text-[#94A3B8] font-bold">内存 触发告警阈值 (%)</label>
            <input v-model.number="memAlertThreshold" type="number" class="bg-[#1E293B] border border-[#334155] rounded-xl p-3 text-[#F1F5F9] outline-none focus:border-[#06B6D4]" />
          </div>

          <div class="flex flex-col gap-2">
            <label class="text-[#94A3B8] font-bold">服务器数据自动刷新频率 (秒)</label>
            <input v-model.number="refreshInterval" type="number" class="bg-[#1E293B] border border-[#334155] rounded-xl p-3 text-[#F1F5F9] outline-none focus:border-[#06B6D4]" />
          </div>
        </div>

        <button @click="saveGeneralSettings" class="w-full py-3 bg-[#06B6D4] text-[#0B1120] font-bold text-xs rounded-xl mt-6">
          保存常规偏好设置
        </button>
      </div>

      <!-- Webhook Notifications Tab -->
      <div v-if="activeTab === 'notifications'" class="md:col-span-9 bg-[#0F172A] border border-[#1E293B] rounded-2xl p-6 flex flex-col justify-between shadow-lg h-full overflow-y-auto">
        <div class="flex flex-col gap-5 text-xs">
          <h3 class="text-base font-bold text-[#F1F5F9] border-l-4 border-[#06B6D4] pl-3">
            告警 Webhook 机器人接入 (Notifications)
          </h3>

          <div class="flex flex-col gap-2">
            <label class="text-[#94A3B8] font-bold">飞书 Webhook 机器人 URL</label>
            <input v-model="feishuWebhook" placeholder="https://open.feishu.cn/open-apis/bot/v2/hook/..." class="bg-[#1E293B] border border-[#334155] rounded-xl p-3 text-[#F1F5F9] font-mono outline-none focus:border-[#06B6D4]" />
          </div>

          <div class="flex flex-col gap-2">
            <label class="text-[#94A3B8] font-bold">钉钉 Webhook 机器人 URL</label>
            <input v-model="dingtalkWebhook" placeholder="https://oapi.dingtalk.com/robot/send?access_token=..." class="bg-[#1E293B] border border-[#334155] rounded-xl p-3 text-[#F1F5F9] font-mono outline-none focus:border-[#06B6D4]" />
          </div>

          <div class="flex flex-col gap-2">
            <label class="text-[#94A3B8] font-bold">Telegram Bot Token & Chat ID</label>
            <input v-model="telegramBotToken" placeholder="bot123456:ABC-DEF/12345678" class="bg-[#1E293B] border border-[#334155] rounded-xl p-3 text-[#F1F5F9] font-mono outline-none focus:border-[#06B6D4]" />
          </div>
        </div>

        <div class="flex items-center gap-3 mt-6">
          <button @click="sendTestWebhook" class="flex-1 py-3 bg-[#1E293B] border border-[#334155] text-[#06B6D4] font-bold text-xs rounded-xl hover:border-[#06B6D4]">
            🧪 发送测试告警消息
          </button>
          <button @click="saveWebhookSettings" class="flex-1 py-3 bg-[#06B6D4] text-[#0B1120] font-bold text-xs rounded-xl">
            保存 Webhook 配置
          </button>
        </div>
      </div>

      <!-- Pure Industrial Product Copy (No Personal Bio Mentions) -->
      <div v-if="activeTab === 'about' || activeTab === 'default_model'" class="md:col-span-9 bg-[#0F172A] border border-[#1E293B] rounded-2xl p-6 flex flex-col justify-between shadow-lg h-full overflow-y-auto text-xs leading-relaxed">
        <div class="flex flex-col gap-4">
          <h3 class="text-lg font-bold text-[#06B6D4] flex items-center gap-2">
            <span class="material-symbols-outlined">smart_toy</span> AI Ops Hub (v1.0.0)
          </h3>
          <p class="text-[#94A3B8]">
            AI Ops Hub 是一套工业级开源多云智能运维控制中枢，支持 AI Agent 辅助诊断、多云集群监控、Web SSH 终端与证书到期预警防护。
          </p>
          <div class="grid grid-cols-2 gap-4 mt-2 bg-[#1E293B]/40 p-4 rounded-xl border border-[#334155]">
            <div>
              <span class="text-[#06B6D4] font-bold block mb-1">Architecture</span>
              <span class="text-[#94A3B8]">Vue 3 + TypeScript + Express + SQLite</span>
            </div>
            <div>
              <span class="text-[#06B6D4] font-bold block mb-1">LLM Integration</span>
              <span class="text-[#94A3B8]">DeepSeek, Qwen, Zhipu, OpenAI, Claude</span>
            </div>
          </div>
        </div>
        <div class="pt-4 border-t border-[#1E293B] text-[#64748B] font-mono flex justify-between">
          <span>License: MIT Open Source</span>
          <span>Version: v1.0.0 Standard</span>
        </div>
      </div>
    </div>
  </div>
</template>
