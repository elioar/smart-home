// Preloading Code
class Preloader {
    constructor() {
        this.outer = document.querySelector('.v-preloader');
        this.percent = document.querySelector('.v-preloader__percent');
        this.progress = document.querySelector('.v-preloader__progress');
        
        this.loaded = false;
        this.resourcesTotal = 100;
        this.resourcesLoaded = 0;
    }

    init() {
        // Αρχικά κρύβουμε όλα τα animated στοιχεία
        document.querySelectorAll('.animate-fade-up, .animate-scale, .animate-slide-right')
            .forEach(el => el.style.opacity = '0');
        
        this.start();
        return this;
    }

    start() {
        this.outer.classList.add('v-preloader_animate');
        this.simulateLoading();
        return true;
    }

    simulateLoading() {
        let currentProgress = 0;
        
        const incrementProgress = () => {
            if (currentProgress < 100) {
                currentProgress++;
                this.resourcesLoaded = currentProgress;
                this.updateProgress();
                setTimeout(incrementProgress, 30);
            }
        };
        
        incrementProgress();
    }

    updateProgress() {
        if (this.percent) {
            const progress = Math.round((this.resourcesLoaded / this.resourcesTotal) * 100);
            this.percent.textContent = progress.toString().padStart(2, '0');
            
            if (progress >= 100) {
                setTimeout(() => {
                    this.loaded = true;
                    this.hide();
                }, 300);
            }
        }
        
        if (this.progress) {
            const width = (this.resourcesLoaded / this.resourcesTotal) * 100;
            this.progress.style.width = `${width}%`;
        }
    }

    hide() {
        this.outer.classList.add('hide');
        setTimeout(() => {
            this.outer.classList.add('v-preloader_hidden');
            document.body.classList.remove('v-loading');
            
            // Ξεκινάμε τα animations μετά το κλείσιμο του preloader
            this.startPageAnimations();
        }, 750);
    }

