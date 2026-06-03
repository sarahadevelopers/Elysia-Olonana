 // ==================== SCROLL HANDLER (hide navbar on down, show on up) ====================
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
    const pastHeroTop = scrollTop > 120;
    if (scrollingDown && pastHeroTop && !document.body.classList.contains("menu-open")) {
      navbar.classList.add("nav-hidden");
    } else {
      navbar.classList.remove("nav-hidden");
    }
    lastScrollY = Math.max(scrollTop, 0);
  }
  window.addEventListener("scroll", updateScrollUI, { passive: true });
  updateScrollUI();

  // ==================== MOBILE MENU ====================
  function openMenu() {
    document.body.classList.add("menu-open");
    mobilePanel.classList.add("open");
    scrim.classList.add("open");
    scrim.hidden = false;
    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.classList.add("is-open");
  }
  function closeMenu() {
    document.body.classList.remove("menu-open");
    mobilePanel.classList.remove("open");
    scrim.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.classList.remove("is-open");
    setTimeout(() => { if (!document.body.classList.contains("menu-open")) scrim.hidden = true; }, 250);
  }
  menuToggle.addEventListener("click", openMenu);
  mobileClose.addEventListener("click", closeMenu);
  scrim.addEventListener("click", closeMenu);
  mobilePanel.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMenu));

  // ==================== MODAL LOGIC ====================
  function openModal(id) { const modal = document.getElementById(id); if (modal) { modal.classList.add("open"); modal.setAttribute("aria-hidden", "false"); document.body.classList.add("modal-open"); } }
  function closeModal(modal) { modal.classList.remove("open"); modal.setAttribute("aria-hidden", "true"); if (!document.querySelector(".modal.open")) document.body.classList.remove("modal-open"); }
  document.querySelectorAll("[data-open-modal]").forEach(trigger => trigger.addEventListener("click", e => { e.preventDefault(); openModal(trigger.dataset.openModal); }));
  document.querySelectorAll("[data-close-modal]").forEach(btn => btn.addEventListener("click", () => closeModal(btn.closest(".modal"))));
  document.querySelectorAll(".modal").forEach(modal => modal.addEventListener("click", e => { if (e.target === modal) closeModal(modal); }));
  document.addEventListener("keydown", e => { if (e.key === "Escape") { document.querySelectorAll(".modal.open").forEach(closeModal); if (mobilePanel.classList.contains("open")) closeMenu(); } });

  // ==================== CONTACT FORM (WhatsApp + email) ====================
  const contactForm = document.getElementById("contactForm");
  const whatsappNumber = "254722414994";
  const businessEmail = "elysiaolonana@gmail.com";
  contactForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("contactName").value.trim();
    const phone = document.getElementById("contactPhone").value.trim();
    const email = document.getElementById("contactEmail").value.trim();
    const date = document.getElementById("contactDate").value;
    const buyerType = document.getElementById("contactBuyerType").value;
    const message = document.getElementById("contactMessage").value.trim();
    if (!name || !phone || !email || !message) {
      alert("Please complete all required fields.");
      return;
    }
    const plain = `New private viewing request\n\nName: ${name}\nPhone: ${phone}\nEmail: ${email}\nPreferred date: ${date || "not specified"}\nBuyer type: ${buyerType || "not specified"}\nMessage: ${message}`;
    const encoded = encodeURIComponent(plain);
    window.open(`https://wa.me/${whatsappNumber}?text=${encoded}`, "_blank");
    setTimeout(() => {
      window.location.href = `mailto:${businessEmail}?subject=Private%20viewing%20request&body=${encoded}`;
    }, 650);
  });

  // ==================== MODAL FORM ====================
  const modalLeadForm = document.getElementById("leadForm");
  const modalFormNote = document.getElementById("modalFormNote");
  modalLeadForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("modalName").value.trim();
    const phone = document.getElementById("modalPhone").value.trim();
    const email = document.getElementById("modalEmail").value.trim();
    const message = document.getElementById("modalMessage").value.trim();
    if (!name || !phone || !email || !message) {
      modalFormNote.textContent = "Please complete all fields.";
      return;
    }
    const plain = `New inquiry from modal\n\nName: ${name}\nPhone: ${phone}\nEmail: ${email}\nMessage: ${message}\nProperty: 283 sqm residence`;
    const encoded = encodeURIComponent(plain);
    modalFormNote.textContent = "Opening WhatsApp and preparing email...";
    window.open(`https://wa.me/${whatsappNumber}?text=${encoded}`, "_blank");
    setTimeout(() => {
      window.location.href = `mailto:${businessEmail}?subject=Elysia%20Olonana%20Inquiry&body=${encoded}`;
    }, 650);
  });

  // ==================== REVEAL ANIMATION ====================
  const observer = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("visible"); observer.unobserve(e.target); } }), { threshold: .15 });
  document.querySelectorAll("[data-reveal]").forEach(el => observer.observe(el));