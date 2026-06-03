(function() {
  // ===== SMART NAVBAR =====
  const navbar = document.getElementById("navbar");
  const progress = document.getElementById("siteProgress");
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

  // ===== MOBILE MENU =====
  const menuToggle = document.getElementById("menuToggle");
  const mobilePanel = document.getElementById("mobilePanel");
  const mobileClose = document.getElementById("mobileClose");
  const scrim = document.getElementById("scrim");

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

  // ===== MODALS =====
  function openModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
      modal.classList.add("open");
      modal.setAttribute("aria-hidden", "false");
      document.body.classList.add("modal-open");
    }
  }

  function closeModal(modal) {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    if (!document.querySelector(".modal.open")) document.body.classList.remove("modal-open");
  }

  document.querySelectorAll("[data-open-modal]").forEach(trigger => {
    trigger.addEventListener("click", e => {
      e.preventDefault();
      openModal(trigger.dataset.openModal);
    });
  });

  document.querySelectorAll("[data-close-modal]").forEach(btn => {
    btn.addEventListener("click", () => closeModal(btn.closest(".modal")));
  });

  document.querySelectorAll(".modal").forEach(modal => {
    modal.addEventListener("click", e => { if (e.target === modal) closeModal(modal); });
  });

  document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
      document.querySelectorAll(".modal.open").forEach(closeModal);
      if (mobilePanel.classList.contains("open")) closeMenu();
    }
  });

  // ===== PREMIUM GALLERY CAROUSEL =====
// ===== PREMIUM GALLERY CAROUSEL: COUNTER + PROGRESS =====
const projectGallery = document.getElementById("projectGallery");
const galleryPrev = document.getElementById("galleryPrev");
const galleryNext = document.getElementById("galleryNext");
const galleryCounter = document.getElementById("galleryCounter");
const galleryProgressFill = document.getElementById("galleryProgressFill");
const galleryItems = Array.from(document.querySelectorAll(".project-gallery-item"));

let activeGalleryIndex = 0;

function formatNumber(number) {
  return String(number).padStart(2, "0");
}

function getGalleryStep() {
  if (!projectGallery || !galleryItems.length) return 0;

  const firstItem = galleryItems[0];
  const styles = window.getComputedStyle(projectGallery);
  const gap = parseFloat(styles.columnGap || styles.gap || 0);

  return firstItem.getBoundingClientRect().width + gap;
}

function updateGalleryProgress() {
  if (!galleryCounter || !galleryProgressFill || !galleryItems.length) return;

  const total = galleryItems.length;
  const current = activeGalleryIndex + 1;
  const progress = total > 1 ? (current / total) * 100 : 100;

  galleryCounter.textContent = `${formatNumber(current)} / ${formatNumber(total)}`;
  galleryProgressFill.style.width = `${progress}%`;
}

function scrollGalleryTo(index) {
  if (!projectGallery || !galleryItems.length) return;

  activeGalleryIndex = Math.max(0, Math.min(index, galleryItems.length - 1));

  projectGallery.scrollTo({
    left: getGalleryStep() * activeGalleryIndex,
    behavior: "smooth"
  });

  updateGalleryProgress();
}

function syncGalleryIndexOnScroll() {
  if (!projectGallery || !galleryItems.length) return;

  const step = getGalleryStep();
  if (!step) return;

  activeGalleryIndex = Math.round(projectGallery.scrollLeft / step);
  activeGalleryIndex = Math.max(0, Math.min(activeGalleryIndex, galleryItems.length - 1));

  updateGalleryProgress();
}

galleryPrev?.addEventListener("click", () => scrollGalleryTo(activeGalleryIndex - 1));
galleryNext?.addEventListener("click", () => scrollGalleryTo(activeGalleryIndex + 1));

projectGallery?.addEventListener("scroll", () => {
  window.requestAnimationFrame(syncGalleryIndexOnScroll);
}, { passive: true });

galleryItems.forEach((item, index) => {
  item.addEventListener("click", () => {
    activeGalleryIndex = index;
    updateGalleryProgress();

    const img = item.dataset.galleryImg;
    if (!img) return;

    galleryPreview.style.backgroundImage = `url('${img}')`;
    openModal("galleryModal");
  });
});

