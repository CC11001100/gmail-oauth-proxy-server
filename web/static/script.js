// 多语言管理系统
class LanguageManager {
    constructor() {
        this.currentLanguage = 'en';
        this.supportedLanguages = ['en', 'zh'];
        this.translations = {};
        this.init();
    }

    init() {
        this.loadTranslations();
        this.detectLanguage();
        this.createLanguageSwitcher();
        this.applyTranslations();
    }

    // 检测用户语言偏好
    detectLanguage() {
        // 1. 检查localStorage中的保存的语言偏好
        const savedLanguage = localStorage.getItem('preferred-language');
        if (savedLanguage && this.supportedLanguages.includes(savedLanguage)) {
            this.currentLanguage = savedLanguage;
            return;
        }

        // 2. 检测浏览器语言
        const browserLanguage = navigator.language || navigator.userLanguage;
        if (browserLanguage.startsWith('zh')) {
            this.currentLanguage = 'zh';
        } else {
            this.currentLanguage = 'en';
        }

        // 保存检测到的语言
        this.saveLanguagePreference();
    }

    // 保存语言偏好
    saveLanguagePreference() {
        localStorage.setItem('preferred-language', this.currentLanguage);
    }

    // 切换语言
    switchLanguage(language) {
        if (!this.supportedLanguages.includes(language)) {
            console.warn(`Unsupported language: ${language}`);
            return;
        }

        this.currentLanguage = language;
        this.saveLanguagePreference();
        this.applyTranslations();
        this.updateLanguageSwitcher();
    }

    // 创建语言切换器
    createLanguageSwitcher() {
        const header = document.querySelector('.header-content');
        if (!header) return;

        const languageSwitcher = document.createElement('div');
        languageSwitcher.className = 'language-switcher';
        languageSwitcher.innerHTML = `
            <button class="lang-btn ${this.currentLanguage === 'en' ? 'active' : ''}" data-lang="en">
                <span class="flag">🇺🇸</span>
                <span class="lang-text">EN</span>
            </button>
            <button class="lang-btn ${this.currentLanguage === 'zh' ? 'active' : ''}" data-lang="zh">
                <span class="flag">🇨🇳</span>
                <span class="lang-text">中文</span>
            </button>
        `;

        // 插入到版本标识之前
        const versionBadge = header.querySelector('.version-badge');
        header.insertBefore(languageSwitcher, versionBadge);

        // 添加事件监听
        languageSwitcher.addEventListener('click', (e) => {
            const langBtn = e.target.closest('.lang-btn');
            if (langBtn) {
                const language = langBtn.dataset.lang;
                this.switchLanguage(language);
            }
        });
    }

