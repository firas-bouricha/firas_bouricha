# Portfolio · Firas Bouricha

Site personnel de **Firas Bouricha**, ingénieur Cloud & Infrastructure.

🔗 **En ligne :** https://firas-bouricha.github.io/firas_bouricha/

Le design reprend l'identité de mon [profil GitHub](https://github.com/firas-bouricha) : fond sombre, accent violet,
typographies Space Grotesk et JetBrains Mono, et clins d'œil au terminal (`$ cat about.md`, `$ ls ~/projets`…).

---

## Structure du projet

```
.
├── index.html          # Accueil : présentation, photos, « Par où commencer ? »
├── profil.html         # Profil, terminal interactif, compétences
├── projets.html        # Projets (filtres) et activité GitHub
├── parcours.html       # Parcours (frise) et contact
├── 404.html            # Page « introuvable » façon terminal
├── version.json        # Numéro de version en ligne (mise à jour automatique des visiteurs)
├── sitemap.xml         # Plan du site pour Google (FR + EN)
├── robots.txt, site.webmanifest
├── data/
│   ├── projects.js     # ⭐ La liste des projets : c'est ici qu'on en ajoute
│   └── terminal.js     # Textes du terminal (fichier caché .mystere, whoami)
├── css/
│   └── style.css       # Le design (polices, couleurs, mise en page, responsive)
├── js/
│   ├── i18n.js         # Traductions anglaises (bouton FR / EN)
│   ├── core.js         # Outils partagés par les modules (window.Site)
│   ├── modules/        # Un fichier par fonctionnalité : ui, projects, terminal, palette…
│   ├── main.js         # Démarrage : lance chaque module indépendamment
│   └── vendor/lenis.min.js  # Défilement doux (Lenis, licence MIT)
├── assets/
│   ├── fonts/          # Space Grotesk et JetBrains Mono (woff2, licence OFL)
│   ├── icons/          # Logos des technologies + favicon et icônes du site
│   ├── photos/         # Photos du haut de page (WebP)
│   ├── projects/       # Images des projets (WebP)
│   └── og-image.jpg    # Aperçu affiché quand le lien est partagé (LinkedIn, Slack…)
├── scripts/
│   ├── bump-version.sh # Change le numéro de version avant une publication
│   ├── sync-layout.js  # Recopie le menu, le pied de page et le <head> commun dans toutes les pages
│   └── og-image/       # Modèle et script de l'image de partage
└── tests/              # Tests automatiques (Playwright), lancés sur chaque PR
```

Fonctionnalités : site bilingue FR / EN (français par défaut), défilement doux avec inertie, thème clair / sombre (mémorisé), palette de commandes (`Ctrl` + `K` ou `⌘` + `K`),
filtres de projets, parcours interactif façon `git log`, éditeur de code à onglets et vrai terminal dans la section Profil.

Le site est 100 % statique : aucun framework, aucune étape de build, aucune ressource externe (polices comprises).
Il suffit de pousser sur la branche publiée par GitHub Pages pour le mettre à jour. Node.js ne sert qu'aux tests.

---

## Les pages et leurs blocs communs

Le site compte 4 pages. Le menu, le pied de page et le début du `<head>` sont **identiques sur toutes les pages** ;
dans chaque fichier, ils sont encadrés par des commentaires :

```html
<!-- layout:meta … -->   …   <!-- /layout:meta -->     balises communes du <head>
<!-- layout:header -->   …   <!-- /layout:header -->   menu
<!-- layout:footer -->   …   <!-- /layout:footer -->   pied de page, palette ⌘K, scripts
```

**Pour les modifier** : changer le bloc dans `index.html` uniquement, puis lancer `npm run sync` (ou
`node scripts/sync-layout.js`) qui le recopie dans les autres pages. Un test vérifie que les pages restent identiques.

Le titre, la description et les balises de partage de chaque page sont au début de son `<head>`, en dehors des blocs
communs (version anglaise dans `js/i18n.js` : clés `meta.title.profil`, `meta.desc.profil`…).

---

## Ajouter un projet (2 minutes)

1. Ouvrir `data/projects.js`.
2. Copier un bloc existant `{ ... },` et le coller dans la liste, à l'endroit où le projet doit apparaître.
3. Modifier les valeurs :

