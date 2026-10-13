/*
 * Portfolio · Firas Bouricha
 * Les projets sont définis dans data/projects.js : ce fichier n'a
 * normalement pas besoin d'être modifié pour en ajouter un.
 */
(function () {
  "use strict";

  document.documentElement.classList.add("js");

  /* ---------- Icônes disponibles pour les projets ---------- */
  const ICONS = {
    home: '<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>',
    server: '<rect x="3" y="4" width="18" height="6" rx="1.5"/><rect x="3" y="14" width="18" height="6" rx="1.5"/><path d="M7 7h.01M7 17h.01"/>',
    shield: '<path d="M12 3l7 3v6c0 4.6-2.9 7.5-7 9-4.1-1.5-7-4.4-7-9V6l7-3z"/><path d="M9.5 12.5l1.8 1.8 3.2-3.3"/>',
    layers: '<path d="M12 3l9 5-9 5-9-5 9-5z"/><path d="M3 13l9 5 9-5"/>',
    code: '<path d="M8 6l-6 6 6 6"/><path d="M16 6l6 6-6 6"/>',
    git: '<circle cx="6" cy="6" r="2.2"/><circle cx="6" cy="18" r="2.2"/><circle cx="18" cy="8" r="2.2"/><path d="M6 8.2v7.6"/><path d="M18 10.2c0 4-6 3-11 6"/>',
    cloud: '<path d="M7 18h10a4 4 0 0 0 .5-7.97A6 6 0 0 0 6 9.5 4.25 4.25 0 0 0 7 18z"/>',
    database: '<ellipse cx="12" cy="5.5" rx="7.5" ry="2.8"/><path d="M4.5 5.5v13c0 1.5 3.4 2.8 7.5 2.8s7.5-1.3 7.5-2.8v-13"/><path d="M4.5 12c0 1.5 3.4 2.8 7.5 2.8s7.5-1.3 7.5-2.8"/>',
    game: '<rect x="2.5" y="7" width="19" height="11" rx="4"/><path d="M7.5 10.5v4M5.5 12.5h4"/><path d="M15.5 12h.01M18 13.5h.01"/>',
    terminal: '<rect x="3" y="4" width="18" height="16" rx="2.5"/><path d="M7 9l3 3-3 3"/><path d="M13 15h4"/>',
    network: '<rect x="9" y="2.5" width="6" height="5" rx="1"/><rect x="2.5" y="16.5" width="6" height="5" rx="1"/><rect x="15.5" y="16.5" width="6" height="5" rx="1"/><path d="M12 7.5v4.5M5.5 16.5V12h13v4.5"/>',
  };

  const COLORS = {
    violet: "var(--violet)",
    cyan: "var(--cyan)",
    emerald: "var(--emerald)",
    amber: "var(--amber)",
    pink: "var(--pink)",
    blue: "var(--blue)",
    red: "var(--red)",
  };

  const GITHUB_ICON =
    '<svg viewBox="0 0 16 16" class="fill" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>';
  const EXTERNAL_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17L17 7M9 7h8v8"/></svg>';

  /* ---------- Utilitaires ---------- */
  const escapeHTML = (value) =>
    String(value ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const safeURL = (url) => (/^https?:\/\//i.test(url || "") ? url : null);

  const svg = (name) => `<svg viewBox="0 0 24 24" aria-hidden="true">${ICONS[name] || ICONS.code}</svg>`;

  /* ---------- Rendu des projets ---------- */
  function projectCard(project) {
    const color = COLORS[project.color] || COLORS.violet;
    const repoURL = project.repo ? `https://github.com/${project.repo}` : null;
    const demoURL = safeURL(project.demo);
    const image = typeof project.image === "string" && !/^\s*javascript:/i.test(project.image) ? project.image : null;
    const tags = Array.isArray(project.tags) ? project.tags : [];

    const links = [];
    if (repoURL) {
      links.push(`<a href="${escapeHTML(repoURL)}" target="_blank" rel="noopener noreferrer">${GITHUB_ICON}Voir le code</a>`);
    }
    if (demoURL) {
      links.push(`<a href="${escapeHTML(demoURL)}" target="_blank" rel="noopener noreferrer">${EXTERNAL_ICON}Démo en ligne</a>`);
    }

    return `
      <article class="project${project.featured ? " project--featured" : ""}${image ? " project--media" : ""}" style="--c: ${color}">
        ${image ? `<figure class="project__media"><img src="${escapeHTML(image)}" alt="${escapeHTML(project.imageAlt || project.title)}" loading="lazy" decoding="async"></figure>` : ""}
        <div class="project__body">
          <div class="project__head">
            <span class="project__icon">${svg(project.icon)}</span>
            <div class="project__titles">
              ${project.category ? `<p class="project__category">${escapeHTML(project.category)}</p>` : ""}
              <h3 class="project__title">${escapeHTML(project.title)}</h3>
              ${project.repo ? `<span class="project__repo">${escapeHTML(project.repo)}</span>` : ""}
            </div>
          </div>
          <p class="project__desc">${escapeHTML(project.description)}</p>
          ${tags.length ? `<ul class="project__tags">${tags.map((t) => `<li>${escapeHTML(t)}</li>`).join("")}</ul>` : ""}
        </div>
        ${links.length ? `<div class="project__links">${links.join("")}</div>` : ""}
      </article>`;
  }

  function setupProjects() {
    const list = document.getElementById("project-list");
    const filtersEl = document.getElementById("project-filters");
    const projects = Array.isArray(window.PROJECTS) ? window.PROJECTS.filter((p) => p && p.title) : [];
    if (!list) return;

    const render = (category) => {
      const visible = category ? projects.filter((p) => p.category === category) : projects;
      list.innerHTML = visible.map(projectCard).join("");
      list.querySelectorAll(".project").forEach((card, i) => {
        card.style.animationDelay = `${i * 60}ms`;
      });
    };

    // Filtres générés automatiquement à partir des catégories
    const categories = [...new Set(projects.map((p) => p.category).filter(Boolean))];
    if (filtersEl && categories.length > 1) {
      const count = (c) => projects.filter((p) => p.category === c).length;
      const button = (label, value, n, pressed) =>
        `<button type="button" class="filter" data-filter="${escapeHTML(value)}" aria-pressed="${pressed}">${escapeHTML(label)}<span class="count">${n}</span></button>`;

      filtersEl.innerHTML =
        button("tous", "", projects.length, true) +
        categories.map((c) => button(c.toLowerCase(), c, count(c), false)).join("");

      filtersEl.addEventListener("click", (event) => {
        const target = event.target.closest(".filter");
        if (!target) return;
        filtersEl.querySelectorAll(".filter").forEach((b) => b.setAttribute("aria-pressed", String(b === target)));
        render(target.dataset.filter);
      });
    } else if (filtersEl) {
      filtersEl.remove();
    }

    render("");
  }

  /* ---------- Navigation ---------- */
  function setupNav() {
    const nav = document.getElementById("nav");
    const toggle = document.getElementById("nav-toggle");
    const links = document.getElementById("nav-links");
    if (!nav) return;

    const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    if (toggle && links) {
      const setOpen = (open) => {
        toggle.setAttribute("aria-expanded", String(open));
        toggle.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
        links.classList.toggle("is-open", open);
        nav.classList.toggle("menu-open", open);
      };
      toggle.addEventListener("click", () => setOpen(toggle.getAttribute("aria-expanded") !== "true"));
      links.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setOpen(false)));
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") setOpen(false);
      });
    }

    // Lien actif selon la section visible
    const navLinks = links ? [...links.querySelectorAll('a[href^="#"]:not(.btn)')] : [];
    const sections = navLinks.map((a) => document.querySelector(a.getAttribute("href"))).filter(Boolean);
    const hero = document.getElementById("top");
    if (hero) sections.unshift(hero); // en haut de page : aucun lien actif
    if ("IntersectionObserver" in window && sections.length) {
      const spy = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            navLinks.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === `#${entry.target.id}`));
          });
        },
        { rootMargin: "-45% 0px -50% 0px" }
      );
      sections.forEach((s) => spy.observe(s));
    }
  }

  /* ---------- Apparition au défilement ---------- */
  function setupReveal() {
    const items = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("is-visible"));
      return;
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
  }

  /* ---------- Effet machine à écrire ---------- */
  function setupTyping() {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.querySelectorAll(".type[data-text]").forEach((el) => {
      const text = el.dataset.text;
      if (reduce) {
        el.textContent = text;
        return;
      }
      let i = 0;
      const tick = () => {
        el.textContent = text.slice(0, ++i);
        if (i < text.length) setTimeout(tick, 90 + Math.random() * 60);
      };
      setTimeout(tick, 500);
    });
  }

  /* ---------- Copie de l'adresse e-mail ---------- */
  function setupCopyEmail() {
    const button = document.getElementById("copy-email");
    const toast = document.getElementById("toast");
    if (!button) return;

    let timer;
    const notify = (message) => {
      if (!toast) return;
      toast.textContent = message;
      toast.classList.add("is-visible");
      clearTimeout(timer);
      timer = setTimeout(() => toast.classList.remove("is-visible"), 2400);
    };

    button.addEventListener("click", async () => {
      const email = button.dataset.email;
      try {
        await navigator.clipboard.writeText(email);
        notify(`✓ ${email} copié`);
      } catch {
        window.location.href = `mailto:${email}`;
      }
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    const year = document.getElementById("year");
    if (year) year.textContent = new Date().getFullYear();

    setupProjects();
    setupNav();
    setupReveal();
    setupTyping();
    setupCopyEmail();
  });
})();
