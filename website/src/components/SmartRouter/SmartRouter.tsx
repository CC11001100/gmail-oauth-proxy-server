import { type ReactNode } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { 
  hasBasePath, 
  toBasePath, 
  fromBasePath,
  isDevelopment 
} from '../../utils/pathUtils';

interface RouteConfig {
  path: string;
  element: ReactNode;
}

interface SmartRouterProps {
  routes: RouteConfig[];
  fallback?: ReactNode;
}

/**
 * 智能路由组件
 * 自动处理不同路径格式，确保路由兼容性
 */
const SmartRouter: React.FC<SmartRouterProps> = ({ routes, fallback }) => {
  const location = useLocation();

  // 智能路径处理
  const processPath = (path: string): string => {
    // 开发环境下保持原样
    if (isDevelopment()) {
      return path;
    }

    // 如果当前路径包含基础路径，则路由也需要包含
    if (hasBasePath(location.pathname)) {
      if (path === '/') {
        return '/gmail-oauth-proxy-server/';
      }
      return toBasePath(path);
    }

    // 否则使用原始路径
    return path;
  };

  // 生成智能路由配置
  const smartRoutes = routes.map(route => ({
    ...route,
    path: processPath(route.path)
  }));

  return (
    <Routes>
      {smartRoutes.map((route, index) => (
        <Route
          key={index}
          path={route.path}
          element={route.element}
        />
      ))}
      {fallback && (
        <Route path="*" element={fallback} />
      )}
    </Routes>
  );
};

export default SmartRouter; 