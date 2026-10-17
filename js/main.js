/*
 * Portfolio · Firas Bouricha — démarrage
 * Lance chaque module (js/core.js + js/modules/*.js) indépendamment :
 * une erreur dans l'un n'empêche pas les autres de fonctionner.
 */
(function (Site) {
  "use strict";
  const M = (Site && Site.modules) || {};

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

    const toggleTheme = safely("thème", () => M.theme()) || (() => {});
    safely("langue", () => M.lang());
    safely("défilement doux", () => M.smoothScroll());
    safely("projets", () => M.projects());
    safely("navigation", () => M.nav());
    safely("photos", () => M.deck());
    safely("activité GitHub", () => M.activity());
    safely("éditeur", () => M.editor());
    safely("terminal", () => M.terminal(toggleTheme));
    safely("parcours", () => M.journey());
    safely("palette", () => M.palette(toggleTheme));
    safely("e-mail", () => M.copyEmail());

    // Si les animations ne démarrent pas, on affiche directement tout le contenu
    if (safely("animations", () => M.reveal()) !== true) document.documentElement.classList.remove("js");
    document.documentElement.setAttribute("data-ready", "");

    // Arrivée avec une ancre (ex. parcours.html#contact) : la page s'est construite après le saut
    // du navigateur (frise, cartes de projets…), on recale donc la position, sans animation
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (id && document.getElementById(id) && Site) {
      const settle = () => Site.scrollToSection(id, { instant: true });
      requestAnimationFrame(settle);
      window.addEventListener("load", settle, { once: true });
    } else if (id && Site) {
      // Ancien lien de la version « une seule page » (ex. …/#projects) : ouverture de la bonne page
      Site.goTo(id);
    }
  });
})(window.Site);
