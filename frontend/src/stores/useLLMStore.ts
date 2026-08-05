import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface LLMProvider {
  id: string;
  name: string;
  category: 'domestic' | 'international' | 'local';
  icon: string;
  baseUrl: string;
  apiKey: string;
  selectedModel: string;
  availableModels: string[];
  status: 'connected' | 'unconfigured' | 'error';
  latency?: number;
}

export const useLLMStore = defineStore('llm', () => {
  const providers = ref<LLMProvider[]>([
    {
      id: 'qwen',
      name: '通义千问 (Qwen / DashScope)',
      category: 'domestic',
      icon: 'smart_toy',
      baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
      apiKey: '',
      selectedModel: 'qwen-max',
      availableModels: ['qwen-max', 'qwen-plus', 'qwen-turbo', 'qwen-coder-turbo'],
      status: 'unconfigured'
    },
    {
      id: 'deepseek',
      name: 'DeepSeek (深度求索)',
      category: 'domestic',
      icon: 'psychology',
      baseUrl: 'https://api.deepseek.com/v1',
      apiKey: '',
      selectedModel: 'deepseek-chat',
      availableModels: ['deepseek-chat', 'deepseek-coder', 'deepseek-reasoner'],
      status: 'unconfigured'
    },
    {
      id: 'zhipu',
      name: '智谱清言 (GLM-4)',
      category: 'domestic',
      icon: 'auto_awesome',
      baseUrl: 'https://open.bigmodel.cn/api/paas/v4',
      apiKey: '',
      selectedModel: 'glm-4-flash',
      availableModels: ['glm-4-flash', 'glm-4-plus', 'glm-4-air'],
      status: 'unconfigured'
    },
    {
      id: 'kimi',
      name: '月之暗面 (Kimi / Moonshot)',
      category: 'domestic',
      icon: 'dark_mode',
      baseUrl: 'https://api.moonshot.cn/v1',
      apiKey: '',
      selectedModel: 'moonshot-v1-8k',
      availableModels: ['moonshot-v1-8k', 'moonshot-v1-32k'],
      status: 'unconfigured'
    },
    {
      id: 'openai',
      name: 'OpenAI (GPT-4o)',
      category: 'international',
      icon: 'bolt',
      baseUrl: 'https://api.openai.com/v1',
      apiKey: '',
      selectedModel: 'gpt-4o',
      availableModels: ['gpt-4o', 'gpt-4o-mini', 'gpt-3.5-turbo'],
      status: 'unconfigured'
    },
    {
      id: 'claude',
      name: 'Anthropic Claude',
      category: 'international',
      icon: 'terminal',
      baseUrl: 'https://api.anthropic.com/v1',
      apiKey: '',
      selectedModel: 'claude-3-5-sonnet-20241022',
      availableModels: ['claude-3-5-sonnet-20241022', 'claude-3-haiku'],
      status: 'unconfigured'
    },
    {
      id: 'ollama',
      name: 'Ollama (本地私有化)',
      category: 'local',
      icon: 'dns',
      baseUrl: 'http://localhost:11434/v1',
      apiKey: 'ollama-local',
      selectedModel: 'llama3:latest',
      availableModels: ['llama3:latest', 'qwen2.5-coder:7b', 'deepseek-r1:7b'],
      status: 'connected',
      latency: 2
    }
  ])

  const activeProviderId = ref<string>(localStorage.getItem('ai_ops_active_llm') || 'qwen')

  const activeProvider = computed(() => {
    return providers.value.find(p => p.id === activeProviderId.value) || providers.value[0]
  })

  function loadSavedKeys() {
    try {
      const saved = localStorage.getItem('ai_ops_llm_keys')
      if (saved) {
        const parsed = JSON.parse(saved)
        providers.value.forEach(p => {
          if (parsed[p.id]) {
            p.apiKey = parsed[p.id].apiKey || ''
            p.baseUrl = parsed[p.id].baseUrl || p.baseUrl
            p.selectedModel = parsed[p.id].selectedModel || p.selectedModel
            p.status = parsed[p.id].apiKey ? 'connected' : p.status
          }
        })
      }
    } catch (e) {
      console.warn('Failed to load LLM keys')
    }
  }

  function saveProviderConfig(providerId: string, apiKey: string, baseUrl: string, selectedModel: string) {
    const p = providers.value.find(item => item.id === providerId)
    if (p) {
      p.apiKey = apiKey
      p.baseUrl = baseUrl
      p.selectedModel = selectedModel
      p.status = apiKey ? 'connected' : 'unconfigured'
      p.latency = Math.floor(Math.random() * 50 + 20)
    }

    const saveObj: Record<string, any> = {}
    providers.value.forEach(item => {
      saveObj[item.id] = {
        apiKey: item.apiKey,
        baseUrl: item.baseUrl,
        selectedModel: item.selectedModel
      }
    })
    localStorage.setItem('ai_ops_llm_keys', JSON.stringify(saveObj))
  }

  function setActiveProvider(providerId: string) {
    activeProviderId.value = providerId
    localStorage.setItem('ai_ops_active_llm', providerId)
  }

  loadSavedKeys()

  return {
    providers,
    activeProviderId,
    activeProvider,
    saveProviderConfig,
    setActiveProvider
  }
})
