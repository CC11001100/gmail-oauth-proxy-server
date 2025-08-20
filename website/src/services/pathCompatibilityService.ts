import { 
  BASE_PATH, 
  ROOT_PATH, 
  hasBasePath, 
  toBasePath, 
  fromBasePath,
  isDevelopment,
  isProduction 
} from '../utils/pathUtils';

/**
 * 路径兼容性服务
 * 提供智能的路径处理、重定向和兼容性支持
 */
class PathCompatibilityService {
  private static instance: PathCompatibilityService;
  private isInitialized = false;

  private constructor() {}

  /**
   * 获取单例实例
   */
  public static getInstance(): PathCompatibilityService {
    if (!PathCompatibilityService.instance) {
      PathCompatibilityService.instance = new PathCompatibilityService();
    }
    return PathCompatibilityService.instance;
  }

  /**
   * 初始化服务
   */
  public initialize(): void {
    if (this.isInitialized) {
      return;
    }

    // 监听路径变化
    this.setupPathListener();
    
    // 处理初始路径
    this.handleInitialPath();
    
    this.isInitialized = true;
  }

  /**
   * 设置路径监听器
   */
  private setupPathListener(): void {
    // 监听popstate事件（浏览器前进后退）
    window.addEventListener('popstate', () => {
      this.handlePathChange();
    });

    // 监听pushstate和replacestate事件
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = (...args) => {
      originalPushState.apply(history, args);
      this.handlePathChange();
    };

    history.replaceState = (...args) => {
      originalReplaceState.apply(history, args);
      this.handlePathChange();
    };
  }

  /**
   * 处理初始路径
   */
  private handleInitialPath(): void {
    // 开发环境下不需要处理
    if (isDevelopment()) {
      return;
    }

    const currentPath = window.location.pathname;
    
    // 如果访问根路径，智能重定向
    if (currentPath === '/' || currentPath === '') {
      this.smartRedirect('/');
      return;
    }

    // 如果访问的是带base的路径，保持原样
    if (hasBasePath(currentPath)) {
      return;
    }

    // 如果访问的是其他路径，尝试重定向到对应的带base路径
    if (currentPath.startsWith('/') && currentPath !== '/') {
      this.smartRedirect(currentPath);
      return;
    }
  }

  /**
   * 处理路径变化
   */
  private handlePathChange(): void {
    // 开发环境下不需要处理
    if (isDevelopment()) {
      return;
    }

    const currentPath = window.location.pathname;
    
    // 如果路径已经包含base，不需要处理
    if (hasBasePath(currentPath)) {
      return;
    }

    // 如果访问根路径，智能重定向
    if (currentPath === '/' || currentPath === '') {
      this.smartRedirect('/');
      return;
    }

    // 如果访问的是其他路径，尝试重定向到对应的带base路径
    if (currentPath.startsWith('/') && currentPath !== '/') {
      this.smartRedirect(currentPath);
      return;
    }
  }

  /**
   * 智能路径重定向
   * 根据当前环境自动选择最合适的路径格式
   */
  public smartRedirect(targetPath: string = '/'): void {
    const currentPath = window.location.pathname;
    
    // 如果当前路径已经包含基础路径，则使用基础路径格式
    if (hasBasePath(currentPath)) {
      const fullPath = toBasePath(targetPath);
      this.redirectTo(fullPath);
    } else {
      // 否则使用根路径格式
      this.redirectTo(targetPath);
    }
  }

  /**
   * 重定向到指定路径
   */
  private redirectTo(path: string): void {
    // 使用replaceState避免在历史记录中留下重定向记录
    window.history.replaceState(null, '', path);
    
    // 触发路径变化事件
    window.dispatchEvent(new PopStateEvent('popstate'));
  }

  /**
   * 检查当前路径是否需要重定向
   */
  public needsRedirect(): boolean {
    // 开发环境下不需要重定向
    if (isDevelopment()) {
      return false;
    }

    const currentPath = window.location.pathname;
    
    // 生产环境下，如果访问根路径且配置了基础路径，则需要重定向
    if (currentPath === '/' || currentPath === '') {
      return true;
    }

    return false;
  }

  /**
   * 获取最适合当前环境的路径
   */
  public getOptimalPath(path: string): string {
    const currentPath = window.location.pathname;
    
    if (hasBasePath(currentPath)) {
      return toBasePath(path);
    }
    
    return path;
  }

  /**
   * 强制重定向到基础路径
   */
  public forceRedirectToBase(): void {
    if (isDevelopment()) {
      return;
    }

    const currentPath = window.location.pathname;
    if (!hasBasePath(currentPath)) {
      const basePath = toBasePath(currentPath === '/' ? '/' : currentPath);
      this.redirectTo(basePath);
    }
  }

  /**
   * 清理服务
   */
  public cleanup(): void {
    this.isInitialized = false;
  }
}

export default PathCompatibilityService; 