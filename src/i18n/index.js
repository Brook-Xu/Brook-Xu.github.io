import Vue from 'vue'
import VueI18n from 'vue-i18n'
import en from '../locales/en'
import zh from '../locales/zh'

Vue.use(VueI18n)

// 检测浏览器语言
function getBrowserLanguage() {
  const lang = navigator.language || navigator.userLanguage
  if (lang.startsWith('zh')) {
    return 'zh'
  }
  return 'en'
}

// 从localStorage获取保存的语言设置，默认为英文
function getSavedLanguage() {
  const savedLang = localStorage.getItem('starnet-language')
  if (savedLang) {
    return savedLang
  }
  // 如果没有保存的语言设置，默认使用英文
  return 'en'
}

// 保存语言设置到localStorage
function saveLanguage(lang) {
  localStorage.setItem('starnet-language', lang)
}

const i18n = new VueI18n({
  locale: getSavedLanguage(),
  fallbackLocale: 'en',
  messages: {
    en,
    zh
  }
})

// 导出语言切换函数
export function setLanguage(lang) {
  i18n.locale = lang
  saveLanguage(lang)
  // 更新HTML lang属性
  document.documentElement.lang = lang
}

// 导出获取当前语言的函数
export function getCurrentLanguage() {
  return i18n.locale
}

// 导出获取可用语言的函数
export function getAvailableLanguages() {
  return [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'zh', name: 'Chinese', nativeName: '中文' }
  ]
}

export default i18n
