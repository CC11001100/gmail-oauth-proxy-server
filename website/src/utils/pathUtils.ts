/**
 * 路径处理工具
 * 根据部署环境动态处理路径前缀
 */

/**
 * 获取当前页面的完整路径
 */
export const getCurrentPath = (): string => {
  return window.location.pathname;
};

/**
 * 获取部署环境的基础路径
 */
export const getBasePath = (): string => {
  const hostname = window.location.hostname;
  
  // GitHub Pages环境
  if (hostname === 'cc11001100.github.io') {
    return '/gmail-oauth-proxy-server';
  }
  
  // 自定义域名环境 - 当前网站部署在子路径下
  if (hostname === 'www.cc11001100.com' || hostname === 'cc11001100.com') {
    // 这个项目总是部署在 /gmail-oauth-proxy-server/ 路径下
    return '/gmail-oauth-proxy-server';
  }
  
  // 开发环境
  return '';
};

/**
 * 从完整路径中移除base路径前缀
 */
export const fromBasePath = (path: string): string => {
  const basePath = getBasePath();
  if (basePath && path.startsWith(basePath)) {
    return path.substring(basePath.length) || '/';
  }
  return path;
};

/**
 * 为给定路径添加合适的base路径前缀
 */
export const getOptimalPath = (path: string): string => {
  const basePath = getBasePath();
  
  // 如果没有基础路径，直接返回原路径
  if (!basePath) {
    return path;
  }
  
  // 如果路径已经包含基础路径，直接返回
  if (path.startsWith(basePath)) {
    return path;
  }
  
  // 添加基础路径前缀
  // 确保路径以 / 开头
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${basePath}${normalizedPath}`;
};

/**
 * 检查是否需要重定向（暂时不需要）
 */
export const needsRedirect = (): boolean => {
  return false;
}; 