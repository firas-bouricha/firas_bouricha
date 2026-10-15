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
 *    image        (optionnel)  Photo ou capture d'écran, à déposer dans
 *                              assets/projects/ (ex. "assets/projects/homelab.jpg")
 *    imageAlt     (optionnel)  Description courte de l'image (accessibilité)
 *    icon         (optionnel)  home | server | shield | layers | code | git
 *                              | cloud | database | game | terminal | network
 *    color        (optionnel)  violet | cyan | emerald | amber | pink | blue | red
 *    category     (optionnel)  Catégorie utilisée pour les filtres,
 *                              ex. "Infrastructure", "DevSecOps", "Dev", "Pédagogie"
 *    year         (optionnel)  Année ou période affichée sur la carte, ex. "2026" ou "En cours"
 *    featured     (optionnel)  true pour mettre le projet en avant (carte large)
 *    en           (optionnel)  Version anglaise : { title, description, imageAlt, year, tags }
 *                              (les champs absents reprennent la version française)
 *
 *  L'ordre de la liste est l'ordre d'affichage sur le site.
 * ============================================================
 */
window.PROJECTS = [
  {
    title: "VM as a Service",
    year: "2026",
    description:
      "Une demande GLPI déclenche Ansible (via Semaphore) puis Terraform, qui clone une VM Proxmox depuis un template et remonte son ID et son IP. Zéro intervention manuelle.",
    tags: ["Terraform", "Ansible", "Proxmox", "GLPI", "Semaphore"],
    repo: "firas-bouricha/vm-automation-via-glpi",
    icon: "server",
    color: "cyan",
    category: "Infrastructure",
    featured: true,
    en: {
      description:
        "A GLPI request triggers Ansible (via Semaphore), then Terraform, which clones a Proxmox VM from a template and reports back its ID and IP. Zero manual intervention.",
    },
  },
  {
    title: "Pipeline DevSecOps",
    year: "2026",
    description:
      "Chaîne CI/CD durcie autour d'une API Node.js : protection de branche, hooks Gitleaks, secrets chiffrés SOPS + age, image Docker scannée par Trivy (SBOM), CodeQL et déploiement conditionnel.",
    tags: ["GitHub Actions", "Docker", "Trivy", "CodeQL", "SOPS"],
    repo: "firas-bouricha/Projet-_final_DevSecOps",
    image: "assets/projects/devsecops-pipeline.png",
    imageAlt: "Exécution réussie du pipeline CI/CD : tests, Gitleaks, CodeQL, scan d'image, publication et déploiements",
    icon: "shield",
    color: "emerald",
    category: "DevSecOps",
    featured: true,
    en: {
      title: "DevSecOps pipeline",
      description:
        "Hardened CI/CD chain around a Node.js API: branch protection, Gitleaks hooks, secrets encrypted with SOPS + age, Docker image scanned by Trivy (SBOM), CodeQL and conditional deployment.",
      imageAlt: "Successful CI/CD pipeline run: tests, Gitleaks, CodeQL, image scan, publish and deployments",
    },
  },
  {
    title: "Home Lab",
    year: "En cours",
    description:
      "Mon infrastructure auto-hébergée : serveur Dell PowerEdge sous Proxmox, iDRAC, switch Cisco SG300. Architecture, inventaire et documentation technique.",
    tags: ["Proxmox", "Linux", "Réseau", "Cisco"],
    repo: "firas-bouricha/Home_Lab",
    image: "assets/projects/homelab.jpg",
    imageAlt: "Le home lab : serveur Dell PowerEdge T130, Dell OptiPlex et switch Cisco SG300",
    icon: "home",
    color: "violet",
    category: "Infrastructure",
    featured: true,
    en: {
      year: "Ongoing",
      description:
        "My self-hosted infrastructure: a Dell PowerEdge server running Proxmox, iDRAC and a Cisco SG300 switch. Architecture, inventory and technical documentation.",
      imageAlt: "The home lab: Dell PowerEdge T130 server, Dell OptiPlex and Cisco SG300 switch",
      tags: ["Proxmox", "Linux", "Networking", "Cisco"],
    },
  },
  {
    title: "IaC Multi-VMs",
    year: "2026",
    description:
      "Provisionnement d'une infrastructure complète (bastion, web, base de données, Zabbix) avec OpenTofu et Cloud-Init, puis durcissement SSH, pare-feu nftables et supervision via Ansible.",
    tags: ["OpenTofu", "Cloud-Init", "Ansible", "nftables", "Zabbix"],
    repo: "firas-bouricha/Infrastructure-as-Code-Automatisation-Multi-VMs",
    icon: "layers",
    color: "amber",
    category: "Infrastructure",
    en: {
      description:
        "Provisioning of a complete infrastructure (bastion, web, database, Zabbix) with OpenTofu and Cloud-Init, then SSH hardening, nftables firewall and monitoring with Ansible.",
    },
  },
  {
    title: "Ytasty Crousty",
    year: "2026",
    description:
      "Application fullstack conteneurisée, de la commande client au pilotage de la direction. Gestion de projet Jira, modélisation MCD et environnement Docker Compose.",
    tags: ["FastAPI", "React", "PostgreSQL", "Docker"],
    repo: "firas-bouricha/ytasty-crousty",
    icon: "database",
    color: "pink",
    category: "Dev",
    en: {
      description:
        "Containerised full-stack application, from customer ordering to management dashboards. Jira project management, data modelling and a Docker Compose environment.",
    },
  },
  {
    title: "CyberCrise",
    year: "2026",
    description:
      "Jeu de révision web pour le Master : quiz arcade, examen blanc chronométré et mode aventure 2D. 160 questions sur le pilotage de la maintenance du SI.",
    tags: ["JavaScript", "HTML/CSS", "GitHub Pages"],
    repo: "firas-bouricha/Pilotage_Maintenance_SI",
    demo: "https://firas-bouricha.github.io/Pilotage_Maintenance_SI/",
    icon: "game",
    color: "red",
    category: "Dev",
    en: {
      description:
        "A web-based revision game for my Master's: arcade quiz, timed mock exam and 2D adventure mode. 160 questions on IS maintenance management.",
    },
  },
  {
    title: "Git avancé",
    year: "2025",
    description:
      "Cours, TP guidés et projet final en Go que j'ai conçus pour accompagner les étudiants de Bachelor 1 à Ynov Sophia Antipolis.",
    tags: ["Git", "Go", "Pédagogie"],
    repo: "firas-bouricha/ynov-git-avance--fr",
    icon: "git",
    color: "blue",
    category: "Pédagogie",
    en: {
      title: "Advanced Git",
      description:
        "Courses, guided labs and a final project in Go that I designed to support first-year Bachelor students at Ynov Sophia Antipolis.",
      tags: ["Git", "Go", "Teaching"],
    },
  },
];
