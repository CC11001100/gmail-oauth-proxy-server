import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * 路径兼容性Hook
 * 提供基本的路径检测功能，不进行重定向
 */
export const usePathCompatibility = () => {
  const location = useLocation();
  const [currentPath, setCurrentPath] = useState(location.pathname);
  const [hasBase, setHasBase] = useState(false);

  // 检测路径变化
  useEffect(() => {
    const path = location.pathname;
    setCurrentPath(path);
    
    // 检测是否包含基础路径
    const hasBasePath = path.startsWith('/gmail-oauth-proxy-server');
    setHasBase(hasBasePath);
    
    // 只在生产环境下输出调试信息
    if (window.location.hostname === 'cc11001100.github.io') {
      console.log('路径兼容性：当前路径', { path, hasBasePath });
    }
  }, [location.pathname]);

  return {
    currentPath,
    hasBase,
    isRedirecting: false
  };
}; 