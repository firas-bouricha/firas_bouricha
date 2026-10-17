/*
 * Portfolio · Firas Bouricha — visionneuse de photos
 * Pile de photos du haut de page : boutons, clavier et glissement.
 */
(function (Site) {
  "use strict";
  const { onLang, isEN } = Site;

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

  Site.modules.deck = setupDeck;
})(window.Site);
