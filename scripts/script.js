document.addEventListener('DOMContentLoaded', function() {
    const intervalo = 5000;

    // Inicialização do menu mobile
    function initMobileMenu() {
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const navMenu = document.querySelector('.navbar-left .nav-section:last-child');
        const navLinks = document.querySelectorAll('.nav-links');

        if (mobileMenuBtn && navMenu) {
            mobileMenuBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                navMenu.classList.toggle('active');
                toggleHamburgerIcon(this, navMenu.classList.contains('active'));
            });

            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    closeMobileMenu(mobileMenuBtn, navMenu);
                });
            });

            document.addEventListener('click', (e) => {
                if (!mobileMenuBtn.contains(e.target) && !navMenu.contains(e.target)) {
                    closeMobileMenu(mobileMenuBtn, navMenu);
                }
            });

            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                    closeMobileMenu(mobileMenuBtn, navMenu);
                }
            });
        }
    }

    function toggleHamburgerIcon(button, isActive) {
        const svg = button.querySelector('svg path');
        if (isActive) {
            svg.setAttribute('d', 'M256-200l-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z');
            button.setAttribute('aria-expanded', 'true');
        } else {
            svg.setAttribute('d', 'M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z');
            button.setAttribute('aria-expanded', 'false');
        }
    }

    function closeMobileMenu(button, menu) {
        menu.classList.remove('active');
        toggleHamburgerIcon(button, false);
    }

    // Smooth scrolling para links de navegação
    function initSmoothScrolling() {
        const navLinksAll = document.querySelectorAll('a[href^="#"]');
        navLinksAll.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 100; // Ajuste para navbar fixa
                    window.scrollTo({ top: offsetTop, behavior: 'smooth' });
                }
            });
        });
    }

    // Inicialização do carrossel de portfólio
    const portfolioCarousel = {
        currentIndex: 0,
        items: document.querySelectorAll('.portfolio-item'),
        indicators: document.querySelectorAll('.indicator'),
        nextBtn: document.querySelector('.next-btn'),
        prevBtn: document.querySelector('.prev-btn'),

        init() {
            this.setupEventListeners();
            this.updateCarousel();
            this.startAutoPlay();
        },

        setupEventListeners() {
            this.nextBtn.addEventListener('click', () => {
                this.nextSlide();
                this.resetAutoPlay();
            });

            this.prevBtn.addEventListener('click', () => {
                this.prevSlide();
                this.resetAutoPlay();
            });

            this.indicators.forEach((indicator, index) => {
                indicator.addEventListener('click', () => {
                    this.goToSlide(index);
                    this.resetAutoPlay();
                });
            });
        },

        startAutoPlay() {
            this.intervalId = setInterval(() => this.nextSlide(), intervalo);
        },

        resetAutoPlay() {
            clearInterval(this.intervalId);
            this.startAutoPlay();
        },

        nextSlide() {
            this.currentIndex = (this.currentIndex + 1) % this.items.length;
            this.updateCarousel();
        },

        prevSlide() {
            this.currentIndex = (this.currentIndex - 1 + this.items.length) % this.items.length;
            this.updateCarousel();
        },

        goToSlide(index) {
            this.currentIndex = index;
            this.updateCarousel();
        },

        updateCarousel() {
            this.items.forEach((item, index) => {
                item.classList.remove('active', 'prev', 'next');
                if (index === this.currentIndex) {
                    item.classList.add('active');
                } else if (index === (this.currentIndex - 1 + this.items.length) % this.items.length) {
                    item.classList.add('prev');
                } else if (index === (this.currentIndex + 1) % this.items.length) {
                    item.classList.add('next');
                }
            });

            this.indicators.forEach((indicator, index) => {
                indicator.classList.toggle('active', index === this.currentIndex);
            });
        }
    };

    // Inicializar carrossel
    if (document.querySelector('.portfolio-carousel')) {
        portfolioCarousel.init();
    }

    // Funções de otimização para mobile
    function adjustForMobile() {
        if (window.innerWidth <= 768) {
            // Desabilitar autoplay em mobile
            if (portfolioCarousel && portfolioCarousel.intervalId) {
                clearInterval(portfolioCarousel.intervalId);
            }
            // Ajustar sensibilidade do swipe
            const carouselContainer = document.querySelector('.carousel-container');
            if (carouselContainer) {
                carouselContainer.style.touchAction = 'pan-y pinch-zoom';
            }
        } else {
            // Reativar autoplay em desktop
            if (portfolioCarousel) {
                portfolioCarousel.startAutoPlay();
            }
        }
    }

    // Função para otimizar imagens em dispositivos móveis
    function optimizeImagesForMobile() {
        if (window.innerWidth <= 768) {
            const images = document.querySelectorAll('img');
            images.forEach(img => {
                img.loading = 'lazy';
                if (img.src.includes('celso') && !img.dataset.optimized) {
                    img.style.imageRendering = 'optimizeQuality';
                    img.dataset.optimized = 'true';
                }
            });
        }
    }

    // Inicializar funcionalidades mobile
    initMobileMenu();
    initSmoothScrolling();
    adjustForMobile();
    optimizeImagesForMobile();

    // Event listeners para mudanças de orientação e resize
    window.addEventListener('resize', adjustForMobile);

    // Lazy loading para imagens
    const images = document.querySelectorAll('img[src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => {
        imageObserver.observe(img);
    });

    // Adicionar classe loaded para efeito de fade-in
    const style = document.createElement('style');
    style.textContent = `
        img {
            opacity: 0;
            transition: opacity 0.5s ease;
        }
        img.loaded {
            opacity: 1;
        }
    `;
    document.head.appendChild(style);

    console.log('Portal Sucelso - Website carregado com sucesso! Carrossel implementado.');

    const backToTopBtn = document.createElement('button');
    backToTopBtn.innerHTML = '↑';
    backToTopBtn.className = 'back-to-top';
    
    document.body.appendChild(backToTopBtn);
    
    // Show/hide back to top button
    window.addEventListener('scroll', function() {
        if (window.scrollY > 500) {
            backToTopBtn.style.opacity = '1';
            backToTopBtn.style.visibility = 'visible';
        } else {
            backToTopBtn.style.opacity = '0';
            backToTopBtn.style.visibility = 'hidden';
        }
    });
    
    // Back to top functionality
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Add hover effect to back to top button
    backToTopBtn.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.1)';
        this.style.boxShadow = '0 8px 25px rgba(34, 34, 34, 0.4)';
    });
    
    backToTopBtn.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
        this.style.boxShadow = '0 5px 15px rgba(34, 34, 34, 0.3)';
    });
});