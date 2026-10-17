/*
 * Portfolio · Firas Bouricha — activité GitHub
 * Calendrier des contributions (API publique, cache de 6 h, message de repli).
 */
(function (Site) {
  "use strict";
  const { T, onLang, isEN } = Site;

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

  Site.modules.activity = setupActivity;
})(window.Site);
