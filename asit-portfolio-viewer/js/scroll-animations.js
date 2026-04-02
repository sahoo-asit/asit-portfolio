// GSAP ScrollTrigger Animations
// Cinematic scroll-based animations for all sections

(function() {
    'use strict';

    const isMobileViewport = () => window.innerWidth < 768;
    const isTouchDevice = () => window.matchMedia('(pointer: coarse)').matches;
    const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function initSimpleNavScroll() {
        const nav = document.querySelector('nav');
        if (!nav) return;

        const updateNav = () => {
            nav.classList.toggle('nav-scrolled', window.scrollY > 40);
        };

        updateNav();
        window.addEventListener('scroll', updateNav, { passive: true });
    }

    function initScrollAnimations() {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
            initSimpleNavScroll();
            return;
        }

        gsap.registerPlugin(ScrollTrigger);

        if (isMobileViewport() || prefersReducedMotion()) {
            initSimpleNavScroll();

            document.querySelectorAll('.bg-blue-600.h-2.rounded-full').forEach(bar => {
                const width = bar.dataset.finalWidth || bar.style.width;
                if (width) {
                    bar.style.width = width;
                }
            });

            return;
        }

        // Navbar glass effect on scroll
        ScrollTrigger.create({
            start: 'top -80',
            onEnter: () => {
                document.querySelector('nav').classList.add('nav-scrolled');
            },
            onLeaveBack: () => {
                document.querySelector('nav').classList.remove('nav-scrolled');
            }
        });

        // Hero section parallax
        gsap.to('#hero .container', {
            scrollTrigger: {
                trigger: '#hero',
                start: 'top top',
                end: 'bottom top',
                scrub: 1
            },
            y: 150,
            opacity: 0,
            scale: 0.9
        });

        // Section headers - slide up with stagger
        gsap.utils.toArray('section h2').forEach(heading => {
            gsap.from(heading, {
                scrollTrigger: {
                    trigger: heading,
                    start: 'top 85%',
                    end: 'top 60%',
                    toggleActions: 'play none none reverse'
                },
                y: 60,
                opacity: 0,
                duration: 0.8,
                ease: 'power3.out'
            });
        });

        // Skill cards - 3D flip in
        gsap.utils.toArray('#skills .bg-white.rounded-lg').forEach((card, i) => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: 'top 90%',
                    toggleActions: 'play none none reverse'
                },
                y: 80,
                opacity: 0,
                rotateX: 15,
                scale: 0.9,
                duration: 0.7,
                delay: i * 0.08,
                ease: 'back.out(1.5)'
            });
        });

        // Experience cards - slide from sides
        gsap.utils.toArray('#experience .bg-white').forEach((card, i) => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                },
                x: i % 2 === 0 ? -100 : 100,
                opacity: 0,
                duration: 0.8,
                ease: 'power3.out'
            });
        });

        // About section - text slides
        const aboutSection = document.querySelector('#about');
        if (aboutSection) {
            gsap.from('#about .grid > div:first-child', {
                scrollTrigger: {
                    trigger: '#about',
                    start: 'top 75%',
                    toggleActions: 'play none none reverse'
                },
                x: -80,
                opacity: 0,
                duration: 1,
                ease: 'power3.out'
            });
            gsap.from('#about .grid > div:last-child', {
                scrollTrigger: {
                    trigger: '#about',
                    start: 'top 75%',
                    toggleActions: 'play none none reverse'
                },
                x: 80,
                opacity: 0,
                duration: 1,
                ease: 'power3.out'
            });
        }

        // Skill progress bars animate on scroll
        gsap.utils.toArray('.bg-blue-600.h-2.rounded-full').forEach(bar => {
            const width = bar.style.width;
            bar.style.width = '0%';
            gsap.to(bar, {
                scrollTrigger: {
                    trigger: bar,
                    start: 'top 90%',
                    toggleActions: 'play none none reverse'
                },
                width: width,
                duration: 1.2,
                ease: 'power2.out'
            });
        });

        // Awards cards pop in
        gsap.utils.toArray('#awards .bg-white, #awards .border-t-4').forEach((card, i) => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: 'top 90%',
                    toggleActions: 'play none none reverse'
                },
                scale: 0.8,
                opacity: 0,
                rotateY: 20,
                duration: 0.6,
                delay: i * 0.15,
                ease: 'back.out(1.7)'
            });
        });

        // Education cards
        gsap.utils.toArray('#education .bg-white').forEach((card, i) => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                },
                y: 60,
                opacity: 0,
                duration: 0.7,
                delay: i * 0.2,
                ease: 'power3.out'
            });
        });

        // Contact section
        const contactSection = document.querySelector('#contact');
        if (contactSection) {
            gsap.from('#contact form, #contact .bg-white', {
                scrollTrigger: {
                    trigger: '#contact',
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                },
                y: 60,
                opacity: 0,
                duration: 0.8,
                stagger: 0.2,
                ease: 'power3.out'
            });
        }

        // Tag pills float up
        gsap.utils.toArray('.rounded-full').forEach((tag, i) => {
            if (tag.classList.contains('bg-blue-100') || tag.classList.contains('bg-green-500')) {
                gsap.from(tag, {
                    scrollTrigger: {
                        trigger: tag,
                        start: 'top 95%',
                        toggleActions: 'play none none reverse'
                    },
                    y: 20,
                    opacity: 0,
                    duration: 0.4,
                    delay: i * 0.03,
                    ease: 'power2.out'
                });
            }
        });

        // Parallax for section backgrounds
        gsap.utils.toArray('section').forEach(section => {
            if (section.classList.contains('bg-gray-50') || section.classList.contains('bg-blue-50')) {
                gsap.to(section, {
                    scrollTrigger: {
                        trigger: section,
                        start: 'top bottom',
                        end: 'bottom top',
                        scrub: 1
                    },
                    backgroundPositionY: '30%'
                });
            }
        });
    }

    // 3D Tilt Effect for Cards
    function initTiltCards() {
        if (isMobileViewport() || isTouchDevice() || prefersReducedMotion()) return;

        const cards = document.querySelectorAll('.bg-white.rounded-lg, .modern-card, .border-t-4');
        
        cards.forEach(card => {
            card.style.transformStyle = 'preserve-3d';
            card.style.transition = 'transform 0.3s ease';

            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / centerY * -8;
                const rotateY = (x - centerX) / centerX * 8;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
            });
        });
    }

    // Magnetic buttons
    function initMagneticButtons() {
        if (isMobileViewport() || isTouchDevice() || prefersReducedMotion()) return;

        const buttons = document.querySelectorAll('a.rounded-full, button');
        
        buttons.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translate(0, 0)';
            });
        });
    }

    // Cursor trail effect
    function initCursorTrail() {
        if (isMobileViewport() || isTouchDevice() || prefersReducedMotion()) return;

        const cursor = document.createElement('div');
        cursor.id = 'custom-cursor';
        cursor.style.cssText = `
            position: fixed; width: 20px; height: 20px;
            border: 2px solid rgba(102, 126, 234, 0.5);
            border-radius: 50%; pointer-events: none;
            z-index: 9999; transition: transform 0.15s ease, width 0.3s, height 0.3s;
            mix-blend-mode: difference;
        `;
        document.body.appendChild(cursor);

        const cursorDot = document.createElement('div');
        cursorDot.style.cssText = `
            position: fixed; width: 6px; height: 6px;
            background: rgba(102, 126, 234, 0.8);
            border-radius: 50%; pointer-events: none;
            z-index: 10000; transition: transform 0.08s ease;
        `;
        document.body.appendChild(cursorDot);

        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX - 10 + 'px';
            cursor.style.top = e.clientY - 10 + 'px';
            cursorDot.style.left = e.clientX - 3 + 'px';
            cursorDot.style.top = e.clientY - 3 + 'px';
        });

        // Enlarge cursor on hover of interactive elements
        document.querySelectorAll('a, button, .bg-white.rounded-lg').forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.style.width = '40px';
                cursor.style.height = '40px';
                cursor.style.marginLeft = '-10px';
                cursor.style.marginTop = '-10px';
                cursor.style.borderColor = 'rgba(118, 75, 162, 0.6)';
            });
            el.addEventListener('mouseleave', () => {
                cursor.style.width = '20px';
                cursor.style.height = '20px';
                cursor.style.marginLeft = '0';
                cursor.style.marginTop = '0';
                cursor.style.borderColor = 'rgba(102, 126, 234, 0.5)';
            });
        });
    }

    // Text scramble effect for headings
    function initTextScramble() {
        if (isMobileViewport() || prefersReducedMotion()) return;

        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        
        function scrambleText(element) {
            const originalText = element.textContent;
            let iteration = 0;
            const interval = setInterval(() => {
                element.textContent = originalText
                    .split('')
                    .map((char, index) => {
                        if (index < iteration) return originalText[index];
                        return chars[Math.floor(Math.random() * chars.length)];
                    })
                    .join('');
                if (iteration >= originalText.length) clearInterval(interval);
                iteration += 1 / 2;
            }, 30);
        }

        // Apply to hero heading
        const heroTitle = document.querySelector('#hero h1');
        if (heroTitle) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setTimeout(() => scrambleText(heroTitle), 500);
                        observer.unobserve(entry.target);
                    }
                });
            });
            observer.observe(heroTitle);
        }
    }

    // Smooth reveal for sections
    function initSmoothReveal() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('section').forEach(section => {
            section.classList.add('reveal-section');
            observer.observe(section);
        });
    }

    // Initialize everything
    function initAll() {
        initScrollAnimations();
        initTiltCards();
        initMagneticButtons();
        initCursorTrail();
        initTextScramble();
        initSmoothReveal();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAll);
    } else {
        initAll();
    }
})();
