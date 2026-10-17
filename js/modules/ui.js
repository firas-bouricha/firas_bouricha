/*
 * Portfolio · Firas Bouricha — interface
 * Menu, thème clair / sombre, langue FR / EN, apparition au défilement, copie de l'e-mail.
 */
(function (Site) {
  "use strict";
  const { T, onLang, isEN, copyEmail, scrollToSection } = Site;

  /* ---------- Navigation ---------- */
  function setupNav() {
    const nav = document.getElementById("nav");
    const toggle = document.getElementById("nav-toggle");
    const menu = document.getElementById("nav-links");
    const path = document.getElementById("prompt-path");
    if (!nav || !menu) return;
    const links = [...menu.querySelectorAll("a[data-page]")];
    const page = document.body.dataset.page || "accueil";

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

    // Lien actif + chemin du prompt (firas@Portfolio:~/projets$) : la page affichée,
    // ou une section de cette page (ex. Contact sur la page Parcours) quand elle est à l'écran
    const pageLinks = links.filter((a) => a.dataset.page === page);
    const mainLink = pageLinks.find((a) => !a.dataset.section) || pageLinks[0];
    const sectionLinks = pageLinks.filter((a) => a.dataset.section && document.getElementById(a.dataset.section));
    let current = mainLink;
    const setActive = (link) => {
      current = link;
      links.forEach((a) => {
        const on = a === link;
        a.classList.toggle("is-active", on);
        if (on) a.setAttribute("aria-current", a.dataset.section ? "location" : "page");
        else a.removeAttribute("aria-current");
      });
      activeLink = link || null;
      if (path) path.textContent = (link && ((isEN() && link.dataset.pathEn) || link.dataset.path)) || "~";
      moveIndicator();
    };
    const spy = () => {
      // Une section compte comme « affichée » quand son haut a passé 45 % de la hauteur de l'écran
      const reached = sectionLinks.filter((a) => document.getElementById(a.dataset.section).getBoundingClientRect().top < window.innerHeight * 0.45);
      const link = reached.length ? reached[reached.length - 1] : mainLink;
      if (link !== current) setActive(link);
    };
    if (sectionLinks.length) window.addEventListener("scroll", spy, { passive: true });

    // Lien vers la page affichée : défilement doux au lieu d'un rechargement
    pageLinks.forEach((a) => a.addEventListener("click", (e) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
      e.preventDefault();
      if (a.dataset.section) {
        scrollToSection(a.dataset.section);
        history.replaceState(null, "", `#${a.dataset.section}`);
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
        history.replaceState(null, "", window.location.pathname + window.location.search);
      }
    }));

    setActive(mainLink);
    spy();
    // Langue : libellés et largeur des liens changent → on recale le chemin et la pastille
    onLang(() => {
      setActive(current);
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