    // 更新语言切换器状态
    updateLanguageSwitcher() {
        const langButtons = document.querySelectorAll('.lang-btn');
        langButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === this.currentLanguage);
        });
    }

    // 加载翻译数据
    loadTranslations() {
        this.translations = {
            en: {
                // Header
                title: "Gmail OAuth Proxy Server",
                subtitle: "Secure OAuth token exchange proxy service for Gmail API integration",

                // Navigation
                nav: {
                    overview: "Overview",
                    authentication: "Authentication",
                    endpoints: "API Endpoints",
                    examples: "Examples",
                    configuration: "Configuration"
                },

                // Overview Section
                overview: {
                    title: "Overview",
                    description: "Gmail OAuth Proxy Server is a secure proxy service that facilitates OAuth token exchange for Gmail API integration. It provides a secure intermediary layer between your application and Google's OAuth endpoints.",
                    features: {
                        dual_auth: {
                            title: "Dual Authentication",
                            desc: "API Key and IP whitelist authentication"
                        },
                        https: {
                            title: "HTTPS Enforcement",
                            desc: "Secure communication in production"
                        },
                        ip_whitelist: {
                            title: "IP Whitelist",
                            desc: "CIDR format and individual IP control"
                        },
                        log_sanitization: {
                            title: "Log Sanitization",
                            desc: "Automatic sensitive data protection"
                        }
                    }
                },

                // Authentication Section
                authentication: {
                    title: "Authentication",
                    description: "The server supports two authentication methods that can be used individually or in combination:",
                    api_key: {
                        title: "API Key Authentication",
                        desc: "Include the API key in the request header:"
                    },
                    ip_whitelist: {
                        title: "IP Whitelist Authentication",
                        desc: "Access control based on client IP address. Supports:",
                        supports: [
                            "Individual IP addresses: 192.168.1.100",
                            "CIDR networks: 192.168.1.0/24",
                            "IPv6 addresses: ::1, 2001:db8::/32"
                        ]
                    },
                    strategy: {
                        title: "Authentication Strategy",
                        table: {
                            headers: ["Configuration", "Validation Logic", "Description"],
                            rows: [
                                ["API Key only", "Validate API Key", "Traditional API Key authentication"],
                                ["IP whitelist only", "Validate IP address", "IP-based access control"],
                                ["Both configured", "API Key AND IP whitelist", "Dual verification, both must pass"]
                            ]
                        }
                    }
                },

                // API Endpoints Section
                endpoints: {
                    title: "API Endpoints",
                    health: {
                        title: "Health Check",
                        desc: "Health check endpoint for monitoring service status.",
                        response: "Response"
                    },
                    token: {
                        title: "Token Exchange",
                        desc: "OAuth token exchange endpoint for converting authorization codes to access tokens.",
                        headers: "Request Headers",
                        body: "Request Body",
                        response: "Response",
                        response_desc: "Returns Google's original OAuth response:"
                    }
                },

                // Examples Section
                examples: {
                    title: "Usage Examples",
                    health_check: "Health Check",
                    token_exchange: "Token Exchange",
                    token_exchange_fetch: "Token Exchange with Fetch API",
                    token_exchange_requests: "Token Exchange with Requests",
                    token_exchange_go: "Token Exchange with Go"
                },

                // Configuration Section
                configuration: {
                    title: "Configuration",
                    env_vars: {
                        title: "Environment Variables",
                        headers: ["Variable", "Description", "Default"],
                        api_key: "API key for authentication",
                        ip_whitelist: "IP whitelist (comma-separated)",
                        port: "Server port",
                        environment: "Runtime environment",
                        log_level: "Log level",
                        timeout: "Request timeout (seconds)"
                    },
                    cli: {
                        title: "Command Line Usage"
                    }
                },

                // Footer
                footer: {
                    copyright: "© 2024 Gmail OAuth Proxy Server. Licensed under MIT License.",
                    github: "GitHub",
                    issues: "Issues"
                }
            },
            zh: {
                // Header
                title: "Gmail OAuth 代理服务器",
                subtitle: "用于 Gmail API 集成的安全 OAuth 令牌交换代理服务",

                // Navigation
                nav: {
                    overview: "概述",
                    authentication: "身份验证",
                    endpoints: "API 端点",
                    examples: "使用示例",
                    configuration: "配置说明"
                },

                // Overview Section
                overview: {
                    title: "概述",
                    description: "Gmail OAuth 代理服务器是一个安全的代理服务，用于促进 Gmail API 集成的 OAuth 令牌交换。它在您的应用程序和 Google 的 OAuth 端点之间提供了一个安全的中间层。",
                    features: {
                        dual_auth: {
                            title: "双重身份验证",
                            desc: "API 密钥和 IP 白名单身份验证"
                        },
                        https: {
                            title: "HTTPS 强制",
                            desc: "生产环境中的安全通信"
                        },
                        ip_whitelist: {
                            title: "IP 白名单",
                            desc: "CIDR 格式和单个 IP 控制"
                        },
                        log_sanitization: {
                            title: "日志脱敏",
                            desc: "自动敏感数据保护"
                        }
                    }
                },

                // Authentication Section
                authentication: {
                    title: "身份验证",
                    description: "服务器支持两种身份验证方法，可以单独使用或组合使用：",
                    api_key: {
                        title: "API 密钥身份验证",
                        desc: "在请求头中包含 API 密钥："
                    },
                    ip_whitelist: {
                        title: "IP 白名单身份验证",
                        desc: "基于客户端 IP 地址的访问控制。支持：",
                        supports: [
                            "单个 IP 地址：192.168.1.100",
                            "CIDR 网络：192.168.1.0/24",
                            "IPv6 地址：::1, 2001:db8::/32"
                        ]
                    },
                    strategy: {
                        title: "身份验证策略",
                        table: {
                            headers: ["配置", "验证逻辑", "描述"],
                            rows: [
                                ["仅 API 密钥", "验证 API 密钥", "传统的 API 密钥身份验证"],
                                ["仅 IP 白名单", "验证 IP 地址", "基于 IP 的访问控制"],
                                ["两者都配置", "API 密钥 且 IP 白名单", "双重验证，两者都必须通过"]
                            ]
                        }
                    }
                },

                // API Endpoints Section
                endpoints: {
                    title: "API 端点",
                    health: {
                        title: "健康检查",
                        desc: "用于监控服务状态的健康检查端点。",
                        response: "响应"
                    },
                    token: {
                        title: "令牌交换",
                        desc: "用于将授权码转换为访问令牌的 OAuth 令牌交换端点。",
                        headers: "请求头",
                        body: "请求体",
                        response: "响应",
                        response_desc: "返回 Google 的原始 OAuth 响应："
                    }
                },

                // Examples Section
                examples: {
                    title: "使用示例",
                    health_check: "健康检查",
                    token_exchange: "令牌交换",
                    token_exchange_fetch: "使用 Fetch API 进行令牌交换",
                    token_exchange_requests: "使用 Requests 进行令牌交换",
                    token_exchange_go: "使用 Go 进行令牌交换"
                },

                // Configuration Section
                configuration: {
                    title: "配置说明",
                    env_vars: {
                        title: "环境变量",
                        headers: ["变量", "描述", "默认值"],
                        api_key: "用于身份验证的 API 密钥",
                        ip_whitelist: "IP 白名单（逗号分隔）",
                        port: "服务器端口",
                        environment: "运行环境",
                        log_level: "日志级别",
                        timeout: "请求超时（秒）"
                    },
                    cli: {
                        title: "命令行使用"
                    }
                },

                // Footer
                footer: {
                    copyright: "© 2024 Gmail OAuth 代理服务器。基于 MIT 许可证授权。",
                    github: "GitHub",
                    issues: "问题反馈"
                }
            }
        };
    }

    // 应用翻译
    applyTranslations() {
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(element => {
            const key = element.dataset.i18n;
            const translation = this.getTranslation(key);
            if (translation) {
                // 保留HTML标签，只替换文本内容
                if (element.innerHTML.includes('<')) {
                    // 如果包含HTML标签，只替换文本节点
                    this.replaceTextNodes(element, translation);
                } else {
                    element.textContent = translation;
                }
            }
        });

        // 更新HTML lang属性
        document.documentElement.lang = this.currentLanguage;

        // 触发语言切换事件
        document.dispatchEvent(new CustomEvent('languageChanged', {
            detail: { language: this.currentLanguage }
        }));
    }

    // 替换文本节点，保留HTML标签
    replaceTextNodes(element, newText) {
        const walker = document.createTreeWalker(
            element,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );

        const textNodes = [];
        let node;
        while (node = walker.nextNode()) {
            textNodes.push(node);
        }

        if (textNodes.length > 0) {
            // 简单替换第一个文本节点
            textNodes[0].textContent = newText;
            // 移除其他文本节点
            for (let i = 1; i < textNodes.length; i++) {
                textNodes[i].textContent = '';
            }
        }
    }

    // 获取翻译文本
    getTranslation(key) {
        const keys = key.split('.');
        let translation = this.translations[this.currentLanguage];

        for (const k of keys) {
            if (translation && (translation[k] !== undefined)) {
                translation = translation[k];
            } else {
                // 如果当前语言没有翻译，回退到英文
                translation = this.translations['en'];
                for (const k2 of keys) {
                    if (translation && (translation[k2] !== undefined)) {
                        translation = translation[k2];
                    } else {
                        return null;
                    }
                }
                break;
            }
        }

        return typeof translation === 'string' ? translation : null;
    }
}

