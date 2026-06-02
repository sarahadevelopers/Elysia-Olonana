  // Navbar scroll effect
    window.addEventListener('scroll', function() {
        const navbar = document.getElementById('navbar');
        if (window.scrollY > 50) navbar.classList.add('scrolled');
        else navbar.classList.remove('scrolled');
    });

    // Mobile Menu Logic
    const hamburger = document.getElementById('hamburgerBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const closeMenu = document.getElementById('closeMenuBtn');
    function openMobile() { mobileMenu.classList.add('active'); }
    function closeMobile() { mobileMenu.classList.remove('active'); }
    hamburger.addEventListener('click', openMobile);
    closeMenu.addEventListener('click', closeMobile);
    document.querySelectorAll('.mobile-menu a').forEach(link => link.addEventListener('click', closeMobile));

    // Floorplan Tabs
    const groundContent = `<div class="floor-plan-img"><i class="fas fa-building" style="font-size:2rem; color:var(--gold-muted)"></i><p style="font-size:1rem; margin-top:15px"><strong>Ground Floor — Master Layout</strong></p><p>4 En-suite Bedrooms · Utility + Laundry Wing · Separate Servant Quarters Entrance · Expansive Living/Dining</p></div>`;
    const firstContent = `<div class="floor-plan-img"><i class="fas fa-sun" style="font-size:2rem; color:var(--gold-muted)"></i><p style="font-size:1rem; margin-top:15px"><strong>First Floor — Rooftop Terrace & Additional Lounge</strong></p><p>Flat roof transforms into a private terrace, sky lounge, and panoramic entertainment deck.</p></div>`;
    const tabs = document.querySelectorAll('.tab-btn');
    const displayDiv = document.getElementById('floorDisplay');
    tabs.forEach(btn => {
        btn.addEventListener('click', (e) => {
            tabs.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            if(btn.getAttribute('data-plan') === 'ground') displayDiv.innerHTML = groundContent;
            else displayDiv.innerHTML = firstContent;
        });
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if(targetId === "#" || targetId === "") return;
            const target = document.querySelector(targetId);
            if(target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                if(mobileMenu.classList.contains('active')) closeMobile();
            }
        });
    });

    // GSAP Animation (scroll reveals)
    gsap.registerPlugin(ScrollTrigger);
    gsap.from(".spec-item", { opacity: 0, y: 40, duration: 1, stagger: 0.15, scrollTrigger: { trigger: ".spec-section", start: "top 80%" } });
    gsap.from(".testimonial-card", { opacity: 0, y: 30, duration: 0.9, stagger: 0.2, scrollTrigger: { trigger: "#testimonials", start: "top 75%" } });
    gsap.from(".flagship-img, .flagship-content", { opacity: 0, x: -30, duration: 1, scrollTrigger: { trigger: "#flagship", start: "top 70%" } });

    // simple form alert (demo)
    document.getElementById('consultForm')?.addEventListener('submit', (e) => { e.preventDefault(); alert('Thank you — our private office will respond within 24 hours.'); });
