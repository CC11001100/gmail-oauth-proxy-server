import { type ReactNode } from 'react';
import { Routes, Route } from 'react-router-dom';

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
 * 使用标准的路由配置，避免复杂的路径处理
 */
const SmartRouter: React.FC<SmartRouterProps> = ({ routes, fallback }) => {
  return (
    <Routes>
      {routes.map((route, index) => (
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