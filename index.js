 const navbar = document.getElementById("navbar");
    const progress = document.getElementById("siteProgress");
    const menuToggle = document.getElementById("menuToggle");
    const mobilePanel = document.getElementById("mobilePanel");
    const mobileClose = document.getElementById("mobileClose");
    const scrim = document.getElementById("scrim");
    const track = document.getElementById("testimonialTrack");
    const prev = document.getElementById("prevTestimonial");
    const next = document.getElementById("nextTestimonial");
    const leadForm = document.getElementById("leadForm");
    const formNote = document.getElementById("formNote");
    const galleryPreview = document.getElementById("galleryPreview");
    const logoTemplate = document.getElementById("logoTemplate");

    const whatsappNumber = "254722414994";
    const businessEmail = "elysiaolonana@gmail.com";

    document.querySelectorAll(".js-logo").forEach((target) => {
      const clone = logoTemplate.content.cloneNode(true);
      target.appendChild(clone);
    });

    function updateScrollUI() {
      const scrollTop = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const percent = max > 0 ? (scrollTop / max) * 100 : 0;
      navbar.classList.toggle("scrolled", scrollTop > 24);
      progress.style.width = `${percent}%`;
    }

    window.addEventListener("scroll", updateScrollUI, { passive: true });
    updateScrollUI();

    function openMenu() {
      document.body.classList.add("menu-open");
      mobilePanel.classList.add("open");
      scrim.classList.add("open");
      scrim.hidden = false;
      mobilePanel.setAttribute("aria-hidden", "false");
      menuToggle.setAttribute("aria-expanded", "true");
      menuToggle.classList.add("is-open");
    }

    function closeMenu() {
      document.body.classList.remove("menu-open");
      mobilePanel.classList.remove("open");
      scrim.classList.remove("open");
      mobilePanel.setAttribute("aria-hidden", "true");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.classList.remove("is-open");
      setTimeout(() => {
        if (!document.body.classList.contains("menu-open")) scrim.hidden = true;
      }, 250);
    }

    menuToggle.addEventListener("click", openMenu);
    mobileClose.addEventListener("click", closeMenu);
    scrim.addEventListener("click", closeMenu);
    mobilePanel.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));

    function openModal(id) {
      const modal = document.getElementById(id);
      if (!modal) return;
      modal.classList.add("open");
      modal.setAttribute("aria-hidden", "false");
      document.body.classList.add("modal-open");
      const focusable = modal.querySelector("button, input, textarea, a");
      if (focusable) setTimeout(() => focusable.focus(), 50);
    }

    function closeModal(modal) {
      modal.classList.remove("open");
      modal.setAttribute("aria-hidden", "true");
      if (!document.querySelector(".modal.open")) document.body.classList.remove("modal-open");
    }

    document.querySelectorAll("[data-open-modal]").forEach((trigger) => {
      trigger.addEventListener("click", (event) => {
        event.preventDefault();
        openModal(trigger.dataset.openModal);
      });
    });

    document.querySelectorAll("[data-close-modal]").forEach((button) => {
      button.addEventListener("click", () => closeModal(button.closest(".modal")));
    });

    document.querySelectorAll(".modal").forEach((modal) => {
      modal.addEventListener("click", (event) => {
        if (event.target === modal) closeModal(modal);
      });
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        document.querySelectorAll(".modal.open").forEach(closeModal);
        if (mobilePanel.classList.contains("open")) closeMenu();
      }
    });

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", (event) => {
        const href = anchor.getAttribute("href");
        if (!href || href === "#") return;
        const target = document.querySelector(href);
        if (!target) return;
        event.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });

    function slideTestimonials(direction) {
      const card = track.querySelector(".testimonial-card");
      const distance = card ? card.offsetWidth + 14 : track.clientWidth;
      track.scrollBy({ left: direction * distance, behavior: "smooth" });
    }

    prev.addEventListener("click", () => slideTestimonials(-1));
    next.addEventListener("click", () => slideTestimonials(1));

    let autoSlide = setInterval(() => slideTestimonials(1), 5200);
    track.addEventListener("pointerdown", () => clearInterval(autoSlide), { once: true });

    document.querySelectorAll(".gallery-item").forEach((item) => {
      item.addEventListener("click", () => {
        const img = item.dataset.galleryImg;
        galleryPreview.style.setProperty("--preview", `url('${img}')`);
        openModal("galleryModal");
      });
    });

    if ("IntersectionObserver" in window) {
      const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        });
      }, { threshold: .15 });

      document.querySelectorAll("[data-reveal]").forEach((item) => revealObserver.observe(item));
    } else {
      document.querySelectorAll("[data-reveal]").forEach((item) => item.classList.add("visible"));
    }

    const sections = [...document.querySelectorAll("main section[id]")];
    const navAnchors = [...document.querySelectorAll("#navLinks a")];

    if ("IntersectionObserver" in window) {
      const activeObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          navAnchors.forEach((link) => {
            link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
          });
        });
      }, { rootMargin: "-45% 0px -50% 0px" });

      sections.forEach((section) => activeObserver.observe(section));
    }

    leadForm.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!leadForm.checkValidity()) {
        formNote.textContent = "Please complete all required fields.";
        return;
      }

      const formData = new FormData(leadForm);
      const name = formData.get("name").trim();
      const phone = formData.get("phone").trim();
      const email = formData.get("email").trim();
      const message = formData.get("message").trim();

      const plainMessage =
        `New Elysia Olonana inquiry\n\n` +
        `Name: ${name}\n` +
        `Phone: ${phone}\n` +
        `Email: ${email}\n` +
        `Message: ${message}\n\n` +
        `Property: 283 sqm residence\n` +
        `Price: KSh 23,000,000\n` +
        `Location: Kyumvi, Kithini`;

      const encodedMessage = encodeURIComponent(plainMessage);
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
      const mailSubject = encodeURIComponent("Elysia Olonana Private Viewing Inquiry");
      const mailtoUrl = `mailto:${businessEmail}?subject=${mailSubject}&body=${encodedMessage}`;

      formNote.textContent = "Opening WhatsApp and preparing your email client...";
      window.open(whatsappUrl, "_blank", "noopener");

      setTimeout(() => {
        window.location.href = mailtoUrl;
      }, 650);
    });