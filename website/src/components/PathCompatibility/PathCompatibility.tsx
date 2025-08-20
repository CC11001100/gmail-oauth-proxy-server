import { useEffect } from 'react';
import { usePathCompatibility } from '../../hooks/usePathCompatibility';

interface PathCompatibilityProps {
  children: React.ReactNode;
}

/**
 * 路径兼容性组件
 * 处理不同路径格式的访问，确保用户体验一致
 */
const PathCompatibility: React.FC<PathCompatibilityProps> = ({ children }) => {
  const { currentPath, hasBase } = usePathCompatibility();

  useEffect(() => {
    // 只在生产环境下进行路径检测，不进行自动重定向
    if (window.location.hostname === 'cc11001100.github.io') {
      console.log('路径兼容性：当前路径', { currentPath, hasBase });
    }
  }, [currentPath, hasBase]);

  return <>{children}</>;
};

export default PathCompatibility; 