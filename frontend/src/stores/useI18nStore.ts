import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { zhCN, enUS, LocaleMessages } from '../i18n/locales'

export const useI18nStore = defineStore('i18n', () => {
  const currentLang = ref<'zh-CN' | 'en-US'>((localStorage.getItem('ai_ops_lang') as 'zh-CN' | 'en-US') || 'zh-CN')

  const t = computed<LocaleMessages>(() => {
    return currentLang.value === 'zh-CN' ? zhCN : enUS
  })

  function setLanguage(lang: 'zh-CN' | 'en-US') {
    currentLang.value = lang
    localStorage.setItem('ai_ops_lang', lang)
    document.documentElement.lang = lang === 'zh-CN' ? 'zh-CN' : 'en'
  }

  function toggleLanguage() {
    setLanguage(currentLang.value === 'zh-CN' ? 'en-US' : 'zh-CN')
  }

  // Initialize lang attribute on DOM
  document.documentElement.lang = currentLang.value === 'zh-CN' ? 'zh-CN' : 'en'

  return {
    currentLang,
    t,
    setLanguage,
    toggleLanguage
  }
})
