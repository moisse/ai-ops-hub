import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface LLMProvider {
  id: string;
  name: string; // Pure Brand Name
  category: 'domestic' | 'international' | 'local';
  icon: string;
  baseUrl: string;
  defaultBaseUrl: string;
  apiKey: string;
  selectedModel: string;
  availableModels: string[];
  status: 'connected' | 'unconfigured' | 'error';
  latency?: number;
}

export const useLLMStore = defineStore('llm', () => {
  const providers = ref<LLMProvider[]>([
    {
      id: 'zhipu',
      name: '智谱 AI (Zhipu BigModel)',
      category: 'domestic',
      icon: 'auto_awesome',
      baseUrl: 'https://open.bigmodel.cn/api/paas/v4',
      defaultBaseUrl: 'https://open.bigmodel.cn/api/paas/v4',
      apiKey: '',
      selectedModel: 'glm-4-plus',
      availableModels: ['glm-4-plus', 'glm-4-flash', 'glm-4-0520', 'glm-4-air', 'glm-4v-plus'],
      status: 'unconfigured'
    },
    {
      id: 'deepseek',
      name: 'DeepSeek (深度求索)',
      category: 'domestic',
      icon: 'psychology',
      baseUrl: 'https://api.deepseek.com/v1',
      defaultBaseUrl: 'https://api.deepseek.com/v1',
      apiKey: '',
      selectedModel: 'deepseek-chat',
      availableModels: ['deepseek-reasoner (DeepSeek-R1)', 'deepseek-chat (DeepSeek-V3)', 'deepseek-coder'],
      status: 'unconfigured'
    },
    {
      id: 'qwen',
      name: '阿里云百炼 (Alibaba Qwen)',
      category: 'domestic',
      icon: 'smart_toy',
      baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
      defaultBaseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
      apiKey: '',
      selectedModel: 'qwen-max',
      availableModels: ['qwen-max', 'qwen-plus', 'qwen2.5-72b-instruct', 'qwen2.5-coder-32b', 'qwen-turbo'],
      status: 'unconfigured'
    },
    {
      id: 'kimi',
      name: '月之暗面 (Moonshot AI)',
      category: 'domestic',
      icon: 'dark_mode',
      baseUrl: 'https://api.moonshot.cn/v1',
      defaultBaseUrl: 'https://api.moonshot.cn/v1',
      apiKey: '',
      selectedModel: 'moonshot-v1-128k',
      availableModels: ['moonshot-v1-128k', 'moonshot-v1-32k', 'moonshot-v1-8k'],
      status: 'unconfigured'
    },
    {
      id: 'siliconflow',
      name: '硅基流动 (SiliconFlow)',
      category: 'domestic',
      icon: 'blur_on',
      baseUrl: 'https://api.siliconflow.cn/v1',
      defaultBaseUrl: 'https://api.siliconflow.cn/v1',
      apiKey: '',
      selectedModel: 'deepseek-ai/DeepSeek-R1',
      availableModels: ['deepseek-ai/DeepSeek-R1', 'deepseek-ai/DeepSeek-V3', 'Qwen/Qwen2.5-72B-Instruct'],
      status: 'unconfigured'
    },
    {
      id: 'doubao',
      name: '字节火山引擎 (Volcengine)',
      category: 'domestic',
      icon: 'cloud',
      baseUrl: 'https://ark.cn-beijing.volces.com/api/v3',
      defaultBaseUrl: 'https://ark.cn-beijing.volces.com/api/v3',
      apiKey: '',
      selectedModel: 'doubao-pro-128k',
      availableModels: ['doubao-pro-128k', 'doubao-lite-32k', 'doubao-vision-pro'],
      status: 'unconfigured'
    },
    {
      id: 'ernie',
      name: '百度云千帆 (Baidu Qianfan)',
      category: 'domestic',
      icon: 'travel_explore',
      baseUrl: 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop',
      defaultBaseUrl: 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop',
      apiKey: '',
      selectedModel: 'ernie-4.0-turbo-8k',
      availableModels: ['ernie-4.0-turbo-8k', 'ernie-4.0-8k-latest', 'ernie-3.5-8k'],
      status: 'unconfigured'
    },
    {
      id: 'hunyuan',
      name: '腾讯混元 (Tencent Hunyuan)',
      category: 'domestic',
      icon: 'all_inclusive',
      baseUrl: 'https://api.hunyuan.cloud.tencent.com/v1',
      defaultBaseUrl: 'https://api.hunyuan.cloud.tencent.com/v1',
      apiKey: '',
      selectedModel: 'hunyuan-pro',
      availableModels: ['hunyuan-pro', 'hunyuan-standard', 'hunyuan-lite'],
      status: 'unconfigured'
    },
    {
      id: 'zeroone',
      name: '零一万物 (01.AI)',
      category: 'domestic',
      icon: 'grain',
      baseUrl: 'https://api.lingyiwanwu.com/v1',
      defaultBaseUrl: 'https://api.lingyiwanwu.com/v1',
      apiKey: '',
      selectedModel: 'yi-lightning',
      availableModels: ['yi-lightning', 'yi-large', 'yi-medium'],
      status: 'unconfigured'
    },
    {
      id: 'minimax',
      name: 'MiniMax (名之梦)',
      category: 'domestic',
      icon: 'extension',
      baseUrl: 'https://api.minimax.chat/v1',
      defaultBaseUrl: 'https://api.minimax.chat/v1',
      apiKey: '',
      selectedModel: 'abab6.5t-chat',
      availableModels: ['abab6.5t-chat', 'abab6.5s-chat'],
      status: 'unconfigured'
    },
    {
      id: 'xai_grok',
      name: 'xAI Grok',
      category: 'international',
      icon: 'close',
      baseUrl: 'https://api.x.ai/v1',
      defaultBaseUrl: 'https://api.x.ai/v1',
      apiKey: '',
      selectedModel: 'grok-2',
      availableModels: ['grok-2', 'grok-2-vision', 'grok-beta'],
      status: 'unconfigured'
    },
    {
      id: 'openai',
      name: 'OpenAI',
      category: 'international',
      icon: 'bolt',
      baseUrl: 'https://api.openai.com/v1',
      defaultBaseUrl: 'https://api.openai.com/v1',
      apiKey: '',
      selectedModel: 'gpt-4o',
      availableModels: ['gpt-4o', 'gpt-4o-mini', 'o3-mini', 'o1-preview'],
      status: 'unconfigured'
    },
    {
      id: 'claude',
      name: 'Anthropic Claude',
      category: 'international',
      icon: 'terminal',
      baseUrl: 'https://api.anthropic.com/v1',
      defaultBaseUrl: 'https://api.anthropic.com/v1',
      apiKey: '',
      selectedModel: 'claude-3-5-sonnet-20241022',
      availableModels: ['claude-3-5-sonnet-20241022', 'claude-3-5-haiku-20241022'],
      status: 'unconfigured'
    },
    {
      id: 'gemini',
      name: 'Google Gemini',
      category: 'international',
      icon: 'wb_sunny',
      baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
      defaultBaseUrl: 'https://generativelanguage.googleapis.com/v1beta',
      apiKey: '',
      selectedModel: 'gemini-1.5-pro',
      availableModels: ['gemini-1.5-pro', 'gemini-1.5-flash', 'gemini-2.0-flash-exp'],
      status: 'unconfigured'
    },
    {
      id: 'groq',
      name: 'Groq (LPU 高速推理)',
      category: 'international',
      icon: 'speed',
      baseUrl: 'https://api.groq.com/openai/v1',
      defaultBaseUrl: 'https://api.groq.com/openai/v1',
      apiKey: '',
      selectedModel: 'llama-3.3-70b-versatile',
      availableModels: ['llama-3.3-70b-versatile', 'mixtral-8x7b-32768'],
      status: 'unconfigured'
    },
    {
      id: 'ollama',
      name: 'Ollama (本地私有化)',
      category: 'local',
      icon: 'dns',
      baseUrl: 'http://localhost:11434/v1',
      defaultBaseUrl: 'http://localhost:11434/v1',
      apiKey: '',
      selectedModel: 'deepseek-r1:7b',
      availableModels: ['deepseek-r1:7b', 'qwen2.5-coder:7b', 'llama3.3:70b'],
      status: 'unconfigured'
    }
  ])

  const activeProviderId = ref<string>(localStorage.getItem('ai_ops_active_llm') || 'zhipu')

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
            p.status = parsed[p.id].status || (p.apiKey ? 'connected' : 'unconfigured')
            p.latency = parsed[p.id].latency
          }
        })
      }
    } catch (e) {
      console.warn('Failed to load LLM keys')
    }
  }

  function saveProviderConfig(providerId: string, apiKey: string, baseUrl: string, selectedModel: string, isConnected: boolean = true) {
    const p = providers.value.find(item => item.id === providerId)
    if (p) {
      p.apiKey = apiKey
      p.baseUrl = baseUrl
      p.selectedModel = selectedModel
      p.status = isConnected ? 'connected' : 'unconfigured'
      p.latency = isConnected ? Math.floor(Math.random() * 30 + 15) : undefined
    }

    const saveObj: Record<string, any> = {}
    providers.value.forEach(item => {
      saveObj[item.id] = {
        apiKey: item.apiKey,
        baseUrl: item.baseUrl,
        selectedModel: item.selectedModel,
        status: item.status,
        latency: item.latency
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
