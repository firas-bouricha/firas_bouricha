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
├── data/
│   └── projects.js     # ⭐ La liste des projets : c'est ici qu'on en ajoute
├── css/
│   └── style.css       # Le design (couleurs, mise en page, responsive)
├── js/
│   └── main.js         # Cartes projets, filtres, menu, thème, palette ⌘K, animations
└── assets/
    ├── icons/          # Logos des technologies (devicon MIT, Simple Icons CC0)
    ├── photos/         # Photos du haut de page (visionneuse cliquable)
    └── projects/       # Images des projets (photos, captures d'écran)
```

Fonctionnalités : thème clair / sombre (mémorisé), palette de commandes (`Ctrl` + `K` ou `⌘` + `K`),
filtres de projets, parcours interactif façon `git log`, éditeur de code à onglets dans la section Profil.

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

## Changer les photos du haut de page

Les photos sont dans `assets/photos/` (format portrait 4:5, idéalement 640 × 800 px). Pour en ajouter une,
copier un bloc `<figure class="deck__card">` dans `index.html`, puis modifier le nom du fichier, la légende
(`data-caption`) et le texte alternatif (`alt`). Le compteur et la navigation s'adaptent automatiquement.

---

## Publier une modification du design (important)

Les navigateurs gardent le CSS et le JavaScript en cache pendant environ 10 minutes. Si la page HTML est à jour
mais que l'ancien CSS est encore en cache, l'affichage peut se casser.

Pour l'éviter, dans `index.html`, **changez le numéro de version** `?v=...` des fichiers `css/style.css`,
`data/projects.js` et `js/main.js` à chaque modification de ces fichiers
(par exemple `?v=20261013-7` → `?v=20261020-1`). Les visiteurs téléchargent alors directement la nouvelle version.

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
