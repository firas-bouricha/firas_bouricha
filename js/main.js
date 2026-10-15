/*
 * Portfolio · Firas Bouricha
 * Les projets sont définis dans data/projects.js : ce fichier n'a
 * normalement pas besoin d'être modifié pour en ajouter un.
 */
(function () {
  "use strict";

  document.documentElement.classList.add("js");

  const EMAIL = "firas.bouricha@outlook.fr";
  // Traduction : T("texte français", "English text") selon la langue active (voir js/i18n.js)
  const T = (fr, en) => (window.i18n ? window.i18n.t(fr, en) : fr);
  const onLang = (fn) => document.addEventListener("langchange", fn);
  const isEN = () => Boolean(window.i18n && window.i18n.lang === "en");
  // Version anglaise d'un champ de projet si elle existe
  const pick = (project, field) => (isEN() && project.en && project.en[field] != null ? project.en[field] : project[field]);
  const CATEGORY_EN = { "Pédagogie": "Teaching" };
  const MAX_TAGS = 4; // au-delà, les technologies sont regroupées dans un bouton « +N »

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
  function tagList(tags) {
    const visible = tags.slice(0, MAX_TAGS).map((t) => `<li>${escapeHTML(t)}</li>`).join("");
    const hidden = tags.slice(MAX_TAGS);
    if (!hidden.length) return visible;
    return `${visible}<li class="project__more"><button type="button" data-tags="${escapeHTML(JSON.stringify(hidden))}" aria-label="${escapeHTML(T(`Afficher ${hidden.length} technologie${hidden.length > 1 ? "s" : ""} de plus : `, `Show ${hidden.length} more technolog${hidden.length > 1 ? "ies" : "y"}: `) + hidden.join(", "))}">+${hidden.length}</button></li>`;
  }

  function projectCard(project) {
    const color = COLORS[project.color] || COLORS.violet;
    const repoURL = project.repo ? `https://github.com/${project.repo}` : null;
    const demoURL = safeURL(project.demo);
    const image = typeof project.image === "string" && !/^\s*javascript:/i.test(project.image) ? project.image : null;
    const tags = Array.isArray(pick(project, "tags")) ? pick(project, "tags") : [];

    const links = [];
    if (repoURL) {
      links.push(`<a href="${escapeHTML(repoURL)}" target="_blank" rel="noopener noreferrer">${GITHUB_ICON}${T("Voir le code", "View code")}</a>`);
    }
    if (demoURL) {
      links.push(`<a href="${escapeHTML(demoURL)}" target="_blank" rel="noopener noreferrer">${EXTERNAL_ICON}${T("Démo en ligne", "Live demo")}</a>`);
    }

    return `
      <article class="project${project.featured ? " project--featured" : ""}${image ? " project--media" : ""}" style="--c: ${color}">
        ${image ? `<figure class="project__media"><img src="${escapeHTML(image)}" alt="${escapeHTML(pick(project, "imageAlt") || pick(project, "title"))}" loading="lazy" decoding="async"></figure>` : ""}
        <div class="project__body">
          <div class="project__head">
            <span class="project__icon">${svg(project.icon)}</span>
            <div class="project__titles">
              ${project.category ? `<p class="project__category">${escapeHTML(isEN() ? CATEGORY_EN[project.category] || project.category : project.category)}</p>` : ""}
              <div class="project__titleRow">
                <h3 class="project__title">${escapeHTML(pick(project, "title"))}</h3>
                ${project.year ? `<span class="project__year mono">${escapeHTML(pick(project, "year"))}</span>` : ""}
              </div>
              ${project.repo ? `<span class="project__repo">${escapeHTML(project.repo)}</span>` : ""}
            </div>
          </div>
          <p class="project__desc">${escapeHTML(pick(project, "description"))}</p>
          ${tags.length ? `<ul class="project__tags">${tagList(tags)}</ul>` : ""}
        </div>
        ${links.length ? `<div class="project__links">${links.join("")}</div>` : ""}
      </article>`;
  }

  function setupProjects() {
    const list = document.getElementById("project-list");
    const filtersEl = document.getElementById("project-filters");
    const projects = Array.isArray(window.PROJECTS) ? window.PROJECTS.filter((p) => p && p.title) : [];
    if (!list) return;

    let current = "";
    const render = (category) => {
      current = category;
      const visible = category ? projects.filter((p) => p.category === category) : projects;
      list.innerHTML = visible.map(projectCard).join("");
      list.querySelectorAll(".project").forEach((card, i) => {
        card.style.animationDelay = `${i * 60}ms`;
      });
    };

    // Filtres générés automatiquement à partir des catégories
    const categories = [...new Set(projects.map((p) => p.category).filter(Boolean))];
    const drawFilters = () => {
      const count = (c) => projects.filter((p) => p.category === c).length;
      const button = (label, value, n) =>
        `<button type="button" class="filter" data-filter="${escapeHTML(value)}" aria-pressed="${value === current}">${escapeHTML(label)}<span class="count">${n}</span></button>`;
      const label = (c) => (isEN() ? CATEGORY_EN[c] || c : c).toLowerCase();
      filtersEl.innerHTML =
        button(T("tous", "all"), "", projects.length) +
        categories.map((c) => button(label(c), c, count(c))).join("");
    };
    if (filtersEl && categories.length > 1) {
      drawFilters();

      filtersEl.addEventListener("click", (event) => {
        const target = event.target.closest(".filter");
        if (!target) return;
        filtersEl.querySelectorAll(".filter").forEach((b) => b.setAttribute("aria-pressed", String(b === target)));
        render(target.dataset.filter);
      });
    } else if (filtersEl) {
      filtersEl.remove();
    }

    // Bouton « +N » : affiche les technologies restantes
    list.addEventListener("click", (event) => {
      const more = event.target.closest(".project__more button");
      if (!more) return;
      let hidden = [];
      try { hidden = JSON.parse(more.dataset.tags); } catch { hidden = []; }
      const item = more.parentElement;
      item.insertAdjacentHTML("beforebegin", hidden.map((t) => `<li class="is-new">${escapeHTML(t)}</li>`).join(""));
      item.remove();
    });

    render("");
    // Changement de langue : on redessine les cartes et les filtres en gardant le filtre actif
    onLang(() => {
      if (filtersEl && filtersEl.isConnected) drawFilters();
      render(current);
    });
  }

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

    // Lien actif + chemin du prompt (firas@infra:~/projets$) selon la section visible
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
      if (meta) meta.setAttribute("content", theme === "light" ? "#FAFAFC" : "#0A0A0D");
      if (button) button.setAttribute("aria-checked", String(theme === "light"));
      try { localStorage.setItem("theme", theme); } catch { /* stockage indisponible : le choix vaut pour cette visite */ }
    };
    const toggleTheme = () => apply(root.getAttribute("data-theme") === "light" ? "dark" : "light");

    apply(root.getAttribute("data-theme") === "light" ? "light" : "dark");
    if (button) button.addEventListener("click", toggleTheme);
    return toggleTheme;
  }

  /* ---------- Défilement doux (Lenis) ----------
     Inertie douce à la molette, façon Apple. Le défilement tactile reste natif,
     et rien n'est activé si le visiteur a demandé à réduire les animations. */
  let lenis = null;
  const navOffset = () => -((document.getElementById("nav")?.offsetHeight || 72) + 8);

  function setupSmoothScroll() {
    if (!window.Lenis || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    lenis = new window.Lenis({
      lerp: 0.09,              // inertie : plus la valeur est basse, plus le défilement est « glissant »
      smoothWheel: true,
      wheelMultiplier: 1,
      autoRaf: true,
      anchors: { offset: navOffset() }, // liens #section : arrivée juste sous le menu
      allowNestedScroll: true, // les zones qui défilent seules (calendrier, code) gardent leur défilement
    });
    // Pause pendant la palette de commandes
    const dialog = document.getElementById("cmdk");
    if (dialog) {
      new MutationObserver(() => (dialog.open ? lenis.stop() : lenis.start())).observe(dialog, { attributes: true, attributeFilter: ["open"] });
    }
  }

  // Défilement vers une section (utilisé par la palette de commandes)
  function scrollToSection(id) {
    const target = document.getElementById(id);
    if (!target) return;
    if (lenis) { lenis.start(); lenis.scrollTo(target, { offset: navOffset(), force: true }); }
    else target.scrollIntoView({ behavior: "smooth" });
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

  /* ---------- Notifications ---------- */
  let toastTimer;
  function notify(message) {
    const toast = document.getElementById("toast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2400);
  }

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(EMAIL);
      notify(T(`✓ ${EMAIL} copié`, `✓ ${EMAIL} copied`));
    } catch {
      window.location.href = `mailto:${EMAIL}`;
    }
  }

  /* ---------- Palette de commandes (Ctrl/⌘ + K) ---------- */
  function setupCommandPalette(toggleTheme) {
    const dialog = document.getElementById("cmdk");
    const input = document.getElementById("cmdk-input");
    const list = document.getElementById("cmdk-list");
    if (!dialog || !input || !list || typeof dialog.showModal !== "function") {
      document.querySelectorAll("#cmdk-open, [data-open-cmdk]").forEach((b) => (b.hidden = true));
      return;
    }

    const goTo = (id) => () => scrollToSection(id);
    const open = (url) => () => window.open(url, "_blank", "noopener");
    const ICON_LINK = '<path d="M7 17L17 7M9 7h8v8"/>';
    const ICON_HASH = '<path d="M5 9h14M5 15h14M10 4l-2 16M16 4l-2 16"/>';

    // Liste reconstruite à chaque ouverture : elle suit la langue active
    const buildCommands = () => [
      { group: "Sections", label: T("Accueil", "Home"), icon: ICON_HASH, run: goTo("top") },
      { group: "Sections", label: T("Profil", "Profile"), icon: ICON_HASH, run: goTo("about") },
      { group: "Sections", label: T("Compétences", "Skills"), icon: ICON_HASH, run: goTo("skills") },
      { group: "Sections", label: T("Projets", "Projects"), icon: ICON_HASH, run: goTo("projects") },
      { group: "Sections", label: T("Parcours", "Journey"), icon: ICON_HASH, run: goTo("journey") },
      { group: "Sections", label: "Contact", icon: ICON_HASH, run: goTo("contact") },
      ...(window.PROJECTS || []).filter((p) => p && p.title).map((p) => ({
        group: T("Projets", "Projects"),
        label: pick(p, "title"),
        hint: (pick(p, "tags") || []).slice(0, 3).join(" · "),
        icon: ICONS[p.icon] || ICONS.code,
        run: p.repo ? open(`https://github.com/${p.repo}`) : goTo("projects"),
      })),
      { group: "Actions", label: T("Copier mon adresse e-mail", "Copy my email address"), hint: EMAIL, icon: '<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/>', run: copyEmail },
      { group: "Actions", label: T("M'écrire un e-mail", "Send me an email"), icon: '<rect x="2.5" y="5" width="19" height="14" rx="2.5"/><path d="M3.5 6.5l8.5 6.5 8.5-6.5"/>', run: () => { window.location.href = `mailto:${EMAIL}`; } },
      { group: "Actions", label: T("Changer de thème", "Switch theme"), hint: T("clair / sombre", "light / dark"), icon: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2"/>', run: toggleTheme },
      { group: "Actions", label: T("Read in English", "Lire en français"), hint: T("EN", "FR"), icon: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z"/>', run: () => window.i18n && window.i18n.toggle() },
      { group: T("Liens", "Links"), label: "LinkedIn", hint: "in/firas-bouricha", icon: ICON_LINK, run: open("https://www.linkedin.com/in/firas-bouricha/") },
      { group: T("Liens", "Links"), label: "GitHub", hint: "firas-bouricha", icon: ICON_LINK, run: open("https://github.com/firas-bouricha") },
    ];
    let commands = buildCommands();

    const normalize = (text) => text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    let results = commands;
    let index = 0;

    const render = () => {
      if (!results.length) {
        list.innerHTML = `<li class="cmdk__empty">${T("Aucun résultat.", "No results.")}</li>`;
        return;
      }
      let html = "";
      let group = "";
      results.forEach((cmd, i) => {
        if (cmd.group !== group) {
          group = cmd.group;
          html += `<li class="cmdk__group mono" role="presentation">${escapeHTML(group)}</li>`;
        }
        html += `<li class="cmdk__item" role="option" id="cmdk-opt-${i}" data-index="${i}" aria-selected="${i === index}">
          <svg viewBox="0 0 24 24" aria-hidden="true">${cmd.icon}</svg>
          <span>${escapeHTML(cmd.label)}</span>
          ${cmd.hint ? `<span class="cmdk__hint mono">${escapeHTML(cmd.hint)}</span>` : ""}
        </li>`;
      });
      list.innerHTML = html;
      input.setAttribute("aria-activedescendant", `cmdk-opt-${index}`);
      list.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: "nearest" });
    };

    const filter = () => {
      const q = normalize(input.value.trim());
      results = q ? commands.filter((c) => normalize(`${c.label} ${c.hint || ""} ${c.group}`).includes(q)) : commands;
      index = 0;
      render();
    };

    const openPalette = () => {
      commands = buildCommands();
      if (dialog.open) return;
      input.value = "";
      filter();
      dialog.showModal();
      input.focus();
    };
    const run = (i) => {
      const cmd = results[i];
      if (!cmd) return;
      dialog.close();
      cmd.run();
    };

    document.querySelectorAll("#cmdk-open, [data-open-cmdk]").forEach((b) => b.addEventListener("click", openPalette));
    const kbd = document.getElementById("cmdk-kbd");
    if (kbd && /Mac|iPhone|iPad/i.test(navigator.platform || navigator.userAgent)) kbd.textContent = "⌘ K";
    document.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        dialog.open ? dialog.close() : openPalette();
      }
    });
    input.addEventListener("input", filter);
    input.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        if (!results.length) return;
        index = (index + (e.key === "ArrowDown" ? 1 : -1) + results.length) % results.length;
        render();
      } else if (e.key === "Enter") {
        e.preventDefault();
        run(index);
      }
    });
    list.addEventListener("click", (e) => {
      const item = e.target.closest(".cmdk__item");
      if (item) run(Number(item.dataset.index));
    });
    list.addEventListener("mousemove", (e) => {
      const item = e.target.closest(".cmdk__item");
      if (!item || Number(item.dataset.index) === index) return;
      index = Number(item.dataset.index);
      list.querySelectorAll(".cmdk__item").forEach((el) => el.setAttribute("aria-selected", String(el === item)));
      input.setAttribute("aria-activedescendant", item.id);
    });
    // Clic sur le fond : fermeture
    dialog.addEventListener("click", (e) => { if (e.target === dialog) dialog.close(); });
  }

  /* ---------- Éditeur à onglets (section Profil) ---------- */
  function highlight(code, lang) {
    return code.split("\n").map((line) => {
      const hash = line.indexOf("#");
      const body = hash >= 0 ? line.slice(0, hash) : line;
      const comment = hash >= 0 ? line.slice(hash) : "";
      let html = escapeHTML(body)
        .replace(/(&quot;.*?&quot;)/g, '<span class="tk-s">$1</span>')
        .replace(/\b(var|true|false)\b/g, '<span class="tk-k">$1</span>');
      if (lang === "hcl") {
        html = html.replace(/^(\s*)(resource|output)\b/, '$1<span class="tk-k">$2</span>')
          .replace(/^(\s*)([a-z_]+)(\s*(=|\{))/, '$1<span class="tk-a">$2</span>$3');
      } else {
        html = html.replace(/^(\s*)([\w-]+)(:)/, '$1<span class="tk-a">$2</span>$3')
          .replace(/\[([^\]]*)\]/g, '[<span class="tk-s">$1</span>]');
      }
      return html + (comment ? `<span class="tk-c">${escapeHTML(comment)}</span>` : "");
    }).join("\n");
  }

  function setupEditor() {
    const editor = document.getElementById("editor");
    if (!editor) return;
    editor.querySelectorAll("pre.code code").forEach((code) => {
      code.innerHTML = highlight(code.textContent, code.parentElement.dataset.lang);
    });
    const tabs = [...editor.querySelectorAll('[role="tab"]')];
    const select = (tab, focus) => {
      tabs.forEach((t) => {
        const on = t === tab;
        t.setAttribute("aria-selected", String(on));
        t.tabIndex = on ? 0 : -1;
        document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
      });
      if (focus) tab.focus();
    };
    tabs.forEach((tab, i) => {
      tab.addEventListener("click", () => select(tab));
      tab.addEventListener("keydown", (e) => {
        if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
        const next = tabs[(i + (e.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length];
        select(next, true);
      });
    });
  }

  /* ---------- Parcours : frise horizontale animée ----------
     Grand écran : la section reste fixée et le défilement vertical fait glisser la frise.
     Mobile / mouvement réduit : défilement horizontal natif (au doigt ou au trackpad). */
  function setupJourney() {
    const root = document.getElementById("journey-timeline");
    if (!root) return;
    const viewport = root.querySelector(".journey__viewport");
    const track = root.querySelector(".journey__track");
    const rail = root.querySelector(".journey__rail");
    const fill = root.querySelector(".journey__fill");
    const sticky = root.querySelector(".journey__sticky");
    const items = [...root.querySelectorAll(".journey__item")];
    const pinQuery = window.matchMedia("(min-width: 901px) and (prefers-reduced-motion: no-preference)");
    let distance = 0; // distance horizontale à parcourir en mode épinglé
    let ticking = false;

    const measure = () => {
      const pinned = pinQuery.matches;
      root.classList.toggle("is-pinned", pinned);
      if (!pinned) {
        root.style.height = "";
        track.style.removeProperty("--x");
        return;
      }
      distance = Math.max(0, track.scrollWidth - window.innerWidth);
      root.style.height = `${sticky.offsetHeight + distance}px`;
    };

    const update = () => {
      ticking = false;
      let p = 0;
      if (root.classList.contains("is-pinned")) {
        const top = root.getBoundingClientRect().top;
        const scrollable = root.offsetHeight - sticky.offsetHeight;
        const navH = parseFloat(getComputedStyle(sticky).top) || 0;
        p = scrollable > 0 ? Math.min(1, Math.max(0, (navH - top) / scrollable)) : 0;
        track.style.setProperty("--x", `${(-p * distance).toFixed(1)}px`);
      }
      // La ligne se remplit jusqu'au repère, les étapes à gauche du repère s'allument
      // (en mode épinglé, le repère glisse vers la droite pour allumer les dernières étapes en fin de course)
      const anchor = window.innerWidth * (root.classList.contains("is-pinned") ? 0.62 + 0.3 * p : 0.72);
      const r = rail.getBoundingClientRect();
      const visible = root.getBoundingClientRect();
      const inView = visible.top < window.innerHeight * 0.75 && visible.bottom > 0;
      const progress = inView ? Math.min(1, Math.max(0, (anchor - r.left) / r.width)) : 0;
      fill.style.setProperty("--progress", progress.toFixed(4));
      items.forEach((item) => {
        const dot = item.querySelector(".journey__dot").getBoundingClientRect();
        item.classList.toggle("is-lit", inView && dot.left < anchor);
      });
      root.classList.toggle("is-started", progress > 0.08);
    };
    const schedule = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    measure();
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    viewport.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", () => { measure(); schedule(); });
    if (pinQuery.addEventListener) pinQuery.addEventListener("change", () => { measure(); schedule(); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { measure(); schedule(); });
  }

  /* ---------- Activité GitHub ----------
     Données publiques fournies par github-contributions-api.jogruber.de (aucun jeton requis).
     Mise en cache 6 h dans le navigateur ; en cas d'échec, un lien vers le profil s'affiche. */
  function setupActivity() {
    const root = document.getElementById("activity");
    if (!root) return;
    const user = root.dataset.user;
    const graph = document.getElementById("activity-graph");
    const scroller = document.getElementById("activity-scroll");
    const total = document.getElementById("activity-total");
    const note = document.getElementById("activity-note");
    const tip = document.getElementById("activity-tip");
    const API = `https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(user)}?y=last`;
    const CACHE_KEY = `gh-activity:${user}`;
    const CACHE_MS = 6 * 60 * 60 * 1000;
    const MONTHS_FR = ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];
    const MONTHS_EN = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const locale = () => (isEN() ? "en-GB" : "fr-FR");
    const dateFmt = () => new Intl.DateTimeFormat(locale(), { day: "numeric", month: "long", year: "numeric" });
    const numFmt = () => new Intl.NumberFormat(locale());
    let loaded = null; // jours reçus (pour redessiner au changement de langue)
    let failed = false;

    // Grille de chargement (53 semaines vides)
    const skeleton = () => {
      let cells = "";
      for (let w = 0; w < 53; w++) for (let d = 0; d < 7; d++) cells += `<i data-l="0" style="--w:${w};--d:${d}"></i>`;
      graph.innerHTML = `<div class="activity__months"></div><div class="activity__days"></div><div class="activity__cells">${cells}</div>`;
    };

    const render = (days) => {
      loaded = days;
      const MONTHS = isEN() ? MONTHS_EN : MONTHS_FR;
      // Semaines commençant le lundi
      const first = new Date(`${days[0].date}T00:00:00`);
      const offset = (first.getDay() + 6) % 7;
      let cells = "";
      for (let i = 0; i < offset; i++) cells += `<i class="is-empty" style="--w:0;--d:${i}"></i>`;
      const months = [];
      let lastMonth = -1;
      days.forEach((day, i) => {
        const idx = i + offset;
        const w = Math.floor(idx / 7);
        const d = idx % 7;
        const date = new Date(`${day.date}T00:00:00`);
        if (date.getDate() <= 7 && date.getMonth() !== lastMonth && d === 0) {
          months.push({ w, label: MONTHS[date.getMonth()] });
          lastMonth = date.getMonth();
        }
        cells += `<i data-l="${day.level}" data-count="${day.count}" data-date="${day.date}" style="--w:${w};--d:${d}"></i>`;
      });
      const weeks = Math.ceil((days.length + offset) / 7);
      const monthRow = months
        .filter((m) => m.w < weeks - 1)
        .map((m) => `<span style="grid-column:${m.w + 1}">${m.label}</span>`).join("");
      graph.innerHTML = `
        <div class="activity__months" style="grid-template-columns:repeat(${weeks}, var(--cell))">${monthRow}</div>
        <div class="activity__days"><span></span><span>${T("lun.", "Mon")}</span><span></span><span>${T("mer.", "Wed")}</span><span></span><span>${T("ven.", "Fri")}</span><span></span></div>
        <div class="activity__cells">${cells}</div>`;
      graph.classList.remove("is-loading");
      graph.classList.add("is-ready");
      const sum = days.reduce((n, d) => n + d.count, 0);
      total.innerHTML = `<strong>${numFmt().format(sum)}</strong> ${T("contributions sur les 12 derniers mois", "contributions in the last 12 months")}`;
      graph.setAttribute("aria-label", T(`${sum} contributions GitHub sur les 12 derniers mois`, `${sum} GitHub contributions in the last 12 months`));
      scroller.scrollLeft = scroller.scrollWidth; // mobile : afficher d'abord les semaines récentes
    };

    const fail = () => {
      failed = true;
      note.removeAttribute("data-i18n"); // le message de repli remplace la phrase traduite
      graph.classList.remove("is-loading");
      total.textContent = T("Activité momentanément indisponible", "Activity temporarily unavailable");
      note.innerHTML = `${T("Retrouvez mes contributions directement sur", "See my contributions directly on")} <a href="https://github.com/${encodeURIComponent(user)}" target="_blank" rel="noopener noreferrer">GitHub</a>.`;
    };

    // Ne garde que des données au format attendu (dates et nombres)
    const sanitize = (json) => {
      const list = Array.isArray(json && json.contributions) ? json.contributions : [];
      return list
        .filter((d) => d && /^\d{4}-\d{2}-\d{2}$/.test(d.date) && Number.isFinite(d.count))
        .map((d) => ({ date: d.date, count: Math.max(0, Math.round(d.count)), level: Math.min(4, Math.max(0, Math.round(d.level) || 0)) }))
        .sort((a, b) => (a.date < b.date ? -1 : 1));
    };

    const load = async () => {
      try {
        const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || "null");
        if (cached && Date.now() - cached.at < CACHE_MS && cached.days.length) return render(cached.days);
      } catch { /* cache indisponible */ }
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 9000);
      try {
        const response = await fetch(API, { signal: controller.signal });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const days = sanitize(await response.json());
        if (!days.length) throw new Error("aucune donnée");
        render(days);
        try { localStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), days })); } catch { /* ignore */ }
      } catch (error) {
        console.warn("[portfolio] activité GitHub :", error.message);
        fail();
      } finally {
        clearTimeout(timer);
      }
    };

    // Infobulle
    const showTip = (cell) => {
      if (!cell.dataset.date) return;
      const n = Number(cell.dataset.count);
      const when = dateFmt().format(new Date(`${cell.dataset.date}T00:00:00`));
      tip.textContent = n ? `${n} contribution${n > 1 ? "s" : ""} · ${when}` : `${T("Aucune contribution", "No contributions")} · ${when}`;
      const box = root.getBoundingClientRect();
      const c = cell.getBoundingClientRect();
      tip.style.left = `${c.left - box.left + c.width / 2}px`;
      tip.style.top = `${c.top - box.top - 8}px`;
      tip.hidden = false;
    };
    graph.addEventListener("pointerover", (e) => { if (e.target.matches(".activity__cells i")) showTip(e.target); });
    graph.addEventListener("pointerleave", () => { tip.hidden = true; });
    scroller.addEventListener("scroll", () => { tip.hidden = true; }, { passive: true });

    skeleton();
    total.textContent = T("12 derniers mois", "Last 12 months");
    onLang(() => {
      if (loaded) render(loaded);
      else if (failed) fail();
      else total.textContent = T("12 derniers mois", "Last 12 months");
    });
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver((entries) => {
        if (entries.some((e) => e.isIntersecting)) { io.disconnect(); load(); }
      }, { rootMargin: "400px 0px" });
      io.observe(root);
    } else {
      load();
    }
  }

  /* ---------- Visionneuse de photos (hero) ---------- */
  function setupDeck() {
    const deck = document.getElementById("deck");
    if (!deck) return;
    const stage = deck.querySelector(".deck__stage");
    const cards = [...deck.querySelectorAll(".deck__card")];
    const count = deck.querySelector(".deck__count");
    const text = deck.querySelector(".deck__text");
    if (cards.length < 2) return;

    let order = cards.map((_, i) => i); // order[0] = carte affichée devant
    let busy = false;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const layout = () => {
      order.forEach((cardIndex, pos) => {
        const card = cards[cardIndex];
        card.dataset.pos = String(Math.min(pos, 3));
        card.setAttribute("aria-hidden", String(pos !== 0));
      });
      const front = cards[order[0]];
      if (count) count.textContent = `${order[0] + 1}/${cards.length}`;
      if (text) text.textContent = (isEN() && front.dataset.captionEn) || front.dataset.caption || "";
    };
    onLang(() => layout());

    const next = () => {
      if (busy) return;
      busy = true;
      const front = cards[order[0]];
      front.dataset.pos = "out"; // la photo de devant glisse vers la gauche…
      setTimeout(() => {
        order = [...order.slice(1), order[0]]; // …puis repasse au fond de la pile
        layout();
        busy = false;
      }, reduce ? 0 : 320);
    };
    const prev = () => {
      if (busy) return;
      order = [order[order.length - 1], ...order.slice(0, -1)];
      layout();
    };

    deck.querySelector('[data-deck="next"]')?.addEventListener("click", next);
    deck.querySelector('[data-deck="prev"]')?.addEventListener("click", prev);
    deck.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") { e.preventDefault(); next(); }
      if (e.key === "ArrowLeft") { e.preventDefault(); prev(); }
    });

    // Clic sur la photo = suivante ; glissement horizontal sur mobile
    let startX = null;
    stage.addEventListener("pointerdown", (e) => { startX = e.clientX; });
    stage.addEventListener("pointerup", (e) => {
      if (startX === null) return;
      const dx = e.clientX - startX;
      startX = null;
      if (dx > 40) prev();
      else next();
    });

    layout();
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

  // Chaque module démarre indépendamment : une erreur dans l'un n'empêche pas les autres de fonctionner
  function safely(name, fn) {
    try {
      return fn();
    } catch (error) {
      console.error(`[portfolio] ${name} :`, error);
      return undefined;
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    const year = document.getElementById("year");
    if (year) year.textContent = new Date().getFullYear();

    const toggleTheme = safely("thème", setupTheme) || (() => {});
    safely("langue", setupLang);
    safely("défilement doux", setupSmoothScroll);
    safely("projets", setupProjects);
    safely("navigation", setupNav);
    safely("photos", setupDeck);
    safely("activité GitHub", setupActivity);
    safely("éditeur", setupEditor);
    safely("parcours", setupJourney);
    safely("palette", () => setupCommandPalette(toggleTheme));
    safely("e-mail", setupCopyEmail);

    // Si les animations ne démarrent pas, on affiche directement tout le contenu
    if (safely("animations", setupReveal) !== true) document.documentElement.classList.remove("js");
    document.documentElement.setAttribute("data-ready", "");
  });
})();
