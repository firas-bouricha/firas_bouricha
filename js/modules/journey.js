/*
 * Portfolio · Firas Bouricha — parcours
 * Frise horizontale : épinglée et pilotée par le défilement sur grand écran, défilante sur mobile.
 */
(function (Site) {
  "use strict";

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

  Site.modules.journey = setupJourney;
})(window.Site);
