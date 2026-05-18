/* ───────────────────────────────────────────────────────────────────
   AHMA BTP — homepage interactions
   - Lenis smooth-scroll
   - Nav transparent → solid on hero exit
   - Scroll-driven reveals (IO)
   - Count-up stats
   - Horizontal pinned: réalisations + historique (scroll-driven X)
   - Hero parallax (subtle)
   ─────────────────────────────────────────────────────────────────── */

(function () {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = () => window.matchMedia('(max-width: 880px)').matches;

    /* ── Smooth scroll (Lenis) ───────────────────────────────── */
    let lenis = null;
    if (window.Lenis && !reduced) {
        lenis = new window.Lenis({
            duration: 1.15,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
            smoothTouch: false,
            wheelMultiplier: 1.0,
        });
        function raf(t) { lenis.raf(t); requestAnimationFrame(raf); }
        requestAnimationFrame(raf);
    }

    // Anchor links → smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
        a.addEventListener('click', (e) => {
            const href = a.getAttribute('href');
            if (!href || href === '#') return;
            const target = document.querySelector(href);
            if (!target) return;
            e.preventDefault();
            if (lenis) lenis.scrollTo(target, { offset: -60 });
            else target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    /* ── Nav transparent → solid ─────────────────────────────── */
    const nav = document.querySelector('.nav');
    const hero = document.querySelector('.hero');
    const onScrollNav = () => {
        const trigger = hero ? hero.offsetHeight * 0.6 : 600;
        if (window.scrollY > trigger) { nav.classList.remove('transparent'); nav.classList.add('solid'); }
        else { nav.classList.add('transparent'); nav.classList.remove('solid'); }
    };
    onScrollNav();
    window.addEventListener('scroll', onScrollNav, { passive: true });

    /* ── Intersection-observer reveals ────────────────────────── */
    const ioReveal = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
            if (e.isIntersecting) {
                e.target.classList.add('in');
                ioReveal.unobserve(e.target);
            }
        });
    }, { threshold: 0.16 });
    document.querySelectorAll('.reveal, .reveal-stagger').forEach((el) => ioReveal.observe(el));

    /* ── Count-up stats ──────────────────────────────────────── */
    const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);
    function countUp(el) {
        const target = parseInt(el.dataset.target, 10);
        const duration = 1800;
        const start = performance.now();
        function tick(now) {
            const t = Math.min(1, (now - start) / duration);
            const v = Math.round(easeOutQuart(t) * target);
            el.textContent = formatNumber(v);
            if (t < 1) requestAnimationFrame(tick);
            else el.textContent = formatNumber(target);
        }
        requestAnimationFrame(tick);
    }
    function formatNumber(n) {
        // Use French non-breaking-space thousand separator
        return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '\u202F');
    }
    const ioCount = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
            if (e.isIntersecting) {
                const el = e.target;
                const num = el.querySelector('[data-target]');
                if (num && !el.classList.contains('lit')) {
                    el.classList.add('lit');
                    countUp(num);
                    // If the row has a data-p, set the bar fill CSS var
                    const p = el.getAttribute('data-p');
                    if (p) el.style.setProperty('--p', p + '%');
                }
                ioCount.unobserve(el);
            }
        });
    }, { threshold: 0.35 });
    document.querySelectorAll('.stat-feature, .stat-row').forEach((c, i) => {
        setTimeout(() => ioCount.observe(c), i * 100);
    });

    /* ── Horizontal-pinned scroll mechanism ──────────────────── */
    // Pattern: an outer section with height=Nvh; inside, a sticky inner
    // (100vh) holds a horizontally-flexing track. As the outer scrolls,
    // we translateX the track from 0 to -(trackWidth - viewportWidth).
    function bindPinnedScroll(outerSel) {
        const outer = document.querySelector(outerSel);
        if (!outer) return;
        const sticky = outer.querySelector('.h-scroll-sticky, .timeline-sticky');
        const track = outer.querySelector('.h-scroll-track, .timeline-track');
        const railFill = outer.querySelector('.h-progress .rail, .timeline-rail');
        const counter = outer.querySelector('.h-progress .counter');
        const panels = Array.from(track.children);

        let trackW = 0;
        let viewportW = 0;
        let outerTop = 0;
        let outerH = 0;
        let panelOffsets = [];

        function measure() {
            // Reset transform so we can measure natural width
            track.style.transform = 'translate3d(0,0,0)';
            trackW = track.scrollWidth;
            viewportW = window.innerWidth;
            const rect = outer.getBoundingClientRect();
            outerTop = rect.top + window.scrollY;
            outerH = outer.offsetHeight;
            // Cache panel offsets (relative to track left)
            panelOffsets = panels.map((p) => p.offsetLeft);
        }
        measure();
        window.addEventListener('resize', () => { measure(); update(); });

        function update() {
            if (isMobile()) {
                track.style.transform = 'none';
                return;
            }
            const sH = window.innerHeight;
            // Lead-in/lead-out: the pinned phase only PANS during the middle 80%
            // of the section's scroll range. The first 10% and last 10% give the
            // user a chance to fully lock onto the section before lateral motion
            // begins — so the cards never start sliding before they're centered.
            const totalRange = outerH - sH;
            const leadIn = sH * 0.6;   // ~60% viewport hold before panning
            const leadOut = sH * 0.6;  // ~60% viewport hold after panning ends
            const panRange = totalRange - leadIn - leadOut;
            const scrolled = window.scrollY;
            const local = scrolled - outerTop - leadIn;
            let progress = local / panRange;
            progress = Math.max(0, Math.min(1, progress));
            const moveable = trackW - viewportW;
            const x = -progress * moveable;
            track.style.transform = `translate3d(${x}px, 0, 0)`;
            if (railFill) railFill.style.setProperty('--p', `${progress * 100}%`);
            if (counter) {
                // figure out which panel center is closest to viewport center
                const center = -x + viewportW / 2;
                let activeIdx = 0;
                for (let i = 0; i < panelOffsets.length; i++) {
                    const left = panelOffsets[i];
                    const right = left + panels[i].offsetWidth;
                    if (center >= left && center < right) { activeIdx = i; break; }
                    if (center >= right) activeIdx = i;
                }
                const cur = counter.querySelector('.cur');
                if (cur) cur.textContent = String(activeIdx + 1).padStart(2, '0');
            }
        }
        update();
        window.addEventListener('scroll', update, { passive: true });
    }
    if (!isMobile()) {
        bindPinnedScroll('#realisations');
        bindPinnedScroll('#historique');
    }

    /* ── Hero parallax (subtle scale + Y) ────────────────────── */
    const heroBgImg = document.querySelector('.hero-bg img');
    if (heroBgImg && !reduced) {
        const onScrollHero = () => {
            const y = window.scrollY;
            const max = window.innerHeight;
            const p = Math.min(1, y / max);
            const scale = 1.08 + p * 0.06;
            const ty = p * 60;
            heroBgImg.style.transform = `scale(${scale}) translate3d(0, ${ty}px, 0)`;
        };
        onScrollHero();
        window.addEventListener('scroll', onScrollHero, { passive: true });
    }

    /* ── Year auto-update in footer ──────────────────────────── */
    const yr = document.querySelector('[data-year]');
    if (yr) yr.textContent = new Date().getFullYear();
})();
