/*
 * Portfolio · Firas Bouricha — outils partagés (window.Site)
 * Chargé avant les modules de js/modules/ ; js/main.js démarre l'ensemble.
 * Les projets sont définis dans data/projects.js : aucun de ces fichiers n'a
 * normalement besoin d'être modifié pour en ajouter un.
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


  /* ---------- Utilitaires ---------- */
  const escapeHTML = (value) =>
    String(value ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const safeURL = (url) => (/^https?:\/\//i.test(url || "") ? url : null);

  const svg = (name) => `<svg viewBox="0 0 24 24" aria-hidden="true">${ICONS[name] || ICONS.code}</svg>`;

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
    if (lenis) {
      // Position absolue calculée à partir du défilement réel : reste juste même si
      // la page a bougé sans Lenis (saut d'ancre, clavier, défilement du navigateur)
      const y = target.getBoundingClientRect().top + window.scrollY + navOffset();
      lenis.start();
      lenis.scrollTo(Math.max(0, y), { force: true });
    }
    else target.scrollIntoView({ behavior: "smooth" });
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

  window.Site = {
    EMAIL, T, onLang, isEN, pick, CATEGORY_EN, ICONS, escapeHTML, safeURL, svg, notify, copyEmail, scrollToSection,
    // Fournis par les modules terminal et éditeur (fonctions vides tant qu'ils ne sont pas démarrés)
    openTerminal: () => {},
    selectEditorTab: () => {},
    modules: { smoothScroll: setupSmoothScroll },
  };
})();
