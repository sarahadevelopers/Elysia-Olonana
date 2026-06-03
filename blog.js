(function() {
  // ==================== VARIABLES ====================
  const blogGrid = document.getElementById("blogGrid");
  const searchInput = document.getElementById("searchInput");
  const paginationContainer = document.getElementById("paginationContainer");

  const navbar = document.getElementById("navbar");
  const progress = document.getElementById("siteProgress");
  const menuToggle = document.getElementById("menuToggle");
  const mobilePanel = document.getElementById("mobilePanel");
  const mobileClose = document.getElementById("mobileClose");
  const scrim = document.getElementById("scrim");

  const leadForm = document.getElementById("leadForm");
  const formNote = document.getElementById("formNote");
  const whatsappNumber = "254722414994";
  const businessEmail = "elysiaolonana@gmail.com";

  let lastScrollY = window.scrollY;
  let allPosts = [];
  let filteredPosts = [];
  let currentPage = 1;
  const postsPerPage = 6;

  // ==================== FETCH BLOGS ====================
  fetch("blogs.json")
    .then(response => response.json())
    .then(posts => {
      allPosts = posts;
      filteredPosts = [...posts];
      renderBlog();
      renderPagination();
    })
    .catch(() => {
      if (blogGrid) blogGrid.innerHTML = "<p>Articles are currently unavailable.</p>";
    });

  // ==================== RENDER BLOG POSTS ====================
  function renderBlog() {
    const start = (currentPage - 1) * postsPerPage;
    const paginated = filteredPosts.slice(start, start + postsPerPage);

    if (!blogGrid) return;

    if (!paginated.length) {
      blogGrid.innerHTML = `
        <div class="empty-state">
          <h3>No articles found</h3>
          <p>Try searching for another topic.</p>
        </div>
      `;
      return;
    }

    blogGrid.innerHTML = paginated.map(post => `
      <article class="blog-card" data-reveal>
      <a href="${post.url}" class="blog-img-link" aria-label="${post.title}">
  <img class="blog-img" src="${post.image}" alt="${post.title}" loading="lazy">
  <span class="blog-category">${post.category}</span>
</a> <div class="blog-content">
          <div class="blog-meta"><span class="category">${post.category}</span><span>${post.date} • ${post.readTime}</span></div>
          <h3><a href="${post.url}">${post.title}</a></h3>
          <p>${post.excerpt}</p>
          <a href="${post.url}" class="blog-read-link">Read article →</a>
        </div>
      </article>
    `).join("");

    // Trigger reveal animations
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          observer.unobserve(e.target);
        }
      });
    }, { threshold: .15 });

    document.querySelectorAll("[data-reveal]").forEach(el => observer.observe(el));
  }

  // ==================== RENDER PAGINATION ====================
  function renderPagination() {
    if (!paginationContainer) return;

    const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
    if (totalPages <= 1) {
      paginationContainer.innerHTML = "";
      return;
    }

    let buttons = `<button class="pagination-btn ${currentPage===1?'disabled':''}" data-page="prev"><i class="fas fa-chevron-left"></i></button>`;
    for (let i=1; i<=totalPages; i++) {
      buttons += `<button class="pagination-btn ${currentPage===i?'active':''}" data-page="${i}">${i}</button>`;
    }
    buttons += `<button class="pagination-btn ${currentPage===totalPages?'disabled':''}" data-page="next"><i class="fas fa-chevron-right"></i></button>`;
    paginationContainer.innerHTML = buttons;

    paginationContainer.querySelectorAll(".pagination-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        if (btn.classList.contains("disabled")) return;
        const page = btn.dataset.page;
        if (page === "prev") currentPage = Math.max(1, currentPage-1);
        else if (page === "next") currentPage = Math.min(totalPages, currentPage+1);
        else currentPage = parseInt(page,10);

        renderBlog();
        renderPagination();
        window.scrollTo({ top: blogGrid.offsetTop - 80, behavior: "smooth" });
      });
    });
  }

  // ==================== SEARCH FILTER ====================
  searchInput?.addEventListener("input", () => {
    const term = searchInput.value.toLowerCase().trim();
    filteredPosts = allPosts.filter(post =>
      post.title.toLowerCase().includes(term) || post.excerpt.toLowerCase().includes(term)
    );
    currentPage = 1;
    renderBlog();
    renderPagination();
  });

  // ==================== NAVBAR SCROLL HIDE/SHOW ====================
  function updateScrollUI() {
    const scrollTop = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const percent = max > 0 ? (scrollTop/max)*100 : 0;

    navbar.classList.toggle("scrolled", scrollTop>24);
    progress.style.width = percent+"%";

    const scrollingDown = scrollTop>lastScrollY;
    const pastHero = scrollTop>120;
    if (scrollingDown && pastHero && !document.body.classList.contains("menu-open")) navbar.classList.add("nav-hidden");
    else navbar.classList.remove("nav-hidden");

    lastScrollY = Math.max(scrollTop,0);
  }
  window.addEventListener("scroll", updateScrollUI, { passive:true });
  updateScrollUI();

  // ==================== MOBILE MENU ====================
  function openMenu() { document.body.classList.add("menu-open"); mobilePanel.classList.add("open"); scrim.classList.add("open"); scrim.hidden=false; menuToggle.setAttribute("aria-expanded","true"); menuToggle.classList.add("is-open"); }
  function closeMenu(){ document.body.classList.remove("menu-open"); mobilePanel.classList.remove("open"); scrim.classList.remove("open"); menuToggle.setAttribute("aria-expanded","false"); menuToggle.classList.remove("is-open"); setTimeout(()=>{if(!document.body.classList.contains("menu-open")) scrim.hidden=true;},250);}
  menuToggle.addEventListener("click", openMenu);
  mobileClose.addEventListener("click", closeMenu);
  scrim.addEventListener("click", closeMenu);
  mobilePanel.querySelectorAll("a").forEach(link=>link.addEventListener("click", closeMenu));

  // ==================== MODALS ====================
  function openModal(id){const m=document.getElementById(id);if(m){m.classList.add("open");m.setAttribute("aria-hidden","false");document.body.classList.add("modal-open");}}
  function closeModal(m){m.classList.remove("open");m.setAttribute("aria-hidden","true");if(!document.querySelector(".modal.open"))document.body.classList.remove("modal-open");}
  document.querySelectorAll("[data-open-modal]").forEach(t=>t.addEventListener("click",e=>{e.preventDefault();openModal(t.dataset.openModal);}));
  document.querySelectorAll("[data-close-modal]").forEach(b=>b.addEventListener("click",()=>closeModal(b.closest(".modal"))));
  document.querySelectorAll(".modal").forEach(m=>m.addEventListener("click",e=>{if(e.target===m)closeModal(m);}));
  document.addEventListener("keydown",e=>{if(e.key==="Escape"){document.querySelectorAll(".modal.open").forEach(closeModal);if(mobilePanel.classList.contains("open"))closeMenu();}});

  // ==================== FORM SUBMISSION ====================
  leadForm?.addEventListener("submit",e=>{
    e.preventDefault();
    const fd = new FormData(leadForm);
    const name = (fd.get("name")||"").trim();
    const phone = (fd.get("phone")||"").trim();
    const email = (fd.get("email")||"").trim();
    const buyerType = (fd.get("buyerType")||"").trim();
    const date = (fd.get("date")||"").trim();
    const msg = (fd.get("message")||"").trim();
    if(!name||!phone||!email){formNote.textContent="Please complete all fields."; return;}
    const plain = `New inquiry from blog\n\nName: ${name}\nPhone: ${phone}\nEmail: ${email}\nBuyer type: ${buyerType}\nPreferred date: ${date}\nMessage: ${msg}`;
    const encoded = encodeURIComponent(plain);
    formNote.textContent = "Opening WhatsApp and preparing email...";
    window.open(`https://wa.me/${whatsappNumber}?text=${encoded}`,"_blank");
    setTimeout(()=>window.location.href=`mailto:${businessEmail}?subject=Blog%20inquiry&body=${encoded}`,650);
  });

  // ==================== SMOOTH SCROLL ====================
  document.querySelectorAll('a[href^="#"]').forEach(anchor=>{
    anchor.addEventListener("click",e=>{
      const target=document.querySelector(anchor.getAttribute("href"));
      if(target){e.preventDefault();target.scrollIntoView({behavior:"smooth"});closeMenu();}
    });
  });

})();