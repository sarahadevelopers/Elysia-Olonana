(function(){
    // Smart navbar hide/show
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

    // Mobile menu
    function openMenu() { document.body.classList.add("menu-open"); mobilePanel.classList.add("open"); scrim.classList.add("open"); scrim.hidden = false; menuToggle.setAttribute("aria-expanded", "true"); menuToggle.classList.add("is-open"); }
    function closeMenu() { document.body.classList.remove("menu-open"); mobilePanel.classList.remove("open"); scrim.classList.remove("open"); menuToggle.setAttribute("aria-expanded", "false"); menuToggle.classList.remove("is-open"); setTimeout(() => { if (!document.body.classList.contains("menu-open")) scrim.hidden = true; }, 250); }
    menuToggle.addEventListener("click", openMenu);
    mobileClose.addEventListener("click", closeMenu);
    scrim.addEventListener("click", closeMenu);
    mobilePanel.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMenu));

    // Modal handling
    function openModal(id) { const modal = document.getElementById(id); if (modal) { modal.classList.add("open"); modal.setAttribute("aria-hidden", "false"); document.body.classList.add("modal-open"); } }
    function closeModal(modal) { modal.classList.remove("open"); modal.setAttribute("aria-hidden", "true"); if (!document.querySelector(".modal.open")) document.body.classList.remove("modal-open"); }
    document.querySelectorAll("[data-open-modal]").forEach(trigger => trigger.addEventListener("click", e => { e.preventDefault(); openModal(trigger.dataset.openModal); }));
    document.querySelectorAll("[data-close-modal]").forEach(btn => btn.addEventListener("click", () => closeModal(btn.closest(".modal"))));
    document.querySelectorAll(".modal").forEach(modal => modal.addEventListener("click", e => { if (e.target === modal) closeModal(modal); }));
    document.addEventListener("keydown", e => { if (e.key === "Escape") { document.querySelectorAll(".modal.open").forEach(closeModal); if (mobilePanel.classList.contains("open")) closeMenu(); } });

    // Intersection Observer for reveals
    const observer = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("visible"); observer.unobserve(e.target); } }), { threshold: .15 });
    document.querySelectorAll("[data-reveal]").forEach(el => observer.observe(el));

    // Form submission
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
      if (!name || !phone || !email) { formNote.textContent = "Please fill required fields."; return; }
      const plain = `New inquiry from blog post\n\nName: ${name}\nPhone: ${phone}\nEmail: ${email}\nBuyer type: ${buyerType}\nPreferred date: ${date}\nMessage: ${msg}`;
      const encoded = encodeURIComponent(plain);
      formNote.textContent = "Opening WhatsApp and preparing email...";
      window.open(`https://wa.me/${whatsappNumber}?text=${encoded}`, "_blank");
      setTimeout(() => window.location.href = `mailto:${businessEmail}?subject=Blog%20post%20inquiry&body=${encoded}`, 650);
    });
  })();