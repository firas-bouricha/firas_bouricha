/*
 * Portfolio · Firas Bouricha — palette de commandes
 * Ouverture avec Ctrl / ⌘ + K, recherche dans les sections, projets et actions.
 */
(function (Site) {
  "use strict";
  const { EMAIL, T, pick, ICONS, escapeHTML, copyEmail, scrollToSection } = Site;

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
      { group: "Actions", label: T("Ouvrir le terminal", "Open the terminal"), hint: "help · ls · cat", icon: '<rect x="3" y="4" width="18" height="16" rx="2.5"/><path d="M7 9l3 3-3 3M12 15h5"/>', run: () => Site.openTerminal() },
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

  Site.modules.palette = setupCommandPalette;
})(window.Site);
