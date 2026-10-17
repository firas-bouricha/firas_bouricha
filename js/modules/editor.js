/*
 * Portfolio · Firas Bouricha — éditeur à onglets
 * Fenêtre de la section Profil : onglets terminal, about.md, main.tf, ci-cd.yml.
 */
(function (Site) {
  "use strict";
  const { escapeHTML } = Site;

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
    Site.selectEditorTab = select;
    tabs.forEach((tab, i) => {
      tab.addEventListener("click", () => select(tab));
      tab.addEventListener("keydown", (e) => {
        if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
        const next = tabs[(i + (e.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length];
        select(next, true);
      });
    });
  }

  Site.modules.editor = setupEditor;
})(window.Site);
