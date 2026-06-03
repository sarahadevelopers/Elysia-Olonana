 (function(){
    // ==================== BLOG DATA ====================
    const allPosts = [
      { title: "Why flat‑roof design is redefining modern luxury in Kenya", excerpt: "Explore the engineering and lifestyle benefits of flat roofs – from waterproofing to rooftop gardens and panoramic views.", date: "May 28, 2026", category: "Architecture", img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80", link: "#" },
      { title: "Servant quarters vs utility wing: designing for family privacy", excerpt: "How thoughtful zoning creates separation between service staff and family living without sacrificing elegance.", date: "May 20, 2026", category: "Design", img: "https://images.unsplash.com/photo-1600210491369-e753d80a41f3?auto=format&fit=crop&w=800&q=80", link: "#" },
      { title: "Kyumvi, Kithini: why investors are watching this corridor", excerpt: "Infrastructure growth, land value trends, and the shift towards modern gated communities.", date: "May 12, 2026", category: "Investment", img: "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80", link: "#" },
      { title: "10 finishes that define quiet luxury in a 283 sqm home", excerpt: "From Italian marble to concealed lighting – materials that age beautifully and elevate daily life.", date: "May 5, 2026", category: "Finishes", img: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80", link: "#" },
      { title: "Flat‑roof terrace: adding 100 sqm of lifestyle value", excerpt: "How to transform a roof slab into an outdoor lounge, garden, or entertainment deck.", date: "Apr 28, 2026", category: "Lifestyle", img: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80", link: "#" },
      { title: "What diaspora buyers should know before investing in Kenya", excerpt: "Legal process, financing options, remote viewing, and title transfer explained.", date: "Apr 18, 2026", category: "Buyer Guide", img: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=800&q=80", link: "#" },
      { title: "Modern family homes: why 4 en‑suite bedrooms are the new standard", excerpt: "Privacy, guest accommodation, and the evolution of bedroom planning.", date: "Apr 10, 2026", category: "Design", img: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80", link: "#" },
      { title: "The cost of building vs buying a turnkey residence in 2026", excerpt: "Comparing timelines, price volatility, and the value of a finished home.", date: "Apr 2, 2026", category: "Investment", img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80", link: "#" },
      { title: "Landscape design for flat‑roof homes: native plants & hardscaping", excerpt: "Low‑maintenance gardens that complement modern architecture.", date: "Mar 25, 2026", category: "Outdoor", img: "https://images.unsplash.com/photo-1618219740975-4091bb63b46f?auto=format&fit=crop&w=800&q=80", link: "#" }
    ];

    const postsPerPage = 6;
    let currentPage = 1;
    let filteredPosts = [...allPosts];
    let searchTerm = "";

    function renderBlog() {
      const start = (currentPage - 1) * postsPerPage;
      const paginated = filteredPosts.slice(start, start + postsPerPage);
      const grid = document.getElementById("blogGrid");
      if (!grid) return;
      if (paginated.length === 0) {
        grid.innerHTML = `<div style="grid-column:1/-1; text-align:center; padding:60px;"><p>No articles match your search. Try another keyword.</p></div>`;
        return;
      }
      grid.innerHTML = paginated.map(post => `
        <article class="blog-card" data-reveal>
          <img class="blog-img" src="${post.img}" alt="${post.title}" loading="lazy">
          <div class="blog-content">
            <div class="blog-meta"><span class="category">${post.category}</span><span>${post.date}</span></div>
            <h3>${post.title}</h3>
            <p>${post.excerpt}</p>
            <a href="${post.link}" class="read-more">Read more <i class="fas fa-arrow-right"></i></a>
          </div>
        </article>
      `).join("");
      // re-trigger reveal animation
      document.querySelectorAll("[data-reveal]").forEach(el => el.classList.remove("visible"));
      const observer = new IntersectionObserver(entries => entries.forEach(e => { if(e.isIntersecting) { e.target.classList.add("visible"); observer.unobserve(e.target); } }), { threshold: .15 });
      document.querySelectorAll("[data-reveal]").forEach(el => observer.observe(el));
    }

    function renderPagination() {
      const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
      const container = document.getElementById("paginationContainer");
      if (!container) return;
      if (totalPages <= 1) { container.innerHTML = ""; return; }
      let buttons = `<button class="page-btn ${currentPage === 1 ? 'disabled' : ''}" data-page="prev"><i class="fas fa-chevron-left"></i></button>`;
      for (let i = 1; i <= totalPages; i++) {
        buttons += `<button class="page-btn ${currentPage === i ? 'active' : ''}" data-page="${i}">${i}</button>`;
      }
      buttons += `<button class="page-btn ${currentPage === totalPages ? 'disabled' : ''}" data-page="next"><i class="fas fa-chevron-right"></i></button>`;
      container.innerHTML = buttons;

      container.querySelectorAll(".page-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          if (btn.classList.contains("disabled")) return;
          const page = btn.dataset.page;
          if (page === "prev") currentPage = Math.max(1, currentPage - 1);
          else if (page === "next") currentPage = Math.min(totalPages, currentPage + 1);
          else currentPage = parseInt(page, 10);
          renderBlog();
          renderPagination();
          window.scrollTo({ top: document.querySelector(".blog-grid").offsetTop - 80, behavior: "smooth" });
        });
      });
    }

    function updateSearch() {
      searchTerm = document.getElementById("searchInput")?.value.trim().toLowerCase() || "";
      filteredPosts = allPosts.filter(post => post.title.toLowerCase().includes(searchTerm) || post.excerpt.toLowerCase().includes(searchTerm));
      currentPage = 1;
      renderBlog();
      renderPagination();
    }

    renderBlog();
    renderPagination();
    const searchInput = document.getElementById("searchInput");
    if (searchInput) searchInput.addEventListener("input", updateSearch);

    // ==================== NAVBAR SCROLL LOGIC (hide on down, show on up) ====================
    const navbar = document.getElementById("navbar");
    const progress = document.getElementById("siteProgress");
    const menuToggle = document.getElementById("menuToggle");
    const mobilePanel = document.getElementById("mobilePanel");
    const mobileClose = document.getElementById("mobileClose");
    const scrim = document.getElementById("scrim");
    let lastScrollY = window.scrollY;

    function updateScrollUI() {
      const scrollTop = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const percent = max > 0 ? (scrollTop / max) * 100 : 0;
      navbar.classList.toggle("scrolled", scrollTop > 24);
      progress.style.width = `${percent}%`;
      const scrollingDown = scrollTop > lastScrollY;
      const pastHero = scrollTop > 120;
      if (scrollingDown && pastHero && !document.body.classList.contains("menu-open")) {
        navbar.classList.add("nav-hidden");
      } else {
        navbar.classList.remove("nav-hidden");
      }
      lastScrollY = Math.max(scrollTop, 0);
    }
    window.addEventListener("scroll", updateScrollUI, { passive: true });
    updateScrollUI();

    // ==================== MOBILE MENU ====================
    function openMenu() { document.body.classList.add("menu-open"); mobilePanel.classList.add("open"); scrim.classList.add("open"); scrim.hidden = false; menuToggle.setAttribute("aria-expanded", "true"); menuToggle.classList.add("is-open"); }
    function closeMenu() { document.body.classList.remove("menu-open"); mobilePanel.classList.remove("open"); scrim.classList.remove("open"); menuToggle.setAttribute("aria-expanded", "false"); menuToggle.classList.remove("is-open"); setTimeout(() => { if (!document.body.classList.contains("menu-open")) scrim.hidden = true; }, 250); }
    menuToggle.addEventListener("click", openMenu);
    mobileClose.addEventListener("click", closeMenu);
    scrim.addEventListener("click", closeMenu);
    mobilePanel.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMenu));

    // ==================== MODAL HANDLING ====================
    function openModal(id) { const modal = document.getElementById(id); if (modal) { modal.classList.add("open"); modal.setAttribute("aria-hidden", "false"); document.body.classList.add("modal-open"); } }
    function closeModal(modal) { modal.classList.remove("open"); modal.setAttribute("aria-hidden", "true"); if (!document.querySelector(".modal.open")) document.body.classList.remove("modal-open"); }
    document.querySelectorAll("[data-open-modal]").forEach(trigger => trigger.addEventListener("click", e => { e.preventDefault(); openModal(trigger.dataset.openModal); }));
    document.querySelectorAll("[data-close-modal]").forEach(btn => btn.addEventListener("click", () => closeModal(btn.closest(".modal"))));
    document.querySelectorAll(".modal").forEach(modal => modal.addEventListener("click", e => { if (e.target === modal) closeModal(modal); }));
    document.addEventListener("keydown", e => { if (e.key === "Escape") { document.querySelectorAll(".modal.open").forEach(closeModal); if (mobilePanel.classList.contains("open")) closeMenu(); } });

    // ==================== FORM SUBMISSION (WhatsApp + email) ====================
    const leadForm = document.getElementById("leadForm");
    const formNote = document.getElementById("formNote");
    const whatsappNumber = "254722414994";
    const businessEmail = "elysiaolonana@gmail.com";
    leadForm?.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("name").value.trim();
      const phone = document.getElementById("phone").value.trim();
      const email = document.getElementById("email").value.trim();
      const buyerType = document.getElementById("buyerType")?.value || "";
      const date = document.getElementById("date")?.value || "";
      const msg = document.getElementById("message").value.trim();
      if (!name || !phone || !email) { formNote.textContent = "Please complete all fields."; return; }
      const plain = `New inquiry from blog\n\nName: ${name}\nPhone: ${phone}\nEmail: ${email}\nBuyer type: ${buyerType}\nPreferred date: ${date}\nMessage: ${msg}`;
      const encoded = encodeURIComponent(plain);
      formNote.textContent = "Opening WhatsApp and preparing email...";
      window.open(`https://wa.me/${whatsappNumber}?text=${encoded}`, "_blank");
      setTimeout(() => window.location.href = `mailto:${businessEmail}?subject=Blog%20inquiry&body=${encoded}`, 650);
    });

    // ==================== REVEAL ANIMATION (Intersection Observer) ====================
    const observer = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("visible"); observer.unobserve(e.target); } }), { threshold: .15 });
    document.querySelectorAll("[data-reveal]").forEach(el => observer.observe(el));

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => anchor.addEventListener("click", e => { const target = document.querySelector(anchor.getAttribute("href")); if (target) { e.preventDefault(); target.scrollIntoView({ behavior: "smooth" }); closeMenu(); } }));
  })();