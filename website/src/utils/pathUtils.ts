/**
 * 路径处理工具
 * 用于智能处理不同路径格式，确保路径兼容性
 */

// 基础路径配置
export const BASE_PATH = '/gmail-oauth-proxy-server';
export const ROOT_PATH = '/';

/**
 * 检测当前环境是否为开发环境
 */
export const isDevelopment = () => {
  return import.meta.env.DEV;
};

/**
 * 检测当前环境是否为生产环境
 */
export const isProduction = () => {
  return import.meta.env.PROD;
};

/**
 * 获取当前页面的完整路径
 */
export const getCurrentPath = (): string => {
  return window.location.pathname;
};

/**
 * 检测当前路径是否包含基础路径
 */
export const hasBasePath = (path: string = getCurrentPath()): boolean => {
  return path.startsWith(BASE_PATH);
};

/**
 * 将相对路径转换为包含基础路径的完整路径
 */
export const toBasePath = (path: string): string => {
  if (path.startsWith('/')) {
    return `${BASE_PATH}${path}`;
  }
  return `${BASE_PATH}/${path}`;
};

/**
 * 将包含基础路径的路径转换为相对路径
 */
export const fromBasePath = (path: string): string => {
  if (path.startsWith(BASE_PATH)) {
    return path.substring(BASE_PATH.length) || '/';
  }
  return path;
};

/**
 * 智能路径重定向
 * 根据当前路径自动选择最合适的路径格式
 */
export const smartRedirect = (targetPath: string = '/'): void => {
  const currentPath = getCurrentPath();
  
  // 如果当前路径已经包含基础路径，则使用基础路径格式
  if (hasBasePath(currentPath)) {
    const fullPath = toBasePath(targetPath);
    window.history.replaceState(null, '', fullPath);
  } else {
    // 否则使用根路径格式
    window.history.replaceState(null, '', targetPath);
  }
};

/**
 * 获取最适合当前环境的路径
 */
export const getOptimalPath = (path: string): string => {
  const currentPath = getCurrentPath();
  
  if (hasBasePath(currentPath)) {
    return toBasePath(path);
  }
  
  return path;
};

/**
 * 路径兼容性检查
 * 检查当前路径是否需要重定向
 */
export const needsRedirect = (): boolean => {
  const currentPath = getCurrentPath();
  
  // 开发环境下不需要重定向
  if (isDevelopment()) {
    return false;
  }
  
  // 生产环境下，如果访问根路径且配置了基础路径，则需要重定向
  if (currentPath === '/' || currentPath === '') {
    return true;
  }
  
  return false;
}; 