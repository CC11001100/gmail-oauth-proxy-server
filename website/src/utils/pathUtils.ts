/**
 * 路径处理工具
 * 简化版本 - 由Vite的base配置统一处理路径前缀
 */

/**
 * 获取当前页面的完整路径
 */
export const getCurrentPath = (): string => {
  return window.location.pathname;
};

/**
 * 获取部署环境的基础路径
 * 注意：现在由Vite的base配置统一处理，这里主要用于调试
 */
export const getBasePath = (): string => {
  const hostname = window.location.hostname;
  
  // 开发环境
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return '';
  }
  
  // 生产环境 - 由Vite配置处理
  return '/gmail-oauth-proxy-server';
};

/**
 * 从完整路径中移除base路径前缀（用于调试）
 */
export const fromBasePath = (path: string): string => {
  const basePath = getBasePath();
  if (basePath && path.startsWith(basePath)) {
    return path.substring(basePath.length) || '/';
  }
  return path;
};

/**
 * 简化路径处理 - 不再需要手动添加base路径
 */
export const getOptimalPath = (path: string): string => {
  // 现在由Vite和Router统一处理，直接返回原路径
  return path;
};

/**
 * 检查是否需要重定向（暂时不需要）
 */
export const needsRedirect = (): boolean => {
  return false;
}; 