// 全局语言管理器实例
let languageManager;

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    // 初始化语言管理器
    languageManager = new LanguageManager();

    // 初始化其他功能
    initializeNavigation();
    initializeTabs();
    initializeSmoothScrolling();
    initializeCodeCopyButtons();
});

// Navigation functionality
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    
    // Handle navigation clicks
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Get target section
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                // Smooth scroll to section
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Handle scroll spy for navigation
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });
}

// Tab functionality
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Remove active class from all buttons and panes
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            // Add active class to clicked button and corresponding pane
            this.classList.add('active');
            const targetPane = document.getElementById(targetTab);
            if (targetPane) {
                targetPane.classList.add('active');
            }
        });
    });
}

// Smooth scrolling for anchor links
function initializeSmoothScrolling() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if it's a tab link (handled separately)
            if (this.classList.contains('nav-link')) {
                return;
            }
            
            const targetElement = document.querySelector(href);
            
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Add copy buttons to code blocks
function initializeCodeCopyButtons() {
    const codeBlocks = document.querySelectorAll('.code-block');
    
    codeBlocks.forEach(block => {
        // Create copy button
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-button';
        copyButton.innerHTML = '<i class="fas fa-copy"></i>';
        copyButton.title = 'Copy to clipboard';
        
        // Position the button
        block.style.position = 'relative';
        copyButton.style.position = 'absolute';
        copyButton.style.top = '10px';
        copyButton.style.right = '10px';
        copyButton.style.background = '#4a5568';
        copyButton.style.color = 'white';
        copyButton.style.border = 'none';
        copyButton.style.padding = '8px 12px';
        copyButton.style.borderRadius = '4px';
        copyButton.style.cursor = 'pointer';
        copyButton.style.fontSize = '12px';
        copyButton.style.opacity = '0.7';
        copyButton.style.transition = 'opacity 0.3s ease';
        
        // Add hover effect
        copyButton.addEventListener('mouseenter', function() {
            this.style.opacity = '1';
        });
        
        copyButton.addEventListener('mouseleave', function() {
            this.style.opacity = '0.7';
        });
        
        // Add copy functionality
        copyButton.addEventListener('click', function() {
            const code = block.querySelector('code');
            const text = code ? code.textContent : block.textContent;
            
            navigator.clipboard.writeText(text).then(function() {
                // Show success feedback
                copyButton.innerHTML = '<i class="fas fa-check"></i>';
                copyButton.style.background = '#27ae60';
                
                setTimeout(function() {
                    copyButton.innerHTML = '<i class="fas fa-copy"></i>';
                    copyButton.style.background = '#4a5568';
                }, 2000);
            }).catch(function(err) {
                console.error('Failed to copy text: ', err);
                
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = text;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                
                // Show success feedback
                copyButton.innerHTML = '<i class="fas fa-check"></i>';
                copyButton.style.background = '#27ae60';
                
                setTimeout(function() {
                    copyButton.innerHTML = '<i class="fas fa-copy"></i>';
                    copyButton.style.background = '#4a5568';
                }, 2000);
            });
        });
        
        block.appendChild(copyButton);
    });
}

