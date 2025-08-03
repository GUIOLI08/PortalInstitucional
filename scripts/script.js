// Smooth scrolling and navigation effects
document.addEventListener('DOMContentLoaded', function() {

    let intervalo = 5000;

    // Mobile menu toggle (if needed for responsive)
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.navbar-left .nav-section:last-child');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }

    // Smooth scrolling for navigation links
    const navLinksAll = document.querySelectorAll('a[href^="#"]');
    
    navLinksAll.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 100; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Portfolio Carousel
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
    
    // Initialize carousel
    if (document.querySelector('.portfolio-carousel')) {
        portfolioCarousel.init();
    }

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.work-item, .insight-item, .research-item, .about-content');
    animateElements.forEach(el => {
        observer.observe(el);
    });

    // Counter animation for stats
    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);
        
        function updateCounter() {
            start += increment;
            if (start < target) {
                element.textContent = Math.floor(start);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        }
        
        updateCounter();
    }

    // Observe stats section for counter animation
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const numbers = entry.target.querySelectorAll('.number, .stat-number');
                numbers.forEach(number => {
                    const target = parseInt(number.textContent);
                    if (!isNaN(target)) {
                        number.textContent = '0';
                        animateCounter(number, target);
                    }
                });
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const statsSection = document.querySelector('.stats');
    const aboutStatsSection = document.querySelector('.about-stats');
    
    if (statsSection) statsObserver.observe(statsSection);
    if (aboutStatsSection) statsObserver.observe(aboutStatsSection);

    // Contact form handling
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const formObject = {};
            formData.forEach((value, key) => {
                formObject[key] = value;
            });
            
            // Validate form
            if (validateForm(formObject)) {
                // Show loading state
                const submitBtn = this.querySelector('.submit-button');
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = 'Enviando...';
                submitBtn.disabled = true;
                
                // Simulate form submission (replace with actual submission logic)
                setTimeout(() => {
                    showNotification('Mensagem enviada com sucesso!', 'success');
                    this.reset();
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }, 2000);
            }
        });
    }

    // Form validation
    function validateForm(data) {
        const errors = [];
        
        if (!data.name || data.name.trim().length < 2) {
            errors.push('Nome deve ter pelo menos 2 caracteres');
        }
        
        if (!data.email || !isValidEmail(data.email)) {
            errors.push('E-mail inválido');
        }
        
        if (!data.subject) {
            errors.push('Selecione um assunto');
        }
        
        if (!data.message || data.message.trim().length < 10) {
            errors.push('Mensagem deve ter pelo menos 10 caracteres');
        }
        
        if (errors.length > 0) {
            showNotification(errors.join('\n'), 'error');
            return false;
        }
        
        return true;
    }

    // Email validation
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Notification system
    function showNotification(message, type = 'info') {
        // Remove existing notification
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);
        
        // Close button functionality
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => notification.remove(), 300);
        });
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.transform = 'translateX(400px)';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }

    // Parallax effect for hero section
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const heroSection = document.querySelector('.introduction-section');
        const celsoImage = document.getElementById('celso');
        
        if (heroSection && celsoImage) {
            const rate = scrolled * -0.3;
            celsoImage.style.transform = `translateY(${rate}px)`;
        }
    });

    // Lazy loading for images
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

    // Add loaded class for fade-in effect
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

    // Research items hover effect
    const researchItems = document.querySelectorAll('.research-item');
    researchItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(10px)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
        });
    });

    // Work items stagger animation
    const workItems = document.querySelectorAll('.work-item');
    const workObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 200);
                workObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    workItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = 'all 0.6s ease';
        workObserver.observe(item);
    });

    // Insight items stagger animation
    const insightItems = document.querySelectorAll('.insight-item');
    const insightObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 150);
                insightObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    insightItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = 'all 0.6s ease';
        insightObserver.observe(item);
    });

    // Add click handlers for portfolio items
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    portfolioItems.forEach(item => {
        item.addEventListener('click', function() {
            const title = this.querySelector('h3')?.textContent || 'Projeto';
            showNotification(`Abrindo projeto: ${title}`, 'info');
        });
    });

    // Typing effect for the greeting
    function typeWriter(element, text, speed = 100) {
        let i = 0;
        element.textContent = '';
        
        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        
        type();
    }

    // Apply typing effect to main heading after page load
    setTimeout(() => {
        const mainHeading = document.querySelector('.greeting h1');
        if (mainHeading) {
            const originalText = mainHeading.textContent;
            typeWriter(mainHeading, originalText, 150);
        }
    }, 1500);

    // Add floating animation to stats icons
    const statIcons = document.querySelectorAll('.stat-icon svg');
    statIcons.forEach((icon, index) => {
        icon.style.animation = `float 3s ease-in-out infinite`;
        icon.style.animationDelay = `${index * 0.5}s`;
    });

    // Add ripple effect to buttons
    function addRippleEffect(button) {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255,255,255,0.3);
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    }

    // Apply ripple effect to buttons
    const buttons = document.querySelectorAll('.cta-button, .final-cta-button, .submit-button, .lattes-link, .carousel-btn');
    buttons.forEach(addRippleEffect);

    // Back to top button
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

    // Touch/swipe support for carousel
    let startX = 0;
    let endX = 0;
    
    const carouselContainer = document.querySelector('.carousel-container');
    if (carouselContainer) {
        carouselContainer.addEventListener('touchstart', function(e) {
            startX = e.touches[0].clientX;
        });
        
        carouselContainer.addEventListener('touchend', function(e) {
            endX = e.changedTouches[0].clientX;
            handleSwipe();
        });
        
        function handleSwipe() {
            const threshold = 50;
            const diff = startX - endX;
            
            if (Math.abs(diff) > threshold) {
                if (diff > 0) {
                    portfolioCarousel.nextSlide();
                } else {
                    portfolioCarousel.prevSlide();
                }
            }
        }
    }

    // Keyboard navigation for carousel
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            portfolioCarousel.prevSlide();
        } else if (e.key === 'ArrowRight') {
            portfolioCarousel.nextSlide();
        }
    });

    // Enhanced scroll animations
    const scrollElements = document.querySelectorAll('.about-content, .research-item, .work-item, .insight-item');
    
    const elementInView = (el, dividend = 1) => {
        const elementTop = el.getBoundingClientRect().top;
        return (
            elementTop <= (window.innerHeight || document.documentElement.clientHeight) / dividend
        );
    };
    
    const elementOutofView = (el) => {
        const elementTop = el.getBoundingClientRect().top;
        return (
            elementTop > (window.innerHeight || document.documentElement.clientHeight)
        );
    };
    
    const displayScrollElement = (element) => {
        element.classList.add('scrolled');
    };
    
    const hideScrollElement = (element) => {
        element.classList.remove('scrolled');
    };
    
    const handleScrollAnimation = () => {
        scrollElements.forEach((el) => {
            if (elementInView(el, 1.25)) {
                displayScrollElement(el);
            } else if (elementOutofView(el)) {
                hideScrollElement(el);
            }
        });
    };
    
    window.addEventListener('scroll', handleScrollAnimation);

    console.log('Portal Sucelso - Website carregado com sucesso! Carrossel implementado.');
});