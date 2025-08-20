/**
 * 生成安全的API密钥
 * @param length 密钥长度，默认32位
 * @returns 生成的API密钥
 */
export const generateApiKey = (length: number = 32): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  // 确保至少包含一个大写字母、一个小写字母和一个数字
  result += chars.charAt(Math.floor(Math.random() * 26)); // 大写字母
  result += chars.charAt(26 + Math.floor(Math.random() * 26)); // 小写字母
  result += chars.charAt(52 + Math.floor(Math.random() * 10)); // 数字
  
  // 填充剩余长度
  for (let i = 3; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  // 打乱字符顺序
  return result.split('').sort(() => Math.random() - 0.5).join('');
};

/**
 * 从LocalStorage获取或生成新的API密钥
 * @param storageKey LocalStorage的键名
 * @returns API密钥
 */
export const getOrGenerateApiKey = (storageKey: string = 'gmail-oauth-proxy-api-key'): string => {
  try {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      return stored;
    }
    
    // 如果没有存储的密钥，生成一个新的
    const newKey = generateApiKey();
    localStorage.setItem(storageKey, newKey);
    return newKey;
  } catch {
    // 如果LocalStorage不可用，返回生成的密钥
    console.warn('LocalStorage not available, generating new API key');
    return generateApiKey();
  }
};

/**
 * 重新生成API密钥并存储到LocalStorage
 * @param storageKey LocalStorage的键名
 * @returns 新生成的API密钥
 */
export const regenerateApiKey = (storageKey: string = 'gmail-oauth-proxy-api-key'): string => {
  const newKey = generateApiKey();
  try {
    localStorage.setItem(storageKey, newKey);
  } catch {
    console.warn('Failed to save API key to LocalStorage');
  }
  return newKey;
}; 