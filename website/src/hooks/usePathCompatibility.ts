import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  hasBasePath, 
  toBasePath, 
  fromBasePath,
  isDevelopment 
} from '../utils/pathUtils';

/**
 * 路径兼容性Hook
 * 提供路径检测、重定向和兼容性功能
 */
export const usePathCompatibility = () => {
  const location = useLocation();
  const [currentPath, setCurrentPath] = useState(location.pathname);
  const [hasBase, setHasBase] = useState(hasBasePath(location.pathname));
  const [isRedirecting, setIsRedirecting] = useState(false);

  // 检测路径变化
  useEffect(() => {
    const path = location.pathname;
    setCurrentPath(path);
    setHasBase(hasBasePath(path));
  }, [location.pathname]);

  // 智能路径重定向
  const smartRedirect = useCallback((targetPath: string = '/') => {
    // 开发环境下不需要重定向
    if (isDevelopment()) {
      return;
    }

    setIsRedirecting(true);
    
    try {
      // 如果当前路径包含基础路径，则使用基础路径格式
      if (hasBase) {
        const fullPath = toBasePath(targetPath);
        window.history.replaceState(null, '', fullPath);
      } else {
        // 否则使用根路径格式
        window.history.replaceState(null, '', targetPath);
      }
      
      // 触发路径变化事件
      window.dispatchEvent(new PopStateEvent('popstate'));
    } catch (error) {
      console.error('路径重定向失败:', error);
    } finally {
      setIsRedirecting(false);
    }
  }, [hasBase]);

  // 强制重定向到基础路径
  const forceRedirectToBase = useCallback(() => {
    if (isDevelopment()) {
      return;
    }

    setIsRedirecting(true);
    
    try {
      const basePath = toBasePath(currentPath === '/' ? '/' : currentPath);
      window.history.replaceState(null, '', basePath);
      window.dispatchEvent(new PopStateEvent('popstate'));
    } catch (error) {
      console.error('强制重定向失败:', error);
    } finally {
      setIsRedirecting(false);
    }
  }, [currentPath]);

  // 检查是否需要重定向
  const needsRedirect = useCallback(() => {
    // 开发环境下不需要重定向
    if (isDevelopment()) {
      return false;
    }

    // 生产环境下，如果访问根路径且配置了基础路径，则需要重定向
    if (currentPath === '/' || currentPath === '') {
      return true;
    }

    return false;
  }, [currentPath]);

  // 获取最适合当前环境的路径
  const getOptimalPath = useCallback((path: string) => {
    if (hasBase) {
      return toBasePath(path);
    }
    return path;
  }, [hasBase]);

  // 路径转换工具
  const toBase = useCallback((path: string) => toBasePath(path), []);
  const fromBase = useCallback((path: string) => fromBasePath(path), []);

  return {
    // 状态
    currentPath,
    hasBase,
    isRedirecting,
    
    // 方法
    smartRedirect,
    forceRedirectToBase,
    needsRedirect,
    getOptimalPath,
    toBase,
    fromBase,
    
    // 工具函数
    hasBasePath: () => hasBase,
    isDevelopment: () => isDevelopment()
  };
}; 