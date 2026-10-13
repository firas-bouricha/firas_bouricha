# Portfolio · Firas Bouricha

Site personnel de **Firas Bouricha**, ingénieur Cloud & Infrastructure, disponible pour un CDI.

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
│   └── main.js         # Génération des cartes projets, filtres, menu mobile, animations
└── assets/
    └── firas-bouricha.jpg
```

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
  icon: "server",                        // optionnel
  color: "cyan",                         // optionnel
  category: "Infrastructure",            // optionnel (crée le filtre automatiquement)
  featured: true,                        // optionnel (carte large en haut)
},
```

4. Commit + push. La carte, le filtre de catégorie et les liens « Voir le code » / « Démo en ligne » sont créés
   automatiquement.

| Champ | Valeurs possibles |
|-------|-------------------|
| `icon` | `home`, `server`, `shield`, `layers`, `code`, `git`, `cloud`, `database`, `game`, `terminal`, `network` |
| `color` | `violet`, `cyan`, `emerald`, `amber`, `pink`, `blue`, `red` |

**Conseils pour une bonne description**

- Commencer par le résultat concret : *« Une demande GLPI crée une VM Proxmox automatiquement »*.
- Citer les outils dans les `tags` plutôt que dans la phrase.
- Réserver `featured: true` aux 2 ou 3 projets les plus représentatifs du poste visé.

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
