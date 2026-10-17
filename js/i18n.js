/*
 * Traduction FR / EN
 * ------------------------------------------------------------
 * Le français est la langue par défaut : il est écrit directement dans index.html.
 * Chaque élément traduisible porte un attribut data-i18n="clé" (contenu) ou
 * data-i18n-attr="attribut:clé; autre:clé" (attributs : aria-label, alt, placeholder…).
 * Ce fichier contient uniquement les textes anglais, rangés par clé.
 *
 * Pour modifier une traduction : changer la phrase anglaise ci-dessous.
 * Pour traduire un nouvel élément : ajouter data-i18n="ma.cle" dans index.html,
 * puis "ma.cle": "English text" ici.
 */
(function () {
  "use strict";

  const EN = {
    // Méta
    "meta.title": "Firas Bouricha · Cloud & Infrastructure Engineer",
    "meta.desc": "Firas Bouricha, Cloud & Infrastructure engineer based in Sophia Antipolis. Virtualisation, automation (Terraform, Ansible), DevSecOps and security. Open to opportunities.",

    // Navigation
    "nav.skip": "Skip to content",
    "nav.home.aria": "Firas Bouricha, back to top",
    "nav.aria": "Main navigation",
    "nav.home": "Home",
    "nav.about": "Profile",
    "nav.skills": "Skills",
    "nav.projects": "Projects",
    "nav.journey": "Journey",
    "nav.contact": "Contact",
    "nav.search.aria": "Search (Ctrl + K)",
    "nav.search": "search…",
    "nav.lang.aria": "Passer le site en français",
    "nav.theme.aria": "Light theme",

    // Hero
    "hero.status": "Open to opportunities",
    "hero.role": "Cloud &amp; Infrastructure Engineer",
    "hero.lead": "I design, automate and secure infrastructure: Proxmox virtualisation, Infrastructure as Code, hardened CI/CD pipelines. I'm looking to put these skills to work for a team.",
    "hero.school": "Master's in Cloud, Security &amp; Infrastructure · Ynov",
    "hero.cta.projects": "See my projects",
    "hero.cta.contact": "Contact me",
    "hero.linkedin.aria": "Firas Bouricha on LinkedIn",
    "hero.github.aria": "Firas Bouricha on GitHub",
    "deck.aria": "Photos of Firas Bouricha",
    "deck.prev": "Previous photo",
    "deck.next": "Next photo",
    "deck.alt.portrait": "Portrait of Firas Bouricha",
    "deck.alt.mentoring": "Firas helping a student at his computer",
    "deck.alt.ydays": "Firas and his team in front of the “11 Ydays projects hosted” screen",
    "deck.alt.event": "Firas at an event, phone in hand",

    // Profil
    "about.kicker": "profile",
    "about.title": "Who I am",
    "about.p1": "A student in the <strong>Master's programme in Cloud, Security &amp; Infrastructure</strong> at Ynov Sophia Antipolis, I've built my profile on a simple belief: reliable infrastructure is infrastructure that is <strong>documented, automated and secure by design</strong>.",
    "about.p2": "In practice, I provision VMs from a simple GLPI request, describe complete environments as code with Terraform, OpenTofu and Ansible, and set up CI/CD pipelines that block exposed secrets and vulnerable images before they reach production.",
    "about.p3": "Alongside my studies, I support Ynov's computer science students as an <strong>IT mentor</strong>. Explaining technical topics clearly, writing procedures and sharing knowledge are part of how I work.",
    "editor.aria": "Files",
    "kv.role": "role",
    "kv.role.v": "Cloud &amp; Infrastructure Engineer",
    "kv.seek": "seeking",
    "kv.seek.v": "role <span class=\"muted\">Cloud · Infra · DevOps</span>",
    "kv.school": "school",
    "kv.school.v": "Master's, Ynov <span class=\"muted\">2025 – 2027</span>",
    "kv.mentor.v": "IT students @Ynov Sophia",
    "kv.focus.v": "design · automate · secure",
    "kv.place": "location",
    "pr.design": "<span class=\"mono\">01</span>Design",
    "pr.design.t": "Virtualised and cloud architectures, network segmentation, clear and up-to-date documentation.",
    "pr.automate": "<span class=\"mono\">02</span>Automate",
    "pr.automate.t": "Infrastructure as Code, Ansible playbooks and reproducible pipelines instead of manual clicks.",
    "pr.secure": "<span class=\"mono\">03</span>Secure",
    "pr.secure.t": "SSH and firewall hardening, encrypted secrets management, continuous vulnerability scanning.",

    // Compétences
    "skills.kicker": "skills",
    "skills.title": "The tools I use",
    "skills.sub": "Grouped by domain, as I use them in my projects and in my home lab.",
    "skills.systems": "systems",
    "skills.iac": "iac · automation",
    "skills.containers": "containers · ci/cd",
    "skills.security": "security · network",
    "skills.monitoring": "monitoring · itsm",
    "skills.languages": "languages · data",

    // Projets
    "projects.kicker": "projects",
    "projects.title": "What I've built",
    "projects.sub": "Real-world projects, documented and versioned on GitHub.",
    "projects.all": "All my repositories",
    "projects.filters": "Filter projects",
    "activity.title": "GitHub activity",
    "activity.scroll": "Contributions calendar (scrollable)",
    "activity.profile": "My GitHub profile",
    "activity.note": "Each square is a day of work versioned on GitHub.",
    "activity.less": "less",
    "activity.more": "more",

    // Parcours
    "journey.kicker": "journey",
    "journey.title": "My journey",
    "journey.sub": "From Gabès to Sophia Antipolis, by way of Germany: thirteen years of computing, languages and hands-on work.",
    "journey.aria": "Journey timeline, from 2013 to today",
    "journey.hint": "scroll",
    "j1.place": "Gabès, Tunisia",
    "j1.title": "Baccalaureate and start of higher education in computer science",
    "j1.text": "With my baccalaureate in hand, I began my higher education in computer science with a MIAGE bachelor's degree at the Higher Institute of Management of Gabès.",
    "j2.place": "Gabès, Tunisia",
    "j2.title": "MIAGE Bachelor's degree — Higher Institute of Management of Gabès",
    "j2.text": "Degree in computer science applied to business management: software development, databases and information systems.",
    "j3.place": "Germany",
    "j3.title": "Intensive German language training",
    "j3.text": "I moved to Germany and devoted a full year to learning German.",
    "j4.place": "Koblenz, Germany",
    "j4.title": "Bachelor's in Computer Science — Universität Koblenz",
    "j4.text": "I joined the University of Koblenz to continue my computer science studies in a demanding, international environment.",
    "j5.title": "Move to France and École 42",
    "j5.text": "I moved to France. In late 2021, I joined École 42 and its project-based learning, built on autonomy and peer-to-peer learning.",
    "j6.text": "Sales and IT-based inventory optimisation, performance analysis and onboarding of new hires.",
    "j7.place": "Montreuil · October 2024",
    "j7.title": "Cloud &amp; DevOps work placement — KLESIA",
    "j7.text": "A week embedded in a cloud team: deploying a container app on Microsoft Azure, getting hands-on with Azure CLI, Docker and WSL, and discovering DevOps workflows.",
    "j8.now": "today",
    "j8.title": "Master's in Cloud, Security &amp; Infrastructure — IT Mentor (work-study), Ynov Campus",
    "j8.text": "At Ynov Campus, I specialise in automation and DevSecOps. As a work-study student, I mentor more than 20 students (deliverable completion rate up 20%) and run weekly workshops on Git, databases, networking and infrastructure.",

    // Contact
    "contact.title": "Hiring? <span class=\"accent\">Let's talk.</span>",
    "contact.lead": "I'm looking for a Cloud, Infrastructure or DevOps engineering role. The easiest way to reach me: an email or a message on LinkedIn.",
    "contact.copy": "Copy address",

    // Pied de page
    "footer.status": "AVAILABLE",
    "footer.search": ":search",
    "footer.note": "Firas Bouricha · Cloud &amp; Infrastructure Engineer · Sophia Antipolis · <span class=\"mono\">firas@Portfolio:~$ <span class=\"accent\">exit</span></span>",

    // Terminal
    "term.input": "Command (type help)",
    "term.open": "Open the terminal",

    // Palette de commandes
    "cmdk.aria": "Command palette",
    "cmdk.placeholder": "Search for a section, a project, an action…",
    "cmdk.esc": "Esc",
    "cmdk.results": "Results",
    "cmdk.nav": "navigate",
    "cmdk.open": "open",
  };

  const STORE_KEY = "lang";
  const root = document.documentElement;
  const original = new Map(); // élément → { html, attrs } en français
  let lang = "fr";

  const attrPairs = (el) =>
    (el.getAttribute("data-i18n-attr") || "")
      .split(";")
      .map((pair) => pair.split(":").map((s) => s.trim()))
      .filter(([attr, key]) => attr && key);

  // Mémorise le français d'origine (une seule fois par élément)
  const remember = (el) => {
    if (original.has(el)) return;
    const attrs = {};
    attrPairs(el).forEach(([attr]) => { attrs[attr] = el.getAttribute(attr); });
    original.set(el, { html: el.hasAttribute("data-i18n") ? el.innerHTML : null, attrs });
  };

  const meta = {
    title: document.title,
    desc: document.querySelector('meta[name="description"]')?.getAttribute("content") || "",
  };

  function apply(next) {
    lang = next === "en" ? "en" : "fr";
    document.querySelectorAll("[data-i18n], [data-i18n-attr]").forEach((el) => {
      remember(el);
      const fr = original.get(el);
      const key = el.getAttribute("data-i18n");
      if (key) {
        const html = lang === "en" ? EN[key] : fr.html;
        if (html != null) el.innerHTML = html;
      }
      attrPairs(el).forEach(([attr, k]) => {
        const value = lang === "en" ? EN[k] : fr.attrs[attr];
        if (value != null) el.setAttribute(attr, value);
      });
    });
    root.lang = lang;
    document.title = lang === "en" ? EN["meta.title"] : meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", lang === "en" ? EN["meta.desc"] : meta.desc);
    document.dispatchEvent(new CustomEvent("langchange", { detail: { lang } }));
  }

  // Langue initiale : ?lang=en dans l'adresse, sinon choix mémorisé, sinon français
  let initial = "fr";
  try {
    const fromUrl = new URLSearchParams(window.location.search).get("lang");
    if (fromUrl === "en" || fromUrl === "fr") initial = fromUrl;
    else if (localStorage.getItem(STORE_KEY) === "en") initial = "en";
  } catch { /* stockage ou URL indisponible : français */ }

  window.i18n = {
    get lang() { return lang; },
    /** Texte selon la langue active : i18n.t("Voir le code", "View code") */
    t: (fr, en) => (lang === "en" ? en : fr),
    set(next) {
      apply(next);
      try { localStorage.setItem(STORE_KEY, lang); } catch { /* ignore */ }
    },
    toggle() { this.set(lang === "en" ? "fr" : "en"); },
  };

  if (initial === "en") apply("en");
})();