// Add loading animation for external links
function addLoadingAnimation() {
    const externalLinks = document.querySelectorAll('a[target="_blank"]');
    
    externalLinks.forEach(link => {
        link.addEventListener('click', function() {
            const icon = this.querySelector('i');
            if (icon) {
                const originalClass = icon.className;
                icon.className = 'fas fa-spinner fa-spin';
                
                setTimeout(function() {
                    icon.className = originalClass;
                }, 1000);
            }
        });
    });
}

// Initialize loading animation
document.addEventListener('DOMContentLoaded', addLoadingAnimation);

// Add keyboard navigation support
document.addEventListener('keydown', function(e) {
    // ESC key to close any open modals or reset state
    if (e.key === 'Escape') {
        // Reset any active states if needed
        console.log('ESC pressed - resetting states');
    }
    
    // Arrow keys for tab navigation
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        const activeTab = document.querySelector('.tab-button.active');
        if (activeTab) {
            const tabButtons = Array.from(document.querySelectorAll('.tab-button'));
            const currentIndex = tabButtons.indexOf(activeTab);
            
            let nextIndex;
            if (e.key === 'ArrowLeft') {
                nextIndex = currentIndex > 0 ? currentIndex - 1 : tabButtons.length - 1;
            } else {
                nextIndex = currentIndex < tabButtons.length - 1 ? currentIndex + 1 : 0;
            }
            
            tabButtons[nextIndex].click();
            e.preventDefault();
        }
    }
});

// Add scroll to top functionality
function addScrollToTop() {
    const scrollButton = document.createElement('button');
    scrollButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollButton.className = 'scroll-to-top';
    scrollButton.title = 'Scroll to top';
    
    // Style the button
    scrollButton.style.position = 'fixed';
    scrollButton.style.bottom = '20px';
    scrollButton.style.right = '20px';
    scrollButton.style.width = '50px';
    scrollButton.style.height = '50px';
    scrollButton.style.borderRadius = '50%';
    scrollButton.style.background = '#3498db';
    scrollButton.style.color = 'white';
    scrollButton.style.border = 'none';
    scrollButton.style.cursor = 'pointer';
    scrollButton.style.fontSize = '18px';
    scrollButton.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
    scrollButton.style.opacity = '0';
    scrollButton.style.visibility = 'hidden';
    scrollButton.style.transition = 'all 0.3s ease';
    scrollButton.style.zIndex = '1000';
    
    // Add click functionality
    scrollButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Show/hide based on scroll position
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollButton.style.opacity = '1';
            scrollButton.style.visibility = 'visible';
        } else {
            scrollButton.style.opacity = '0';
            scrollButton.style.visibility = 'hidden';
        }
    });
    
    document.body.appendChild(scrollButton);
}

// Initialize scroll to top button
document.addEventListener('DOMContentLoaded', addScrollToTop);

// Add print styles support
function addPrintSupport() {
    const printButton = document.createElement('button');
    printButton.innerHTML = '<i class="fas fa-print"></i> Print Documentation';
    printButton.className = 'print-button';
    
    // Style the button
    printButton.style.position = 'fixed';
    printButton.style.top = '20px';
    printButton.style.right = '20px';
    printButton.style.padding = '10px 15px';
    printButton.style.background = '#34495e';
    printButton.style.color = 'white';
    printButton.style.border = 'none';
    printButton.style.borderRadius = '5px';
    printButton.style.cursor = 'pointer';
    printButton.style.fontSize = '14px';
    printButton.style.zIndex = '1000';
    printButton.style.display = 'none'; // Hidden by default
    
    // Add click functionality
    printButton.addEventListener('click', function() {
        window.print();
    });
    
    // Show on larger screens only
    if (window.innerWidth > 768) {
        printButton.style.display = 'block';
    }
    
    document.body.appendChild(printButton);
}

// Initialize print support
document.addEventListener('DOMContentLoaded', addPrintSupport);
