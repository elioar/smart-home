document.addEventListener('DOMContentLoaded', () => {
    const burgerMenu = document.querySelector('.burger-menu');
    const fullMenu = document.querySelector('.full-menu');
    const body = document.body;

    burgerMenu.addEventListener('click', () => {
        burgerMenu.classList.toggle('active');
        fullMenu.classList.toggle('active');
        body.style.overflow = fullMenu.classList.contains('active') ? 'hidden' : '';
        
        const icon = burgerMenu.querySelector('i');
        if (fullMenu.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    const menuLinks = document.querySelectorAll('.menu-links a');
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            burgerMenu.classList.remove('active');
            fullMenu.classList.remove('active');
            body.style.overflow = '';
            burgerMenu.querySelector('i').classList.replace('fa-times', 'fa-bars');
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
}); 