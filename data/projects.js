/*
 * ============================================================
 *  MES PROJETS
 * ============================================================
 *  Pour ajouter un projet : copie un bloc { ... }, colle-le
 *  dans la liste, puis modifie les valeurs. C'est tout :
 *  la carte, les filtres et les liens se créent tout seuls.
 *
 *  Champs disponibles :
 *    title        (obligatoire) Nom affiché du projet
 *    description  (obligatoire) 1 à 2 phrases : le problème résolu et le résultat
 *    tags         (obligatoire) Technologies utilisées, ex. ["Terraform", "Proxmox"]
 *    repo         (optionnel)  Dépôt GitHub au format "utilisateur/depot"
 *    demo         (optionnel)  Lien vers une démo en ligne
 *    icon         (optionnel)  home | server | shield | layers | code | git
 *                              | cloud | database | game | terminal | network
 *    color        (optionnel)  violet | cyan | emerald | amber | pink | blue | red
 *    category     (optionnel)  Catégorie utilisée pour les filtres,
 *                              ex. "Infrastructure", "DevSecOps", "Dev", "Pédagogie"
 *    featured     (optionnel)  true pour mettre le projet en avant (carte large)
 *
 *  L'ordre de la liste est l'ordre d'affichage sur le site.
 * ============================================================
 */
window.PROJECTS = [
  {
    title: "VM as a Service",
    description:
      "Une demande GLPI déclenche Ansible (via Semaphore) puis Terraform, qui clone une VM Proxmox depuis un template et remonte son ID et son IP. Zéro intervention manuelle.",
    tags: ["Terraform", "Ansible", "Proxmox", "GLPI", "Semaphore"],
    repo: "firas-bouricha/vm-automation-via-glpi",
    icon: "server",
    color: "cyan",
    category: "Infrastructure",
    featured: true,
  },
  {
    title: "Pipeline DevSecOps",
    description:
      "Chaîne CI/CD durcie autour d'une API Node.js : protection de branche, hooks Gitleaks, secrets chiffrés SOPS + age, image Docker scannée par Trivy (SBOM), CodeQL et déploiement conditionnel.",
    tags: ["GitHub Actions", "Docker", "Trivy", "CodeQL", "SOPS"],
    repo: "firas-bouricha/Projet-_final_DevSecOps",
    icon: "shield",
    color: "emerald",
    category: "DevSecOps",
    featured: true,
  },
  {
    title: "IaC Multi-VMs",
    description:
      "Provisionnement d'une infrastructure complète (bastion, web, base de données, Zabbix) avec OpenTofu et Cloud-Init, puis durcissement SSH, pare-feu nftables et supervision via Ansible.",
    tags: ["OpenTofu", "Cloud-Init", "Ansible", "nftables", "Zabbix"],
    repo: "firas-bouricha/Infrastructure-as-Code-Automatisation-Multi-VMs",
    icon: "layers",
    color: "amber",
    category: "Infrastructure",
  },
  {
    title: "Home Lab",
    description:
      "Mon infrastructure auto-hébergée : serveur Dell PowerEdge sous Proxmox, iDRAC, switch Cisco SG300. Architecture, inventaire et documentation technique.",
    tags: ["Proxmox", "Linux", "Réseau", "Cisco"],
    repo: "firas-bouricha/Home_Lab",
    icon: "home",
    color: "violet",
    category: "Infrastructure",
  },
  {
    title: "Ytasty Crousty",
    description:
      "Application fullstack conteneurisée, de la commande client au pilotage de la direction. Gestion de projet Jira, modélisation MCD et environnement Docker Compose.",
    tags: ["FastAPI", "React", "PostgreSQL", "Docker"],
    repo: "firas-bouricha/ytasty-crousty",
    icon: "database",
    color: "pink",
    category: "Dev",
  },
  {
    title: "CyberCrise",
    description:
      "Jeu de révision web pour le Master : quiz arcade, examen blanc chronométré et mode aventure 2D. 160 questions sur le pilotage de la maintenance du SI.",
    tags: ["JavaScript", "HTML/CSS", "GitHub Pages"],
    repo: "firas-bouricha/Pilotage_Maintenance_SI",
    demo: "https://firas-bouricha.github.io/Pilotage_Maintenance_SI/",
    icon: "game",
    color: "red",
    category: "Dev",
  },
  {
    title: "Git avancé",
    description:
      "Cours, TP guidés et projet final en Go que j'ai conçus pour accompagner les étudiants de Bachelor 1 à Ynov Sophia Antipolis.",
    tags: ["Git", "Go", "Pédagogie"],
    repo: "firas-bouricha/ynov-git-avance--fr",
    icon: "git",
    color: "blue",
    category: "Pédagogie",
  },
];
