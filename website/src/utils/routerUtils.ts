import { 
  BASE_PATH, 
  ROOT_PATH, 
  hasBasePath, 
  toBasePath, 
  fromBasePath 
} from './pathUtils';

/**
 * 路由工具
 * 用于智能处理不同路径格式的路由
 */

/**
 * 智能路由路径生成器
 * 根据当前环境自动选择最合适的路径格式
 */
export const createSmartRoute = (path: string): string => {
  // 如果路径已经包含基础路径，直接返回
  if (hasBasePath(path)) {
    return path;
  }
  
  // 如果路径以/开头，添加基础路径
  if (path.startsWith('/')) {
    return toBasePath(path);
  }
  
  // 否则添加基础路径和/
  return toBasePath(`/${path}`);
};

/**
 * 路由路径标准化
 * 确保所有路由路径都使用一致的格式
 */
export const normalizeRoutePath = (path: string): string => {
  // 移除开头的斜杠
  let normalizedPath = path.startsWith('/') ? path.substring(1) : path;
  
  // 移除结尾的斜杠（除了根路径）
  if (normalizedPath !== '' && normalizedPath.endsWith('/')) {
    normalizedPath = normalizedPath.slice(0, -1);
  }
  
  return normalizedPath;
};

/**
 * 生成完整的路由路径
 */
export const getFullRoutePath = (path: string): string => {
  const normalizedPath = normalizeRoutePath(path);
  return normalizedPath === '' ? BASE_PATH : `${BASE_PATH}/${normalizedPath}`;
};

/**
 * 路由配置生成器
 * 自动生成支持多路径格式的路由配置
 */
export const createRouteConfig = (basePath: string, routes: Array<{ path: string; element: React.ReactNode }>) => {
  return routes.map(route => ({
    ...route,
    path: route.path === '/' ? basePath : `${basePath}${route.path}`
  }));
};

/**
 * 路径匹配器
 * 检查给定路径是否匹配指定的路由模式
 */
export const matchRoute = (path: string, pattern: string): boolean => {
  const normalizedPath = normalizeRoutePath(path);
  const normalizedPattern = normalizeRoutePath(pattern);
  
  // 精确匹配
  if (normalizedPattern === normalizedPath) {
    return true;
  }
  
  // 通配符匹配
  if (normalizedPattern.endsWith('*')) {
    const patternBase = normalizedPattern.slice(0, -1);
    return normalizedPath.startsWith(patternBase);
  }
  
  return false;
};

/**
 * 获取路由参数
 * 从路径中提取路由参数
 */
export const extractRouteParams = (path: string, pattern: string): Record<string, string> => {
  const params: Record<string, string> = {};
  
  // 简单的参数提取逻辑
  const pathParts = path.split('/').filter(Boolean);
  const patternParts = pattern.split('/').filter(Boolean);
  
  for (let i = 0; i < Math.min(pathParts.length, patternParts.length); i++) {
    const patternPart = patternParts[i];
    if (patternPart.startsWith(':')) {
      const paramName = patternPart.substring(1);
      params[paramName] = pathParts[i];
    }
  }
  
  return params;
}; 