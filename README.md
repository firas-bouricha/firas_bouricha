# Portfolio · Firas Bouricha

Site personnel de **Firas Bouricha**, ingénieur Cloud & Infrastructure.

🔗 **En ligne :** https://firas-bouricha.github.io/firas_bouricha/

Le design reprend l'identité de mon [profil GitHub](https://github.com/firas-bouricha) : fond sombre, accent violet,
typographies Space Grotesk et JetBrains Mono, et clins d'œil au terminal (`$ cat about.md`, `$ ls ~/projets`…).

---

## Structure du projet

```
.
├── index.html          # Toute la page (profil, compétences, parcours, contact)
├── version.json        # Numéro de version en ligne (mise à jour automatique des visiteurs)
├── scripts/
│   └── bump-version.sh # Change le numéro de version avant une publication
├── data/
│   ├── projects.js     # ⭐ La liste des projets : c'est ici qu'on en ajoute
│   └── terminal.js     # Textes du terminal (fichier caché .mystere, whoami)
├── css/
│   └── style.css       # Le design (couleurs, mise en page, responsive)
├── js/
│   ├── i18n.js         # Traductions anglaises (bouton FR / EN)
│   ├── vendor/lenis.min.js  # Défilement doux (Lenis, licence MIT)
│   └── main.js         # Cartes projets, filtres, menu, thème, palette ⌘K, animations
└── assets/
    ├── icons/          # Logos des technologies (devicon MIT, Simple Icons CC0)
    ├── photos/         # Photos du haut de page (visionneuse cliquable)
    └── projects/       # Images des projets (photos, captures d'écran)
```

Fonctionnalités : site bilingue FR / EN (français par défaut), défilement doux avec inertie, thème clair / sombre (mémorisé), palette de commandes (`Ctrl` + `K` ou `⌘` + `K`),
filtres de projets, parcours interactif façon `git log`, éditeur de code à onglets et vrai terminal dans la section Profil.

Le site est 100 % statique : aucun framework, aucune étape de build. Il suffit de pousser sur la branche publiée
par GitHub Pages pour le mettre à jour.

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

1. Déposer la photo ou la capture d'écran dans `assets/projects/` (format `.jpg` ou `.png`, idéalement moins de
   200 Ko et environ 900 à 1500 px de large).
2. Renseigner `image` (le chemin du fichier) et `imageAlt` (une phrase qui décrit l'image).

Sur une carte mise en avant (`featured: true`), l'image s'affiche à gauche du texte ; sur une carte normale, en haut.

**Conseils pour une bonne description**

- Commencer par le résultat concret : *« Une demande GLPI crée une VM Proxmox automatiquement »*.
- Citer les outils dans les `tags` plutôt que dans la phrase.
- Réserver `featured: true` aux 2 ou 3 projets les plus représentatifs du poste visé.
- Au-delà de 4 technologies, les suivantes sont regroupées dans un bouton « +N » : mettre les plus importantes en premier.

---

## Ajouter une compétence

Dans `index.html`, section « Compétences », copier une ligne `<li class="tech">` dans la bonne catégorie et changer
le logo (`assets/icons/…`) et le nom. Les logos officiels en couleur se trouvent sur
[devicon.dev](https://devicon.dev) (fichier `*-original.svg`).

---

## Le terminal (`firas@Portfolio`)

L'onglet **`>_ terminal`** de la section Profil est un petit shell simulé. On l'ouvre aussi depuis la palette
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

Le français est la langue par défaut : il est écrit directement dans `index.html`. Le bouton **FR / EN** du menu
bascule la langue et mémorise le choix. Un lien direct vers la version anglaise :
`https://firas-bouricha.github.io/firas_bouricha/?lang=en` (pratique pour une candidature en anglais).

- **Modifier une traduction** : changer la phrase anglaise dans `js/i18n.js`.
- **Traduire un nouveau texte** : ajouter `data-i18n="ma.cle"` sur l'élément dans `index.html`
  (ou `data-i18n-attr="aria-label:ma.cle"` pour un attribut), puis `"ma.cle": "English text"` dans `js/i18n.js`.
- **Projets** : ajouter un bloc `en: { description: "…" }` au projet dans `data/projects.js`
  (champs possibles : `title`, `description`, `imageAlt`, `year`, `tags`).
- **Photos du haut de page** : attribut `data-caption-en` pour la légende anglaise.

---

## Changer les photos du haut de page

Les photos sont dans `assets/photos/` (format portrait 4:5, idéalement 640 × 800 px). Pour en ajouter une,
copier un bloc `<figure class="deck__card">` dans `index.html`, puis modifier le nom du fichier, la légende
(`data-caption`) et le texte alternatif (`alt`). Le compteur et la navigation s'adaptent automatiquement.

---

## Publier une modification (important)

Après chaque modification, lancer **une seule commande** avant le commit :

```bash
./scripts/bump-version.sh
```

Elle change le numéro de version partout (`index.html` et `version.json`). Résultat :

- les fichiers CSS et JavaScript sont retéléchargés (leur adresse contient le numéro de version) ;
- la page elle-même vérifie à chaque visite `version.json` : si une version plus récente est en ligne,
  elle se recharge automatiquement une fois. Plus besoin de vider le cache ni de faire Ctrl + Maj + R.

---

## Tester en local

Ouvrir directement `index.html` dans un navigateur suffit. Pour un rendu identique à GitHub Pages :

```bash
python3 -m http.server 8000
# puis ouvrir http://localhost:8000
```

---

## Contact

- ✉️ firas.bouricha@outlook.fr
- 💼 [linkedin.com/in/firas-bouricha](https://www.linkedin.com/in/firas-bouricha/)
- 🐙 [github.com/firas-bouricha](https://github.com/firas-bouricha)