    startPageAnimations() {
        // Navbar animation
        const navbar = document.querySelector('.navbar');
        navbar.style.animation = 'fadeInDown 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards';

        // Hero content animations με διαδοχικά delays
        const heroElements = [
            { selector: '.pre-title', delay: 0.2, animation: 'fadeInUp' },
            { selector: '.hero-text h1', delay: 0.4, animation: 'fadeInUp' },
            { selector: '.hero-buttons', delay: 0.6, animation: 'fadeInUp' },
            { selector: '.room-tabs', delay: 0.8, animation: 'slideInRight' },
            { selector: '.camera-info', delay: 1, animation: 'slideInRight' }
        ];

        heroElements.forEach(({ selector, delay, animation }) => {
            const element = document.querySelector(selector);
            if (element) {
                element.style.opacity = '0';
                element.style.animation = `${animation} 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards`;
                element.style.animationDelay = `${delay}s`;
            }
        });

        // Feature containers animation
        const containers = document.querySelectorAll('.feature-container');
        containers.forEach((container, index) => {
            container.style.opacity = '0';
            container.style.animation = 'fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards';
            container.style.animationDelay = `${1.2 + (index * 0.2)}s`;
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Preloader().init();
    const burgerMenu = document.querySelector('.burger-menu');
    const fullMenu = document.querySelector('.full-menu');
    const body = document.body;

    burgerMenu.addEventListener('click', () => {
        burgerMenu.classList.toggle('active');
        fullMenu.classList.toggle('active');
        body.style.overflow = fullMenu.classList.contains('active') ? 'hidden' : '';
    });

    const menuLinks = document.querySelectorAll('.menu-links a');
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            burgerMenu.classList.remove('active');
            fullMenu.classList.remove('active');
            body.style.overflow = '';
        });
    });

    const hero = document.querySelector('.hero');
    const roomTabs = document.querySelectorAll('.room-tab');
    let currentIndex = 0;
    let isAnimating = false;
    const autoChangeInterval = 5000;
    let autoChangeTimer;
    let currentBackground = null;

    // Create background container
    const backgroundContainer = document.createElement('div');
    backgroundContainer.className = 'hero-backgrounds';
    hero.insertBefore(backgroundContainer, hero.firstChild);

    // Create initial background
    currentBackground = document.createElement('div');
    currentBackground.className = 'hero-background';
    currentBackground.style.backgroundImage = `url('img/${roomTabs[0].dataset.room}')`;
    backgroundContainer.appendChild(currentBackground);

    currentBackground.offsetHeight;
    requestAnimationFrame(() => {
        currentBackground.classList.add('active');
    });
    roomTabs[0].classList.add('active');

    const changeRoom = (index) => {
        if (isAnimating) return;
        isAnimating = true;

        // Update room tabs
        roomTabs.forEach(t => t.classList.remove('active'));
        roomTabs[index].classList.add('active');

        // Create new background with fade effect
        const newBackground = document.createElement('div');
        newBackground.className = 'hero-background';
        newBackground.style.backgroundImage = `url('img/${roomTabs[index].dataset.room}')`;
        backgroundContainer.appendChild(newBackground);

        // Force reflow
        newBackground.offsetHeight;

        // Trigger animation
        requestAnimationFrame(() => {
            newBackground.classList.add('active');
            currentBackground.classList.remove('active');
            
            setTimeout(() => {
                currentBackground.remove();
                currentBackground = newBackground;
                isAnimating = false;
            }, 1000);
        });
    };

    // Auto change functionality with the same animation
    const autoChange = () => {
        if (!isAnimating) {
            currentIndex = (currentIndex + 1) % roomTabs.length;
            changeRoom(currentIndex);
        }
    };

    // Start auto change
    autoChangeTimer = setInterval(autoChange, autoChangeInterval);

    // Click handlers
    roomTabs.forEach((tab, index) => {
        tab.addEventListener('click', () => {
            if (tab.classList.contains('active') || isAnimating) return;
            
            clearInterval(autoChangeTimer);
            currentIndex = index;
            changeRoom(currentIndex);
            autoChangeTimer = setInterval(autoChange, autoChangeInterval);
        });
    });

    // Hover handlers
    const roomTabsContainer = document.querySelector('.room-tabs');
    roomTabsContainer.addEventListener('mouseenter', () => {
        clearInterval(autoChangeTimer);
    });

    roomTabsContainer.addEventListener('mouseleave', () => {
        autoChangeTimer = setInterval(autoChange, autoChangeInterval);
    });

    // Color theme functionality
    const settingsBtn = document.querySelector('.settings-btn-circle');
    const colorThemes = [
        { primary: '#1C1C1E', accent: '#007AFF', bg: '#f5f5f5', nav: '#E9E9E9' },  // Default
        { primary: '#D35400', accent: '#E67E22', bg: '#FFF3E0', nav: '#FFE0B2' },  // Orange
        { primary: '#8E44AD', accent: '#9B59B6', bg: '#F3E5F5', nav: '#D1C4E9' },  // Purple
        { primary: '#16A085', accent: '#2ECC71', bg: '#E0F2F1', nav: '#B2DFDB' }   // Teal/Green
    ];
    
    let currentThemeIndex = 0;

    const updateThemeColors = (theme) => {
        // Update CSS variables
        document.documentElement.style.setProperty('--primary-color', theme.primary);
        document.documentElement.style.setProperty('--accent-color', theme.accent);
        document.documentElement.style.setProperty('--bg-color', theme.bg);
        document.documentElement.style.setProperty('--nav-color', theme.nav);

        // Update body background
        document.body.style.backgroundColor = theme.bg;

        // Update navbar
        document.querySelector('.navbar').style.backgroundColor = theme.nav;

        // Update camera info
        const cameraInfo = document.querySelector('.camera-info');
        cameraInfo.style.background = `${theme.primary}CC`;

        // Update view video button
        const viewVideo = document.querySelector('.view-video');
        viewVideo.style.background = theme.primary;

        // Update feature containers
        const featureContainers = document.querySelectorAll('.feature-container');
        featureContainers.forEach(container => {
            if (container.classList.contains('large')) {
                container.style.backgroundColor = theme.nav;
            } else {
                container.style.backgroundColor = theme.primary;
            }
        });

        // Add rotation animation to settings button
        settingsBtn.style.transform = 'rotate(180deg)';
        setTimeout(() => {
            settingsBtn.style.transform = 'rotate(0deg)';
        }, 300);
    };

    settingsBtn.addEventListener('click', () => {
        currentThemeIndex = (currentThemeIndex + 1) % colorThemes.length;
        updateThemeColors(colorThemes[currentThemeIndex]);
    });

    // Add CSS variables
    const style = document.createElement('style');
    style.textContent = `
        :root {
            --primary-color: #1C1C1E;
            --accent-color: #007AFF;
            --bg-color: #f5f5f5;
            --nav-color: #E9E9E9;
        }

        .navbar,
        .feature-container,
        .room-tab,
        .camera-info,
        .view-video {
            transition: all 0.3s ease;
        }

        body {
            transition: background-color 0.3s ease;
        }

        .settings-btn-circle {
            transition: transform 0.3s ease;
        }
    `;
    document.head.appendChild(style);

    // Initialize with first theme
    updateThemeColors(colorThemes[0]);
}); 



