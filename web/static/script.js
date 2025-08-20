// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
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
