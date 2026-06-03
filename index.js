const navbar = document.getElementById("navbar");
const progress = document.getElementById("siteProgress");
const menuToggle = document.getElementById("menuToggle");
const mobilePanel = document.getElementById("mobilePanel");
const mobileClose = document.getElementById("mobileClose");
const scrim = document.getElementById("scrim");
const leadForm = document.getElementById("leadForm");
const formNote = document.getElementById("formNote");
const galleryPreview = document.getElementById("galleryPreview");

const whatsappNumber = "254722414994";
const businessEmail = "elysiaolonana@gmail.com";

let lastScrollY = window.scrollY;

function updateScrollUI() {
  const scrollTop = window.scrollY;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const percent = max > 0 ? (scrollTop / max) * 100 : 0;

  navbar?.classList.toggle("scrolled", scrollTop > 24);
  if (progress) progress.style.width = percent + "%";

  const scrollingDown = scrollTop > lastScrollY;
  const pastHero = scrollTop > 120;

  if (scrollingDown && pastHero && !document.body.classList.contains("menu-open")) {
    navbar?.classList.add("nav-hidden");
  } else {
    navbar?.classList.remove("nav-hidden");
  }

  lastScrollY = Math.max(scrollTop, 0);
}

window.addEventListener("scroll", updateScrollUI, { passive: true });
updateScrollUI();

function openMenu() {
  document.body.classList.add("menu-open");
  mobilePanel?.classList.add("open");
  scrim?.classList.add("open");
  if (scrim) scrim.hidden = false;
  mobilePanel?.setAttribute("aria-hidden", "false");
  menuToggle?.setAttribute("aria-expanded", "true");
  menuToggle?.classList.add("is-open");
  navbar?.classList.remove("nav-hidden");
}

function closeMenu() {
  document.body.classList.remove("menu-open");
  mobilePanel?.classList.remove("open");
  scrim?.classList.remove("open");
  mobilePanel?.setAttribute("aria-hidden", "true");
  menuToggle?.setAttribute("aria-expanded", "false");
  menuToggle?.classList.remove("is-open");

  setTimeout(() => {
    if (!document.body.classList.contains("menu-open") && scrim) {
      scrim.hidden = true;
    }
  }, 250);
}

menuToggle?.addEventListener("click", openMenu);
mobileClose?.addEventListener("click", closeMenu);
scrim?.addEventListener("click", closeMenu);
mobilePanel?.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", closeMenu);
});

function openModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;

  document.querySelectorAll(".modal.open").forEach(closeModal);

  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  navbar?.classList.remove("nav-hidden");

  const focusable = modal.querySelector("button, input, textarea, select, a");
  if (focusable) {
    setTimeout(() => focusable.focus(), 50);
  }
}

function closeModal(modal) {
  if (!modal) return;

  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");

  if (!document.querySelector(".modal.open")) {
    document.body.classList.remove("modal-open");
  }
}

document.querySelectorAll("[data-open-modal]").forEach(trigger => {
  trigger.addEventListener("click", event => {
    event.preventDefault();
    openModal(trigger.dataset.openModal);
  });
});

document.querySelectorAll("[data-close-modal]").forEach(button => {
  button.addEventListener("click", () => {
    closeModal(button.closest(".modal"));
  });
});

document.querySelectorAll(".modal").forEach(modal => {
  modal.addEventListener("click", event => {
    if (event.target === modal) {
      closeModal(modal);
    }
  });
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    document.querySelectorAll(".modal.open").forEach(closeModal);

    if (mobilePanel?.classList.contains("open")) {
      closeMenu();
    }
  }
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", event => {
    const href = anchor.getAttribute("href");

    if (!href || href === "#") return;

    const target = document.querySelector(href);
    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    closeMenu();
  });
});

// Basic gallery preview modal
function bindGalleryPreview() {
  document.querySelectorAll(".gallery-item").forEach(item => {
    item.addEventListener("click", () => {
      const img = item.dataset.galleryImg;

      if (!img || !galleryPreview) return;

      galleryPreview.style.setProperty("--preview", "url('" + img + "')");
      openModal("galleryModal");
    });
  });
}

bindGalleryPreview();

function formatNumber(number) {
  return String(number).padStart(2, "0");
}

