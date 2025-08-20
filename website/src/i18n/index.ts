import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en.json';
import zh from './zh.json';

const resources = {
  en: {
    translation: en
  },
  zh: {
    translation: zh
  }
};

// 获取用户的语言偏好
const getUserLanguage = (): string => {
  // 首先检查LocalStorage中是否有用户之前选择的语言
  const savedLanguage = localStorage.getItem('i18n-language');
  if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'zh')) {
    return savedLanguage;
  }

  // 如果没有保存的语言，则自动检测浏览器语言
  const browserLanguage = navigator.language || navigator.languages?.[0] || 'en';
  
  // 检测是否为中文（包括简体中文和繁体中文）
  if (browserLanguage.startsWith('zh')) {
    return 'zh';
  }
  
  // 默认返回英文
  return 'en';
};

// 获取检测到的语言
const detectedLanguage = getUserLanguage();

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: detectedLanguage,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

// 导出语言切换函数，用于在LanguageSwitcher中使用
export const changeLanguage = (language: string) => {
  i18n.changeLanguage(language);
  // 保存用户的语言选择到LocalStorage
  localStorage.setItem('i18n-language', language);
};

export default i18n;