updateGalleryProgress();

  // ===== GALLERY PREVIEW =====
  const galleryPreview = document.getElementById("galleryPreview");
  document.querySelectorAll(".project-gallery-item").forEach(item => {
    item.addEventListener("click", () => {
      const img = item.dataset.galleryImg;
      if (img) {
        galleryPreview.style.backgroundImage = `url('${img}')`;
        openModal("galleryModal");
      }
    });
  });

  // ===== FLOORPLAN TABS =====
  const tabBtns = document.querySelectorAll(".tab-btn");
  const planImg = document.getElementById("floorplanImg");
  const planDesc = document.getElementById("floorplanDesc");
  const floorplanLabel = document.getElementById("floorplanLabel");

  const plans = {
    ground: { 
      img: "https://placehold.co/800x500/14061f/e3bc6c?text=Ground+Floor+Plan",
      label: "Ground Floor",
      text: "Ground floor: open living and dining, guest bedroom, laundry area, and separate staff room access."
    },
    first: { 
      img: "https://placehold.co/800x500/14061f/e3bc6c?text=First+Floor+Plan",
      label: "First Floor",
      text: "First floor: three en-suite bedrooms, family lounge, and access to the rooftop terrace."
    },
    roof: { 
      img: "https://placehold.co/800x500/14061f/e3bc6c?text=Rooftop+Terrace",
      label: "Rooftop Terrace",
      text: "Rooftop terrace: open space for outdoor seating, family events, or a garden setup."
    },
    compound: { 
      img: "https://placehold.co/800x500/14061f/e3bc6c?text=Compound+Layout",
      label: "Compound Layout",
      text: "Compound layout: secure parking, landscaped areas, perimeter wall, and separate service access."
    }
  };

  tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      tabBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const planKey = btn.dataset.plan;
      const plan = plans[planKey];
      if (!plan) return;

      planImg.src = plan.img;
      planImg.alt = `${plan.label} for Elysia Olonana`;
      planDesc.innerText = plan.text;
      floorplanLabel.innerText = plan.label;
    });
  });

  // ===== FAQ (only one open) =====
  document.querySelectorAll(".faq-question").forEach(btn => {
    btn.addEventListener("click", () => {
      const expanded = btn.getAttribute("aria-expanded") === "true";
      document.querySelectorAll(".faq-question").forEach(other => {
        if (other !== btn && other.getAttribute("aria-expanded") === "true") {
          other.setAttribute("aria-expanded", "false");
          other.nextElementSibling.classList.remove("show");
          other.nextElementSibling.style.maxHeight = null;
        }
      });
      btn.setAttribute("aria-expanded", !expanded);
      const answer = btn.nextElementSibling;
      if (!expanded) {
        answer.classList.add("show");
        answer.style.maxHeight = answer.scrollHeight + "px";
      } else {
        answer.classList.remove("show");
        answer.style.maxHeight = null;
      }
    });
  });

  // ===== REVEAL ANIMATIONS =====
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll("[data-reveal]").forEach(el => observer.observe(el));

  // ===== SMOOTH ANCHOR SCROLL =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", e => {
      const target = document.querySelector(anchor.getAttribute("href"));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth" });
        closeMenu();
      }
    });
  });
// ===== HORIZONTAL PREMIUM JOURNEY CAROUSEL =====
const journeyCarousel = document.getElementById("journeyCarousel");
const journeyDotsContainer = document.getElementById("journeyDots");
const journeyCards = Array.from(journeyCarousel.children);
const journeyPrev = document.querySelector(".journey-arrow.left");
const journeyNext = document.querySelector(".journey-arrow.right");

let activeJourneyIndex = 0;

// Build dots
journeyCards.forEach((_, index) => {
  const dot = document.createElement("button");
  dot.classList.add("journey-dot");
  if(index === 0) dot.classList.add("active");
  dot.setAttribute("aria-label", `Step ${index + 1}`);
  dot.addEventListener("click", () => scrollToStep(index));
  journeyDotsContainer.appendChild(dot);
});

const journeyDots = Array.from(journeyDotsContainer.children);

function scrollToStep(index) {
  const stepWidth = journeyCards[0].getBoundingClientRect().width + parseFloat(getComputedStyle(journeyCarousel).gap);
  journeyCarousel.scrollTo({ left: stepWidth * index, behavior: "smooth" });
  activeJourneyIndex = index;
  updateJourneyDots();
}

function updateJourneyDots() {
  journeyDots.forEach((dot, idx) => {
    dot.classList.toggle("active", idx === activeJourneyIndex);
  });
}

// Arrows
journeyPrev?.addEventListener("click", () => scrollToStep(activeJourneyIndex - 1));
journeyNext?.addEventListener("click", () => scrollToStep(activeJourneyIndex + 1));

// Update on scroll (for swipe)
journeyCarousel.addEventListener("scroll", () => {
  const stepWidth = journeyCards[0].getBoundingClientRect().width + parseFloat(getComputedStyle(journeyCarousel).gap);
  activeJourneyIndex = Math.round(journeyCarousel.scrollLeft / stepWidth);
  activeJourneyIndex = Math.max(0, Math.min(activeJourneyIndex, journeyCards.length - 1));
  updateJourneyDots();
});
  // ===== BROCHURE DOWNLOAD =====
  const downloadBtn = document.getElementById("downloadBrochureBtn");
  if (downloadBtn) {
    downloadBtn.addEventListener("click", e => {
      e.preventDefault();
      alert("Brochure download will start here. Replace with actual PDF file URL.");
    });
  }

  // ===== FORM SUBMISSION (WhatsApp + Email) =====
  const leadForm = document.getElementById("leadForm");
  const formNote = document.getElementById("formNote");
  const whatsappNumber = "254722414994";
  const businessEmail = "elysiaolonana@gmail.com";

  leadForm?.addEventListener("submit", e => {
    e.preventDefault();
    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const email = document.getElementById("email").value.trim();
    const buyerType = document.getElementById("buyerType")?.value || "";
    const date = document.getElementById("date")?.value || "";
    const msg = document.getElementById("message").value.trim();
    if (!name || !phone || !email) { formNote.textContent = "Please fill required fields."; return; }

    const plain = `New inquiry from project page\n\nName: ${name}\nPhone: ${phone}\nEmail: ${email}\nBuyer type: ${buyerType}\nPreferred date: ${date}\nMessage: ${msg}`;
    const encoded = encodeURIComponent(plain);

    formNote.textContent = "Opening WhatsApp and preparing email...";
    window.open(`https://wa.me/${whatsappNumber}?text=${encoded}`, "_blank");
    setTimeout(() => window.location.href = `mailto:${businessEmail}?subject=Project%20inquiry&body=${encoded}`, 650);
  });

})();