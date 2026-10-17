/*
 * Portfolio · Firas Bouricha — terminal
 * Shell simulé façon zsh : help, ls, cat, neofetch, projets, open, cd… Textes dans data/terminal.js.
 */
(function (Site) {
  "use strict";
  const { EMAIL, T, onLang, isEN, pick, escapeHTML, scrollToSection, goTo } = Site;

  /* ---------- Terminal (onglet ">_ terminal" de la section Profil) ----------
     Un petit shell simulé, façon zsh + oh-my-zsh : help, ls, cat, whoami, neofetch,
     projets, open, cd… Les textes personnels (.mystere, whoami) sont dans data/terminal.js. */
  function setupTerminal(toggleTheme) {
    const tab = document.getElementById("tab-term");
    const pane = document.getElementById("pane-term");
    const out = document.getElementById("term-out");
    const form = document.getElementById("term-form");
    const input = document.getElementById("term-input");
    const ps1Live = document.getElementById("term-ps1");
    const mirror = document.getElementById("term-mirror");
    if (!tab || !pane || !out || !form || !input || !ps1Live || !mirror) {
      // Le terminal est sur la page Profil : depuis les autres pages, on y va
      Site.openTerminal = () => { window.location.href = "profil.html#editor"; };
      document.querySelectorAll("[data-open-term]").forEach((b) => b.addEventListener("click", () => Site.openTerminal()));
      return;
    }

    const DATA = window.TERMINAL || {};
    const say = (entry) => (entry ? (isEN() ? entry.en : entry.fr) || "" : "");
    const fine = window.matchMedia("(pointer: fine)");
    const strip = (text) => text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
    // Logo « FB » (police figlet « poison »), dans l'esprit du logo Arch de neofetch
    const LOGO = [
      "@@@@@@@@  @@@@@@@",
      "@@@@@@@@  @@@@@@@@",
      "@@!       @@!  @@@",
      "!@!       !@   @!@",
      "@!!!:!    @!@!@!@",
      "!!!!!:    !!!@!!!!",
      "!!:       !!:  !!!",
      ":!:       :!:  !:!",
      " ::        :: ::::",
      " :        :: : ::",
    ].join("\n");

    const history = [];
    let cursor = 0;
    let busy = false;
    let started = false;
    let failed = false; // la dernière commande a-t-elle échoué ? (flèche rouge, comme oh-my-zsh)
    let cwd = "~";
    let intro = null; // animation d'accueil en cours (frappe de « neofetch »)
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

    /* Affichage */
    const clock = () => new Date().toLocaleTimeString(isEN() ? "en-GB" : "fr-FR", { hour: "2-digit", minute: "2-digit" });
    // Invite sur deux lignes : ➜ firas@Portfolio ~ git:(main)        15:19  /  » commande
    const ps1 = () =>
      `<span class="t-arrow${failed ? " is-err" : ""}">➜</span><span><span class="t-user">firas</span><span class="t-dim">@</span><span class="t-host">Portfolio</span></span>` +
      `<span class="t-cwd">${escapeHTML(cwd)}</span><span class="t-git">git:(<span class="t-branch">main</span>)</span><span class="t-time">${clock()}</span>`;
    const refreshPrompt = () => { ps1Live.innerHTML = ps1(); };

    // Échappe le texte et met en forme les `commandes`
    const fmt = (text) => escapeHTML(text).replace(/`([^`]+)`/g, '<span class="t-cmd">$1</span>');
    // Chaque ligne apparaît en fondu ; les lignes d'une même réponse arrivent en cascade
    let burst = 0;
    const print = (html = "", cls = "") => {
      const row = document.createElement("div");
      row.className = cls ? `term__row ${cls}` : "term__row";
      row.innerHTML = html || "&nbsp;";
      row.style.setProperty("--d", `${Math.min(burst++, 14) * 40}ms`);
      if (burst === 1) requestAnimationFrame(() => { burst = 0; });
      out.appendChild(row);
      out.scrollTop = out.scrollHeight;
      return row;
    };
    const echo = (raw) => print(`<div class="term__ps1">${ps1()}</div><div><span class="t-chev">»</span> <span class="t-typed">${escapeHTML(raw)}</span></div>`, "term__echo");
    const grid = (pairs, keyCls = "t-cmd") =>
      print(pairs.map(([k, v]) => `<span class="${keyCls}">${escapeHTML(k)}</span><span>${v}</span>`).join(""), "term__grid");
    const err = (text) => { failed = true; print(fmt(text), "t-err"); };

    // Ligne de commande : bloc-curseur rétro dessiné par-dessus le vrai champ de saisie
    const syncCursor = () => {
      const v = input.value;
      const pos = input.selectionStart ?? v.length;
      mirror.innerHTML = `${escapeHTML(v.slice(0, pos))}<span class="term__cursor">${escapeHTML(v[pos] || " ")}</span>${escapeHTML(v.slice(pos + 1))}`;
    };

    /* Contenu */
    const FILES = ["about.md", "main.tf", "ci-cd.yml"];
    const DIRS = ["projets"];
    const SECTIONS = {
      "~": "top", accueil: "top", home: "top",
      profil: "about", profile: "about", about: "about",
      competences: "skills", skills: "skills",
      projets: "projects", projects: "projects",
      parcours: "journey", journey: "journey",
      contact: "contact",
    };
    const LINKS = {
      github: "https://github.com/firas-bouricha",
      linkedin: "https://www.linkedin.com/in/firas-bouricha/",
    };
    const projects = () => (window.PROJECTS || []).filter((p) => p && p.title);

    const catFile = (name) => {
      if (name === "about.md") {
        const rows = [...document.querySelectorAll("#pane-about .kv > div")].map((row) => [
          row.querySelector("dt")?.textContent.trim() || "",
          escapeHTML(row.querySelector("dd")?.textContent.replace(/\s+/g, " ").trim() || ""),
        ]);
        grid(rows, "t-key");
      } else if (name === "main.tf" || name === "ci-cd.yml") {
        const code = document.querySelector(`#${name === "main.tf" ? "pane-tf" : "pane-ci"} pre.code code`);
        print(`<pre class="code">${code ? code.innerHTML : ""}</pre>`);
      } else if (name === ".mystere") {
        print(fmt(T("# .mystere · dossier confidentiel 🔒", "# .mystere · classified file 🔒")), "t-dim");
        (say(DATA.mystere) || []).forEach((line) => print(`<span class="t-hidden">→</span> ${fmt(line)}`));
      } else if (DIRS.includes(name.replace(/\/$/, ""))) {
        err(T(`cat : ${name} : est un dossier (essayez \`ls ${name}\`)`, `cat: ${name}: is a directory (try \`ls ${name}\`)`));
      } else {
        err(T(`cat : ${name} : aucun fichier de ce nom`, `cat: ${name}: no such file`));
      }
    };

    const listProjects = () => {
      const list = projects();
      grid(list.map((p, i) => [String(i + 1), `${escapeHTML(pick(p, "title"))} <span class="t-dim">· ${escapeHTML(pick(p, "year") || "")} · ${escapeHTML(p.category || "")}</span>`]));
      print(fmt(T("Tapez `open 1` pour ouvrir le premier projet.", "Type `open 1` to open the first project.")), "t-dim");
    };

    const neofetch = () => {
      const info = [
        ["OS", "Portfolio OS · HTML/CSS/JS"],
        ["Shell", "zsh 5.9 + oh-my-zsh"],
        [T("Rôle", "Role"), T("Ingénieur Cloud &amp; Infra", "Cloud &amp; Infra Engineer")],
        [T("Lieu", "Location"), "Sophia Antipolis (06)"],
        [T("Statut", "Status"), `<span class="t-ok t-live">●</span> ${T("disponible", "available")}`],
      ];
      const colors = ["#2E2E36", "#FF5C57", "#5AF78E", "#F3F99D", "#57C7FF", "#C4A7FF", "#9AEDFE", "#F1F1F0"]
        .map((c, i) => `<i style="background:${c};--i:${i}"></i>`).join("");
      print(
        `<pre class="term__logo" aria-hidden="true">${escapeHTML(LOGO)}</pre>` +
          `<div class="term__info">` +
          `<div style="--i:0"><span class="t-user">firas</span><span class="t-dim">@</span><span class="t-host">Portfolio</span></div>` +
          `<div class="t-dim" style="--i:1">─────────────────</div>` +
          info.map(([k, v], i) => `<div style="--i:${i + 2}"><span class="t-key">${k}</span><span class="t-dim">:</span> ${v}</div>`).join("") +
          `<div class="term__swatches" aria-hidden="true">${colors}</div>` +
          `</div>`,
        "term__neo"
      );
    };

    // Lance fn quand le terminal apparaît à l'écran ; renvoie de quoi annuler
    const whenVisible = (fn) => {
      if (!("IntersectionObserver" in window)) { fn(); return null; }
      const io = new IntersectionObserver((entries) => {
        if (entries.some((e) => e.isIntersecting)) { io.disconnect(); fn(); }
      }, { threshold: 0.35 });
      io.observe(pane);
      return () => io.disconnect();
    };
    const stopIntro = () => {
      if (!intro) return;
      clearInterval(intro.timer);
      clearTimeout(intro.wait);
      if (intro.cancel) intro.cancel();
      intro = null;
    };

    // Accueil : dernière connexion, puis « neofetch » tapé lettre par lettre
    const welcome = (instant) => {
      stopIntro();
      const last = new Date().toLocaleString(isEN() ? "en-GB" : "fr-FR", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
      print(escapeHTML(T(`Dernière connexion : ${last} sur ttys001`, `Last login: ${last} on ttys001`)), "t-dim");
      print(fmt(T("Bienvenue ! Tapez `help` pour voir les commandes.", "Welcome! Type `help` to see the commands.")));
      const typed = echo("").querySelector(".t-typed");
      const word = "neofetch";
      const done = () => {
        stopIntro();
        typed.textContent = word;
        neofetch();
        out.scrollTop = 0; // l'accueil se lit depuis le haut
      };
      if (instant || reduce.matches) return done();
      typed.innerHTML = '<span class="term__cursor is-typing"> </span>';
      intro = { finish: done };
      intro.cancel = whenVisible(() => {
        if (!intro) return;
        let i = 0;
        intro.timer = setInterval(() => {
          i += 1;
          typed.innerHTML = `${escapeHTML(word.slice(0, i))}<span class="term__cursor is-typing"> </span>`;
          if (i >= word.length) {
            clearInterval(intro.timer);
            intro.wait = setTimeout(done, 280);
          }
        }, 90);
      });
    };

    const later = (steps, done) => {
      busy = true;
      input.disabled = true;
      pane.classList.add("is-busy");
      let delay = 0;
      steps.forEach(([wait, fn]) => { delay += wait; setTimeout(fn, delay); });
      setTimeout(() => {
        busy = false;
        input.disabled = false;
        pane.classList.remove("is-busy");
        refreshPrompt();
        if (fine.matches) input.focus({ preventScroll: true });
        if (done) done();
      }, delay + 50);
    };

    /* ls façon GNU coreutils : tri par nom, -a (fichiers cachés), -l (format long), -h (tailles lisibles) */
    const MTIME = new Date(); // date de modification affichée : l'ouverture de la page
    const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const two = (n) => String(n).padStart(2, "0");
    const lsDate = (d) => `${MONTHS[d.getMonth()]} ${String(d.getDate()).padStart(2, " ")} ${two(d.getHours())}:${two(d.getMinutes())}`;
    const bytes = (text) => new TextEncoder().encode(text).length;
    const fileText = (name) => {
      if (name === "about.md") return [...document.querySelectorAll("#pane-about .kv > div")].map((r) => r.textContent.replace(/\s+/g, " ").trim()).join("\n");
      if (name === "main.tf") return document.querySelector("#pane-tf code")?.textContent || "";
      if (name === "ci-cd.yml") return document.querySelector("#pane-ci code")?.textContent || "";
      if (name === ".mystere") return (say(DATA.mystere) || []).join("\n");
      return "";
    };
    const lsEntries = () => [
      { name: ".", dir: true, links: 3, size: 4096 },
      { name: "..", dir: true, links: 4, size: 4096 },
      { name: ".mystere", perm: "-rw-------", size: bytes(fileText(".mystere")) },
      ...FILES.map((f) => ({ name: f, size: bytes(fileText(f)) })),
      ...DIRS.map((d) => ({ name: d, dir: true, links: 2 + projects().length, size: 4096 })),
    ].sort((a, b) => (a.name < b.name ? -1 : 1));
    const lsProjects = () => projects()
      .map((p) => ({ name: (p.repo ? p.repo.split("/")[1] : p.title).toLowerCase().replace(/\s+/g, "-"), dir: true, links: 2, size: 4096 }))
      .sort((a, b) => (a.name < b.name ? -1 : 1));
    const lsName = (e) => {
      const cls = e.dir ? "t-dir" : e.name.startsWith(".") ? "t-hidden" : "";
      return cls ? `<span class="${cls}">${escapeHTML(e.name)}</span>` : escapeHTML(e.name);
    };
    // Droits colorés caractère par caractère, comme eza / lsd
    const PERM_CLS = { d: "p-d", r: "p-r", w: "p-w", x: "p-x", "-": "p-n" };
    const lsPerm = (perm) => [...perm].map((c) => `<span class="${PERM_CLS[c] || ""}">${c}</span>`).join("");
    const lsSize = (n, human) => (human && n >= 1024 ? `${(n / 1024).toFixed(1)}K` : String(n));
    const lsLong = (e, human) =>
      `<span>${lsPerm(e.perm || (e.dir ? "drwxr-xr-x" : "-rw-r--r--"))}</span><span class="t-num">${e.links || 1}</span>` +
      `<span class="t-owner">firas</span><span class="t-grp">firas</span><span class="t-size">${lsSize(e.size, human)}</span>` +
      `<span class="t-date">${lsDate(MTIME)}</span><span>${lsName(e)}</span>`;

    /* Commandes : [arguments, description FR, description EN, action] */
    const COMMANDS = {
      help: ["", "afficher cette aide", "show this help", () => {
        print(T("Commandes disponibles :", "Available commands:"));
        grid(Object.entries(COMMANDS).filter(([, c]) => c[1]).map(([name, c]) => [`${name}${c[0] ? ` ${c[0]}` : ""}`, escapeHTML(T(c[1], c[2]))]));
        print(fmt(T("Astuce : Tab complète, ↑ ↓ parcourent l'historique, Ctrl + L efface.", "Tip: Tab completes, ↑ ↓ browse history, Ctrl + L clears.")), "t-dim");
      }],
      ls: ["[-la] [dossier]", "lister les fichiers", "list files", (args) => {
        const flags = args.filter((a) => a.startsWith("-")).join("");
        const all = /a/i.test(flags);
        const long = flags.includes("l");
        const human = flags.includes("h");
        const target = (args.find((a) => !a.startsWith("-")) || "").replace(/\/$/, "");
        let list;
        if (!target || target === "." || target === "~") list = lsEntries().filter((e) => all || !e.name.startsWith("."));
        else if (DIRS.includes(target)) {
          if (!long) return listProjects();
          list = lsProjects();
        } else {
          list = lsEntries().filter((e) => e.name === target && e.name !== "." && e.name !== "..");
          if (!list.length) return err(T(`ls : impossible d'accéder à '${target}' : aucun fichier ou dossier de ce nom`, `ls: cannot access '${target}': No such file or directory`));
        }
        if (long) {
          if (!target || DIRS.includes(target) || target === "." || target === "~") print(`total ${list.reduce((n, e) => n + Math.ceil(e.size / 4096) * 4, 0)}`);
          print(list.map((e) => lsLong(e, human)).join(""), "term__ls");
        } else {
          print(list.map(lsName).join("  "));
          if (!all && !target) print(fmt(T("(certains fichiers sont cachés…)", "(some files are hidden…)")), "t-dim");
        }
      }],
      cat: ["<fichier>", "lire un fichier", "read a file", (args) => {
        if (!args.length) return err(T("cat : nom de fichier manquant (essayez `cat about.md`)", "cat: missing file name (try `cat about.md`)"));
        args.forEach(catFile);
      }],
      whoami: ["", "qui suis-je ?", "who am I?", () => print(escapeHTML(say(DATA.whoami) || "Firas Bouricha"))],
      neofetch: ["", "fiche système", "system info", neofetch],
      projets: ["", "lister mes projets", "list my projects", listProjects],
      open: ["<n|github|linkedin>", "ouvrir un projet ou un lien", "open a project or a link", (args) => {
        const what = (args[0] || "").toLowerCase();
        const list = projects();
        const n = Number(what);
        let url = LINKS[what];
        if (Number.isInteger(n) && n >= 1 && n <= list.length) {
          const p = list[n - 1];
          url = p.repo ? `https://github.com/${p.repo}` : p.demo;
        }
        if (what === "cv") return err(T("open : cv : bientôt disponible", "open: cv: coming soon"));
        if (!url) return err(T("open : précisez un numéro de projet, github ou linkedin", "open: give a project number, github or linkedin"));
        print(`<span class="t-ok">↗</span> ${escapeHTML(url)}`);
        window.open(url, "_blank", "noopener");
      }],
      cd: ["<section>", "aller à une section (projets, parcours…)", "go to a section (projects, journey…)", (args) => {
        const where = strip((args[0] || "~").replace(/\/$/, ""));
        if (where === "..") return print(fmt(T("Impossible de remonter plus haut : vous êtes déjà chez moi.", "Can't go any higher: you're already at my place.")), "t-dim");
        const id = SECTIONS[where];
        if (!id) return err(T(`cd : ${args[0]} : aucun dossier de ce nom (essayez \`cd projets\`)`, `cd: ${args[0]}: no such directory (try \`cd projects\`)`));
        cwd = id === "top" ? "~" : `~/${where}`;
        setTimeout(() => goTo(id), 250);
      }],
      contact: ["", "mes coordonnées", "my contact details", () => {
        grid([["mail", escapeHTML(EMAIL)], ["linkedin", "in/firas-bouricha"], ["github", "firas-bouricha"]], "t-key");
      }],
      lang: ["<fr|en>", "changer de langue", "switch language", (args) => {
        const next = (args[0] || "").toLowerCase();
        if (next !== "fr" && next !== "en") return print(fmt(T("Langue : français. Tapez `lang en` pour passer en anglais.", "Language: English. Type `lang fr` to switch to French.")));
        if (window.i18n) window.i18n.set(next);
        print(`<span class="t-ok">✔</span> ${T("Langue : français", "Language: English")}`);
      }],
      theme: ["[light|dark]", "thème clair / sombre", "light / dark theme", (args) => {
        const now = document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
        const want = (args[0] || "").toLowerCase();
        if (want !== now) toggleTheme();
        const light = document.documentElement.getAttribute("data-theme") === "light";
        print(`<span class="t-ok">✔</span> ${T("Thème", "Theme")} : ${light ? T("clair", "light") : T("sombre", "dark")}`);
      }],
      history: ["", "commandes déjà tapées", "previous commands", () => {
        grid(history.map((h, i) => [String(i + 1), escapeHTML(h)]), "t-dim");
      }],
      clear: ["", "effacer l'écran", "clear the screen", () => { out.innerHTML = ""; }],
      exit: ["", "fermer le terminal", "close the terminal", () => {
        print(T("[Processus terminé]", "[Process completed]"), "t-dim");
        later([[600, () => {
          stopIntro();
          out.innerHTML = "";
          started = false;
          Site.selectEditorTab(document.getElementById("tab-about"));
        }]]);
      }],
      // Commandes cachées (absentes de help)
      sudo: ["", "", "", (args) => {
        const what = args.join(" ").toLowerCase();
        if (what !== "hire-me" && what !== "hire me") {
          return err(T("recruteur n'est pas dans le fichier sudoers. Cet incident sera signalé. 😉", "recruiter is not in the sudoers file. This incident will be reported. 😉"));
        }
        print(T("[sudo] mot de passe pour recruteur : ********", "[sudo] password for recruiter: ********"));
        later([
          [700, () => print(`<span class="t-ok">✔</span> ${T("Accès accordé. Excellent choix.", "Access granted. Excellent choice.")}`)],
          [400, () => {
            const label = T("Rédaction de l'e-mail", "Drafting the email");
            const bar = (n) => `${label} [<span class="t-ok">${"#".repeat(n)}</span><span class="t-dim">${".".repeat(20 - n)}</span>] ${n * 5}%`;
            const row = print(bar(0));
            let n = 0;
            const tick = setInterval(() => {
              n += 1;
              row.innerHTML = bar(n);
              if (n >= 20) clearInterval(tick);
            }, 50);
          }],
          [1200, () => print(T("Ouverture de votre messagerie…", "Opening your mail client…"), "t-dim")],
          [600, () => {
            const subject = encodeURIComponent(T("Opportunité pour vous", "An opportunity for you"));
            window.location.href = `mailto:${EMAIL}?subject=${subject}`;
          }],
        ]);
      }],
      rm: ["", "", "", (args) => {
        if (args.some((a) => /^-\w*r/.test(a))) return err(T("rm : opération refusée. Cette infra est durcie. 🔒", "rm: operation denied. This infrastructure is hardened. 🔒"));
        err(T("rm : système de fichiers en lecture seule", "rm: read-only file system"));
      }],
      pwd: ["", "", "", () => print(escapeHTML(`/home/firas${cwd.slice(1)}`))],
      date: ["", "", "", () => print(escapeHTML(new Date().toLocaleString(isEN() ? "en-GB" : "fr-FR")))],
      echo: ["", "", "", (args) => print(escapeHTML(args.join(" ")))],
    };
    const ALIASES = { aide: "help", projects: "projets", dir: "ls", cls: "clear", "?": "help" };

    const run = (raw) => {
      if (intro) intro.finish();
      echo(raw);
      const line = raw.trim();
      if (!line) return;
      history.push(line);
      cursor = history.length;
      failed = false;
      let [first, ...args] = line.split(/\s+/);
      if (first.toLowerCase() === "ll") { first = "ls"; args = ["-la", ...args]; } // alias habituel
      const name = ALIASES[first.toLowerCase()] || first.toLowerCase();
      const cmd = COMMANDS[name];
      if (!cmd) return err(T(`zsh : commande introuvable : ${first}. Tapez \`help\`.`, `zsh: command not found: ${first}. Type \`help\`.`));
      cmd[3](args);
    };

    /* Complétion (Tab) */
    const candidates = (tokens) => {
      if (tokens.length <= 1) return Object.keys(COMMANDS).filter((c) => COMMANDS[c][1] || c === "sudo");
      const cmd = ALIASES[tokens[0].toLowerCase()] || tokens[0].toLowerCase();
      return {
        cat: [...FILES, ".mystere"],
        ls: [...DIRS, "-a", "-l", "-la", "-lah"],
        cd: ["projets", "parcours", "competences", "profil", "contact", "~"],
        open: ["github", "linkedin", ...projects().map((_, i) => String(i + 1))],
        lang: ["fr", "en"],
        theme: ["light", "dark"],
        sudo: ["hire-me"],
      }[cmd] || [];
    };
    const complete = () => {
      const tokens = input.value.replace(/^\s+/, "").split(/\s+/);
      const last = tokens[tokens.length - 1];
      const matches = candidates(tokens).filter((c) => c.startsWith(last.toLowerCase()) && (last.startsWith(".") || !c.startsWith(".")));
      if (matches.length === 1) {
        tokens[tokens.length - 1] = matches[0];
        input.value = `${tokens.join(" ")} `;
      } else if (matches.length > 1) {
        echo(input.value);
        print(matches.map(escapeHTML).join("   "), "t-dim");
      }
      syncCursor();
    };

    /* Événements */
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (busy) return;
      const raw = input.value;
      input.value = "";
      run(raw);
      refreshPrompt();
      syncCursor();
    });
    input.addEventListener("keydown", (e) => {
      if (e.key === "Tab" && input.value.trim()) {
        e.preventDefault();
        complete();
      } else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        if (!history.length) return;
        e.preventDefault();
        cursor = Math.max(0, Math.min(history.length, cursor + (e.key === "ArrowUp" ? -1 : 1)));
        input.value = history[cursor] || "";
        input.setSelectionRange(input.value.length, input.value.length);
        syncCursor();
      } else if (e.key.toLowerCase() === "l" && e.ctrlKey) {
        e.preventDefault();
        stopIntro();
        out.innerHTML = "";
      }
    });
    input.addEventListener("input", syncCursor);
    document.addEventListener("selectionchange", () => { if (document.activeElement === input) syncCursor(); });
    // Un clic n'importe où dans le terminal donne le focus à la ligne de commande
    pane.addEventListener("click", (e) => {
      if (e.target.closest("a") || String(window.getSelection())) return;
      input.focus({ preventScroll: true });
    });

    const start = () => {
      if (started) return;
      started = true;
      cwd = "~";
      failed = false;
      welcome();
      refreshPrompt();
      syncCursor();
    };
    // Le terminal est l'onglet ouvert par défaut ; après `exit`, l'accueil revient à la réouverture
    new MutationObserver(() => { if (!pane.hidden) start(); }).observe(pane, { attributes: true, attributeFilter: ["hidden"] });
    if (!pane.hidden) start();
    out.setAttribute("role", "log"); // après l'accueil : les lecteurs d'écran n'annoncent que les réponses
    out.setAttribute("aria-live", "polite");
    tab.addEventListener("click", () => { if (fine.matches) input.focus({ preventScroll: true }); });
    // Changement de langue : l'accueil suit, tant que rien n'a été tapé
    onLang(() => {
      if (started && !history.length) { out.innerHTML = ""; welcome(true); }
      refreshPrompt();
    });
    // L'heure de l'invite reste à jour
    setInterval(refreshPrompt, 30000);

    Site.openTerminal = () => {
      Site.selectEditorTab(tab);
      scrollToSection("editor");
      if (fine.matches) setTimeout(() => input.focus({ preventScroll: true }), 700);
    };
    document.querySelectorAll("[data-open-term]").forEach((b) => b.addEventListener("click", Site.openTerminal));
  }

  Site.modules.terminal = setupTerminal;
})(window.Site);
