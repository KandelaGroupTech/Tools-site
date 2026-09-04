
// Hero Carousel Implementation
(function() {
    const config = {
        dwellTime: 6000,
        fadeDuration: 1200
    };

    const carousel = document.getElementById('hero-carousel');
    if (!carousel) return;

    const slides = carousel.querySelectorAll('.slide');
    const dots = carousel.querySelectorAll('.carousel-dot');
    const prevBtn = carousel.querySelector('.carousel-btn.prev');
    const nextBtn = carousel.querySelector('.carousel-btn.next');
    
    let currentIndex = 0;
    let autoplayTimer = null;
    let isPaused = false;
    let prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Load slide 2 aggressively after slide 1 loads
    const firstImg = slides[0].querySelector('img');
    if (firstImg) {
        if (firstImg.complete) {
            preloadNext();
        } else {
            firstImg.addEventListener('load', preloadNext, { once: true });
        }
    }

    function preloadNext() {
        if (slides.length > 1) {
            const nextImg = slides[1].querySelector('img');
            // By calling getBoundingClientRect or similar we might force a layout, but native loading="lazy" handles it.
            // We can just eagerly fetch it by removing lazy.
            if (nextImg && nextImg.getAttribute('loading') === 'lazy') {
                nextImg.removeAttribute('loading');
            }
        }
    }

    function goToSlide(index) {
        if (index === currentIndex) return;
        
        slides[currentIndex].classList.remove('active');
        slides[currentIndex].setAttribute('aria-hidden', 'true');
        dots[currentIndex].classList.remove('active');
        dots[currentIndex].removeAttribute('aria-current');

        currentIndex = index;

        slides[currentIndex].classList.add('active');
        slides[currentIndex].removeAttribute('aria-hidden');
        dots[currentIndex].classList.add('active');
        dots[currentIndex].setAttribute('aria-current', 'true');
        
        // Eagerly load the target slide image if it's lazy
        const targetImg = slides[currentIndex].querySelector('img');
        if (targetImg && targetImg.getAttribute('loading') === 'lazy') {
            targetImg.removeAttribute('loading');
        }

        resetTimer();
    }

    function nextSlide() {
        goToSlide((currentIndex + 1) % slides.length);
    }

    function prevSlide() {
        goToSlide((currentIndex - 1 + slides.length) % slides.length);
    }

    function startTimer() {
        if (prefersReducedMotion) return;
        stopTimer();
        if (!isPaused && document.visibilityState === 'visible') {
            autoplayTimer = setInterval(nextSlide, config.dwellTime);
        }
    }

    function stopTimer() {
        if (autoplayTimer) {
            clearInterval(autoplayTimer);
            autoplayTimer = null;
        }
    }

    function resetTimer() {
        if (!prefersReducedMotion) {
            startTimer();
        }
    }

    // Event Listeners for Controls
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    
    dots.forEach((dot, idx) => {
        dot.addEventListener('click', () => goToSlide(idx));
    });

    // Keyboard Navigation
    carousel.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevSlide();
            prevBtn.focus();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
            nextBtn.focus();
        }
    });

    // Pause on Hover / Focus
    carousel.addEventListener('mouseenter', () => { isPaused = true; stopTimer(); });
    carousel.addEventListener('mouseleave', () => { isPaused = false; startTimer(); });
    carousel.addEventListener('focusin', () => { isPaused = true; stopTimer(); });
    carousel.addEventListener('focusout', () => { isPaused = false; startTimer(); });

    // Pause on Visibility Change
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
            startTimer();
        } else {
            stopTimer();
        }
    });

    // Intersection Observer to pause when scrolled out of view
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    startTimer();
                } else {
                    stopTimer();
                }
            });
        }, { threshold: 0.1 });
        observer.observe(carousel);
    }

    // Handle Reduced Motion changes dynamically
    window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
        prefersReducedMotion = e.matches;
        if (prefersReducedMotion) {
            stopTimer();
        } else {
            startTimer();
        }
    });

    // Start
    startTimer();
})();
