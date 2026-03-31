document.addEventListener('DOMContentLoaded', () => {
    
    // --- Loading Screen ---
    setTimeout(() => {
        document.querySelector('.loader-wrapper').classList.add('loader-hidden');
    }, 1500);

    // --- Lenis Smooth Scroll Setup ---
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
        direction: 'vertical', 
        gestureDirection: 'vertical', 
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0, 0);

    // --- Custom Advanced Cursor ---
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    
    // Magnetic elements
    const magnetics = document.querySelectorAll('.magnetic');

    if (window.matchMedia("(pointer: fine)").matches) {
        gsap.set(cursorDot, { xPercent: -50, yPercent: -50 });
        gsap.set(cursorOutline, { xPercent: -50, yPercent: -50 });
        
        const xTo1 = gsap.quickTo(cursorDot, "x", {duration: 0.1, ease: "power3"});
        const yTo1 = gsap.quickTo(cursorDot, "y", {duration: 0.1, ease: "power3"});
        const xTo2 = gsap.quickTo(cursorOutline, "x", {duration: 0.4, ease: "power3"});
        const yTo2 = gsap.quickTo(cursorOutline, "y", {duration: 0.4, ease: "power3"});

        window.addEventListener('mousemove', (e) => {
            xTo1(e.clientX);
            yTo1(e.clientY);
            xTo2(e.clientX);
            yTo2(e.clientY);
        });
        
        // Add hover effect for clickables
        document.querySelectorAll('a, button, .input-group input, .input-group textarea, .project-card').forEach(el => {
            el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
        });

        // Magnetic Pull Effect
        magnetics.forEach((magnetic) => {
            magnetic.addEventListener('mousemove', function(e) {
                const rect = this.getBoundingClientRect();
                const h = rect.width / 2;
                const v = rect.height / 2;
                const x = e.clientX - rect.left - h;
                const y = e.clientY - rect.top - v;
                const strength = this.dataset.strength || 20;

                gsap.to(this, {
                    x: (x / h) * strength,
                    y: (y / v) * strength,
                    ease: "power3.out",
                    duration: 0.5
                });
            });

            magnetic.addEventListener('mouseleave', function() {
                gsap.to(this, {
                    x: 0,
                    y: 0,
                    ease: "elastic.out(1, 0.3)",
                    duration: 1.2
                });
            });
        });
    } else {
        // Hide custom cursor on mobile/touch devices
        cursorDot.style.display = 'none';
        cursorOutline.style.display = 'none';
        document.body.style.cursor = 'auto';
    }

    // --- Theme Toggle Default Light/Dark ---
    const themeBtn = document.getElementById('theme-btn');
    const htmlEl = document.documentElement;
    const themeIcon = themeBtn.querySelector('i');
    
    themeBtn.addEventListener('click', () => {
        if (htmlEl.getAttribute('data-theme') === 'dark') {
            htmlEl.setAttribute('data-theme', 'light');
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        } else {
            htmlEl.setAttribute('data-theme', 'dark');
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
    });

    // --- Scroll Progress Bar ---
    const scrollProgress = document.querySelector('.scroll-progress');
    window.addEventListener('scroll', () => {
        const scrollPx = document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        // prevent divide by zero just in case
        if(scrollHeight > 0) {
            const scrolled = `${(scrollPx / scrollHeight) * 100}%`;
            scrollProgress.style.width = scrolled;
        }
    });

    // --- GSAP Scroll Animations ---
    gsap.registerPlugin(ScrollTrigger);
    
    // Remove the 'visible' class trigger logic and replace with GSAP
    const animElements = document.querySelectorAll('.view-anim');
    animElements.forEach(el => {
        gsap.fromTo(el, 
            { y: 50, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: el,
                    start: "top 85%",
                    toggleActions: "play none none none"
                }
            }
        );
        
        // Progress bars animation inside the element
        const progressBars = el.querySelectorAll('.progress');
        if (progressBars.length > 0) {
            ScrollTrigger.create({
                trigger: el,
                start: "top 85%",
                onEnter: () => {
                    progressBars.forEach(bar => {
                        const target = bar.getAttribute('style').match(/--target:\s*([^;]+)/)[1];
                        bar.style.width = target;
                    });
                }
            });
        }
    });

    // Hero element staggers
    gsap.from(".hero-content > *", {
        y: 40,
        opacity: 0,
        stagger: 0.15,
        duration: 1,
        ease: "power3.out",
        delay: 1.5 // Wait for loader
    });

    // --- 3D Hover effect for Project Cards ---
    const cards = document.querySelectorAll('.project-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -5;
            const rotateY = ((x - centerX) / centerX) * 5;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        });
    });

});