```js
{
  title: "Nom du projet",
  description: "Le problème résolu et le résultat obtenu, en 1 à 2 phrases.",
  tags: ["Terraform", "Proxmox"],
  repo: "firas-bouricha/nom-du-depot",   // optionnel
  demo: "https://lien-vers-la-demo",     // optionnel
  image: "assets/projects/mon-projet.jpg", // optionnel (photo ou capture)
  imageAlt: "Ce que montre l'image",     // optionnel
  icon: "server",                        // optionnel
  color: "cyan",                         // optionnel
  category: "Infrastructure",            // optionnel (crée le filtre automatiquement)
  year: "2026",                          // optionnel (affiché à droite du titre)
  featured: true,                        // optionnel (carte large en haut)
},
```

4. Commit + push. La carte, le filtre de catégorie et les liens « Voir le code » / « Démo en ligne » sont créés
   automatiquement.

| Champ | Valeurs possibles |
|-------|-------------------|
| `icon` | `home`, `server`, `shield`, `layers`, `code`, `git`, `cloud`, `database`, `game`, `terminal`, `network` |
| `color` | `violet`, `cyan`, `emerald`, `amber`, `pink`, `blue`, `red` |

**Ajouter une image**

1. Déposer la photo ou la capture d'écran dans `assets/projects/`, de préférence au format **WebP** (environ 2 fois
   plus léger que le JPEG ; conversion gratuite sur [squoosh.app](https://squoosh.app)). Viser moins de 150 Ko et
   900 à 1500 px de large. Les formats `.jpg` et `.png` fonctionnent aussi.
2. Renseigner `image` (le chemin du fichier) et `imageAlt` (une phrase qui décrit l'image).

Sur une carte mise en avant (`featured: true`), l'image s'affiche à gauche du texte ; sur une carte normale, en haut.

**Conseils pour une bonne description**

- Commencer par le résultat concret : *« Une demande GLPI crée une VM Proxmox automatiquement »*.
- Citer les outils dans les `tags` plutôt que dans la phrase.
- Réserver `featured: true` aux 2 ou 3 projets les plus représentatifs du poste visé.
- Au-delà de 4 technologies, les suivantes sont regroupées dans un bouton « +N » : mettre les plus importantes en premier.

---

## Ajouter une compétence

Dans `profil.html`, section « Compétences », copier une ligne `<li class="tech">` dans la bonne catégorie et changer
le logo (`assets/icons/…`) et le nom. Les logos officiels en couleur se trouvent sur
[devicon.dev](https://devicon.dev) (fichier `*-original.svg`).

---

## Le terminal (`firas@Portfolio`)

L'onglet **`>_ terminal`** de la page Profil (`profil.html`), ouvert par défaut, est un petit shell simulé façon zsh +
oh-my-zsh : au chargement, il affiche `neofetch` avec le logo ASCII « FB ». On l'ouvre aussi depuis la palette
(`Ctrl` + `K` → « Ouvrir le terminal ») ou en cliquant sur `firas@Portfolio` dans la barre d'état du bas.

| Commande | Effet |
|----------|-------|
| `help` | Liste des commandes |
| `ls` / `ls -a` | Fichiers ; `-a` révèle le fichier caché `.mystere` |
| `cat <fichier>` | Lit `about.md`, `main.tf`, `ci-cd.yml`, `.mystere` |
| `whoami`, `neofetch` | Présentation courte, fiche « système » |
| `projets`, `open <n>` | Liste des projets, ouverture du dépôt n° n |
| `open github` / `open linkedin` | Ouvre le lien |
| `cd <section>` | Fait défiler jusqu'à la section (`cd contact`) |
| `contact`, `lang fr\|en`, `theme`, `history`, `clear`, `exit` | Actions courantes |

Commandes cachées : `sudo hire-me` (ouvre un e-mail), `rm -rf /`, `pwd`, `date`, `echo`.
`Tab` complète, `↑` / `↓` parcourent l'historique, `Ctrl` + `L` efface l'écran.

**Modifier les textes** : ouvrir `data/terminal.js` et changer les phrases de `mystere` (une ligne par
élément, en `fr` et en `en`). Le texte entre `` `accents graves` `` s'affiche comme une commande.

---

## Version anglaise (FR / EN)

Le français est la langue par défaut : il est écrit directement dans les pages HTML. Le bouton **FR / EN** du menu
bascule la langue et mémorise le choix. Un lien direct vers la version anglaise :
`https://firas-bouricha.github.io/firas_bouricha/?lang=en` (pratique pour une candidature en anglais).

- **Modifier une traduction** : changer la phrase anglaise dans `js/i18n.js`.
- **Traduire un nouveau texte** : ajouter `data-i18n="ma.cle"` sur l'élément dans la page HTML
  (ou `data-i18n-attr="aria-label:ma.cle"` pour un attribut), puis `"ma.cle": "English text"` dans `js/i18n.js`.
- **Projets** : ajouter un bloc `en: { description: "…" }` au projet dans `data/projects.js`
  (champs possibles : `title`, `description`, `imageAlt`, `year`, `tags`).
- **Photos du haut de page** : attribut `data-caption-en` pour la légende anglaise.

---

## Changer les photos du haut de page

Les photos sont dans `assets/photos/` (WebP, format portrait 4:5, idéalement 640 × 800 px). Pour en ajouter une,
copier un bloc `<figure class="deck__card">` dans `index.html`, puis modifier le nom du fichier, la légende
(`data-caption`) et le texte alternatif (`alt`). Le compteur et la navigation s'adaptent automatiquement.

---

## Publier une modification (important)

Après chaque modification, lancer **une seule commande** avant le commit :

```bash
./scripts/bump-version.sh
```

Elle change le numéro de version partout (les 4 pages et `version.json`). Résultat :

- les fichiers CSS et JavaScript sont retéléchargés (leur adresse contient le numéro de version) ;
- la page elle-même vérifie à chaque visite `version.json` : si une version plus récente est en ligne,
  elle se recharge automatiquement une fois. Plus besoin de vider le cache ni de faire Ctrl + Maj + R.

---

## Image de partage et référencement

- **Image de partage** (`assets/og-image.jpg`, 1200 × 630) : c'est l'aperçu affiché sur LinkedIn, Slack, WhatsApp…
  Pour la modifier : changer `scripts/og-image/og.html`, puis `npm install` et `npm run og-image`
  (régénère aussi les icônes). Vérifier l'aperçu avec le
  [Post Inspector de LinkedIn](https://www.linkedin.com/post-inspector/).
- **Google** : déclarer `https://firas-bouricha.github.io/firas_bouricha/sitemap.xml` dans
  [Google Search Console](https://search.google.com/search-console). Le `robots.txt` n'est lu qu'à la racine d'un
  domaine : il ne servira qu'avec un nom de domaine personnel.

---

## Sécurité (CSP)

Toutes les pages (et `404.html`) contiennent une politique de sécurité du contenu (balise `Content-Security-Policy`) :
seuls les fichiers du site peuvent s'exécuter. Les petits scripts écrits directement dans `<head>` sont autorisés
par leur empreinte SHA-256. **Si l'un d'eux est modifié**, le test `CSP` échoue et indique qu'il faut recalculer son
empreinte :

```bash
node -e "const c=require('crypto'),s=require('fs').readFileSync('index.html','utf8');for(const m of s.matchAll(/<script>([\s\S]*?)<\/script>/g))console.log(\"'sha256-\"+c.createHash('sha256').update(m[1]).digest('base64')+\"'\")"
```

---

## Tests automatiques

Chaque PR est vérifiée par GitHub Actions (`.github/workflows/ci.yml`). Pour lancer les mêmes vérifications en local
(Node.js 22 requis) :

```bash
npm install
npx playwright install chromium   # une seule fois
npm run lint                       # JavaScript : variables non définies, code mort
npm test                           # 95 tests (4 pages)
```

| Fichier | Ce qui est vérifié |
|---------|--------------------|
| `smoke.spec.js` | 4 pages × 6 largeurs × 2 thèmes : aucune erreur, aucun débordement, menu dans l'écran, un seul titre `h1` |
| `a11y.spec.js` | Accessibilité WCAG 2.1 AA (axe-core) en thème sombre et clair, ordinateur et mobile |
| `terminal.spec.js` | Commandes, complétion, historique, langue, thème, sécurité de l'affichage |
| `features.spec.js` | Menu et liens entre pages, palette ⌘K, thème, filtres, photos, frise, menu mobile, copie de l'e-mail |
| `i18n.spec.js` | Toutes les traductions présentes, bouton FR / EN, lien `?lang=en` |
| `seo-securite.spec.js` | CSP, blocs communs synchronisés, version, fichiers référencés, titres et partage de chaque page, sitemap, page 404 |
| `perf.spec.js` | Poids < 900 Ko, aucune ressource externe, polices locales, affichage sans JavaScript |

`npm run serve` sert le site comme GitHub Pages : http://127.0.0.1:4173/firas_bouricha/

---

## Tester en local

Ouvrir directement `index.html` dans un navigateur suffit pour un aperçu. Pour un rendu identique à GitHub Pages :

```bash
python3 -m http.server 8000
# puis ouvrir http://localhost:8000
```

---

## Contact

- ✉️ firas.bouricha@outlook.fr
- 💼 [linkedin.com/in/firas-bouricha](https://www.linkedin.com/in/firas-bouricha/)
- 🐙 [github.com/firas-bouricha](https://github.com/firas-bouricha)
