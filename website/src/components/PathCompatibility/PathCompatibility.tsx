interface PathCompatibilityProps {
  children: React.ReactNode;
}

/**
 * 简化的路径兼容性组件 - 仅作为容器
 */
const PathCompatibility: React.FC<PathCompatibilityProps> = ({ children }) => {
  return <>{children}</>;
};

export default PathCompatibility; 