/*
 * Portfolio · Firas Bouricha — interface
 * Menu, thème clair / sombre, langue FR / EN, apparition au défilement, copie de l'e-mail.
 */
(function (Site) {
  "use strict";
  const { T, onLang, isEN, copyEmail } = Site;

  /* ---------- Navigation ---------- */
  function setupNav() {
    const nav = document.getElementById("nav");
    const toggle = document.getElementById("nav-toggle");
    const menu = document.getElementById("nav-links");
    const path = document.getElementById("prompt-path");
    if (!nav || !menu) return;
    const links = [...menu.querySelectorAll('a[href^="#"]')];

    const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    // Menu mobile
    if (toggle) {
      const setOpen = (open) => {
        toggle.setAttribute("aria-expanded", String(open));
        toggle.setAttribute("aria-label", open ? T("Fermer le menu", "Close menu") : T("Ouvrir le menu", "Open menu"));
        menu.classList.toggle("is-open", open);
        nav.classList.toggle("menu-open", open);
      };
      toggle.addEventListener("click", () => setOpen(toggle.getAttribute("aria-expanded") !== "true"));
      links.forEach((a) => a.addEventListener("click", () => setOpen(false)));
      document.addEventListener("keydown", (e) => { if (e.key === "Escape") setOpen(false); });
      document.addEventListener("click", (e) => {
        if (!menu.contains(e.target) && !toggle.contains(e.target)) setOpen(false);
      });
    }

    // Pastille qui glisse sous le lien actif
    const indicator = menu.querySelector(".nav__indicator");
    let activeLink = null;
    const moveIndicator = () => {
      if (!indicator) return;
      if (!activeLink || !activeLink.offsetWidth || getComputedStyle(indicator).display === "none") {
        indicator.classList.remove("is-ready");
        return;
      }
      indicator.style.width = `${activeLink.offsetWidth}px`;
      indicator.style.transform = `translateX(${activeLink.offsetLeft}px)`;
      indicator.classList.add("is-ready");
    };
    window.addEventListener("resize", moveIndicator);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(moveIndicator);

    // Lien actif + chemin du prompt (firas@Portfolio:~/projets$) selon la section visible
    let activeId = "top";
    const setActive = (id) => {
      activeId = id;
      let current = "~";
      links.forEach((a) => {
        const on = a.getAttribute("href") === `#${id}`;
        a.classList.toggle("is-active", on);
        if (on) {
          activeLink = a;
          a.setAttribute("aria-current", "true");
          current = (isEN() && a.dataset.pathEn) || a.dataset.path || current;
        } else {
          a.removeAttribute("aria-current");
        }
      });
      if (path) path.textContent = current;
      moveIndicator();
    };

    const sections = [...new Set(links.map((a) => document.querySelector(a.getAttribute("href"))))].filter(Boolean);
    if ("IntersectionObserver" in window && sections.length) {
      const spy = new IntersectionObserver(
        (entries) => entries.forEach((entry) => { if (entry.isIntersecting) setActive(entry.target.id); }),
        { rootMargin: "-40% 0px -55% 0px" }
      );
      sections.forEach((section) => spy.observe(section));
    }
    setActive("top");
    // Langue : libellés et largeur des liens changent → on recale le chemin et la pastille
    onLang(() => {
      setActive(activeId);
      if (toggle) toggle.setAttribute("aria-label", toggle.getAttribute("aria-expanded") === "true" ? T("Fermer le menu", "Close menu") : T("Ouvrir le menu", "Open menu"));
    });
  }

  /* ---------- Thème clair / sombre ---------- */
  function setupTheme() {
    const button = document.getElementById("theme-toggle");
    const root = document.documentElement;
    const meta = document.querySelector('meta[name="theme-color"]');

    const apply = (theme) => {
      root.setAttribute("data-theme", theme);
      if (meta) meta.setAttribute("content", theme === "light" ? "#FAFAFC" : "#111117");
      if (button) button.setAttribute("aria-checked", String(theme === "light"));
      try { localStorage.setItem("theme", theme); } catch { /* stockage indisponible : le choix vaut pour cette visite */ }
    };
    const toggleTheme = () => apply(root.getAttribute("data-theme") === "light" ? "dark" : "light");

    apply(root.getAttribute("data-theme") === "light" ? "light" : "dark");
    if (button) button.addEventListener("click", toggleTheme);
    return toggleTheme;
  }

  /* ---------- Langue FR / EN ---------- */
  function setupLang() {
    const button = document.getElementById("lang-toggle");
    if (!button || !window.i18n) {
      if (button) button.hidden = true;
      return;
    }
    // Le libellé du bouton est dans l'autre langue : on l'indique aux lecteurs d'écran
    const sync = () => button.setAttribute("lang", isEN() ? "fr" : "en");
    button.addEventListener("click", () => window.i18n.toggle());
    onLang(sync);
    sync();
  }

  /* ---------- Apparition au défilement ---------- */
  function setupReveal() {
    const items = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("is-visible"));
      return true;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    items.forEach((el, i) => {
      // Léger décalage entre éléments voisins
      el.style.transitionDelay = `${(i % 4) * 70}ms`;
      observer.observe(el);
    });
    return true;
  }

  /* ---------- Copie de l'adresse e-mail ---------- */
  function setupCopyEmail() {
    const button = document.getElementById("copy-email");
    if (button) button.addEventListener("click", copyEmail);
  }

  Site.modules.nav = setupNav;
  Site.modules.theme = setupTheme;
  Site.modules.lang = setupLang;
  Site.modules.reveal = setupReveal;
  Site.modules.copyEmail = setupCopyEmail;
})(window.Site);
