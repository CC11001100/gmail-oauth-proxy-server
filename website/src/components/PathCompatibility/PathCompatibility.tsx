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
  const { needsRedirect, smartRedirect } = usePathCompatibility();

  useEffect(() => {
    // 如果当前路径需要重定向，进行智能重定向
    if (needsRedirect()) {
      smartRedirect('/');
    }
  }, [needsRedirect, smartRedirect]);

  return <>{children}</>;
};

export default PathCompatibility; 