function setupScroller({ trackId, itemSelector, prevId, nextId, counterId, fillId }) {
  const track = document.getElementById(trackId);
  const items = track ? Array.from(track.querySelectorAll(itemSelector)) : [];
  const prev = document.getElementById(prevId);
  const next = document.getElementById(nextId);
  const counter = document.getElementById(counterId);
  const fill = document.getElementById(fillId);

  let activeIndex = 0;

  function getStep() {
    if (!track || !items.length) return 0;

    const styles = window.getComputedStyle(track);
    const gap = parseFloat(styles.columnGap || styles.gap || 0);

    return items[0].getBoundingClientRect().width + gap;
  }

  function updateUI() {
    if (!items.length) return;

    const total = items.length;
    const current = activeIndex + 1;

    if (counter) {
      counter.textContent = `${formatNumber(current)} / ${formatNumber(total)}`;
    }

    if (fill) {
      fill.style.width = `${total > 1 ? (current / total) * 100 : 100}%`;
    }
  }

  function scrollToIndex(index) {
    if (!track || !items.length) return;

    activeIndex = Math.max(0, Math.min(index, items.length - 1));

    track.scrollTo({
      left: getStep() * activeIndex,
      behavior: "smooth"
    });

    updateUI();
  }

  function syncOnScroll() {
    const step = getStep();
    if (!step) return;

    activeIndex = Math.round(track.scrollLeft / step);
    activeIndex = Math.max(0, Math.min(activeIndex, items.length - 1));

    updateUI();
  }

  prev?.addEventListener("click", () => {
    scrollToIndex(activeIndex - 1);
  });

  next?.addEventListener("click", () => {
    scrollToIndex(activeIndex + 1);
  });

  track?.addEventListener("scroll", () => {
    window.requestAnimationFrame(syncOnScroll);
  }, { passive: true });

  window.addEventListener("resize", updateUI, { passive: true });

  updateUI();
}

setupScroller({
  trackId: "homeGallery",
  itemSelector: ".gallery-item",
  prevId: "homeGalleryPrev",
  nextId: "homeGalleryNext",
  counterId: "homeGalleryCounter",
  fillId: "homeGalleryProgressFill"
});

setupScroller({
  trackId: "homeTestimonialTrack",
  itemSelector: ".testimonial-card",
  prevId: "homeTestimonialPrev",
  nextId: "homeTestimonialNext",
  counterId: "homeTestimonialCounter",
  fillId: "homeTestimonialProgressFill"
});

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: .15 });

  document.querySelectorAll("[data-reveal]").forEach(item => {
    revealObserver.observe(item);
  });
} else {
  document.querySelectorAll("[data-reveal]").forEach(item => {
    item.classList.add("visible");
  });
}

leadForm?.addEventListener("submit", event => {
  event.preventDefault();

  if (!leadForm.checkValidity()) {
    if (formNote) formNote.textContent = "Please complete all required fields.";
    return;
  }

  const fd = new FormData(leadForm);
  const name = (fd.get("name") || "").trim();
  const phone = (fd.get("phone") || "").trim();
  const email = (fd.get("email") || "").trim();
  const buyerType = (fd.get("buyerType") || "").trim();
  const viewingDate = (fd.get("viewingDate") || "").trim();
  const message = (fd.get("message") || "").trim();

  const plain =
    "New inquiry from Elysia Olonana homepage\n\n" +
    "Name: " + name + "\n" +
    "Phone: " + phone + "\n" +
    "Email: " + email + "\n" +
    "Buyer type: " + (buyerType || "Not specified") + "\n" +
    "Preferred viewing date: " + (viewingDate || "Not specified") + "\n" +
    "Message: " + message + "\n\n" +
    "Property: 283 sqm home\n" +
    "Price: KSh 23,000,000\n" +
    "Location: Kyumvi, Kithini";

  const encoded = encodeURIComponent(plain);

  if (formNote) {
    formNote.textContent = "Opening WhatsApp and preparing your email...";
  }

  window.open(
    "https://wa.me/" + whatsappNumber + "?text=" + encoded,
    "_blank",
    "noopener"
  );

  setTimeout(() => {
    window.location.href =
      "mailto:" +
      businessEmail +
      "?subject=Elysia%20Olonana%20Homepage%20Inquiry&body=" +
      encoded;
  }, 650);
});