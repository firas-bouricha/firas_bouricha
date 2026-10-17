/*
 * Portfolio · Firas Bouricha — projets
 * Cartes générées à partir de data/projects.js, filtres par catégorie, bouton « +N ».
 */
(function (Site) {
  "use strict";
  const { T, onLang, isEN, pick, CATEGORY_EN, escapeHTML, safeURL, svg } = Site;

  const MAX_TAGS = 4; // au-delà, les technologies sont regroupées dans un bouton « +N »

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
                <h2 class="project__title">${escapeHTML(pick(project, "title"))}</h2>
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

  Site.modules.projects = setupProjects;
})(window.Site);
