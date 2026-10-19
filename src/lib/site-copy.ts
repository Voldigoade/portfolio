export type Locale = "fr" | "en";

export interface NavCopy {
  brand: string;
  items: Array<{ href: string; label: string }>;
  openMenu: string;
  closeMenu: string;
  signIn: string;
}

export interface FooterCopy {
  copyright: string;
  source: string;
  githubAria: string;
  projectsAria: string;
  blogAria: string;
  links: Array<{ href: string; label: string }>;
}

export interface HeroCopy {
  workspace: string;
  greeting: string;
  tagline: string;
  projectsCta: string;
  blogCta: string;
}

export interface HomeCopy {
  hero: HeroCopy;
  quickFocus: {
    title: string;
    items: Array<{ title: string; text: string }>;
  };
  workflow: {
    title: string;
    steps: Array<{ title: string; description: string }>;
  };
  domains: {
    title: string;
    viewAll: string;
    items: Array<{
      title: string;
      summary: string;
      bullets: string[];
      href: string;
    }>;
  };
  featuredProjects: {
    title: string;
    viewAll: string;
  };
  recentWriting: {
    title: string;
    viewAll: string;
    emptyText: string;
  };
  githubOverview: {
    title: string;
    profileCta: string;
    subtitle: string;
    activityTitle: string;
    activitySubtitle: string;
    reposTitle: string;
    reposSubtitle: string;
    followers: string;
    following: string;
    repos: string;
    stars: string;
    forks: string;
    watchers: string;
  };
  matrix: {
    title: string;
    subtitle: string;
    directionTitle: string;
    contextTitle: string;
    contextSubtitle: string;
    tabRust: string;
    tabResearch: string;
    tabPortfolio: string;
    stack: Array<{ title: string; body: string }>;
    snippets: {
      next: string;
      query: string;
      store: string;
    };
    flipCards: Array<{ front: string; back: string }>;
  };
  morph: {
    title: string;
    prefix: string;
    words: string[];
    p1: string;
    p2: string;
  };
  terminal: {
    title: string;
    cardTitle: string;
    p1: string;
    p2: string;
    p3: string;
    docLink: string;
    resultsTitle: string;
    cards: Array<{ title: string; text: string }>;
    meta: {
      tool: string;
      command: string;
      target: string;
      sha: string;
      date: string;
    };
  };
  faq: {
    title: string;
    items: Array<{
      question: string;
      answer: string;
      ctaHref?: string;
      ctaLabel?: string;
    }>;
  };
}

export interface AboutCopy {
  title: string;
  intro: string[];
  projectsCta: string;
  blogCta: string;
  focusTitle: string;
  focusItems: Array<{ title: string; text: string }>;
  stackTitle: string;
  stackItems: Array<{ title: string; detail: string }>;
  currentWorkTitle: string;
  currentWorkItems: Array<{ title: string; text: string; href: string }>;
  reposTitle: string;
  reposCta: string;
}

export interface ProjectsCopy {
  title: string;
  description: string;
  indexTitle: string;
  indexDescription: string;
  searchPlaceholder: string;
  searchAria: string;
  sortAria: string;
  sortRecent: string;
  sortStarsDesc: string;
  sortStarsAsc: string;
  sortNameAsc: string;
  emptyState: string;
  errorState: string;
  noDescription: string;
  openSourceBadge: string;
  viewRepo: string;
}

export interface BlogCopy {
  title: string;
  description: string;
  searchPlaceholder: string;
  allFilter: string;
  emptyHeading: string;
  emptyDescription: string;
  readTime: (mins: number) => string;
  readArticle: string;
  rssTitle: string;
}

export interface NotFoundCopy {
  badge: string;
  title: string;
  description: string;
  homeButton: string;
  projectsButton: string;
}

export interface PrivacyCopy {
  title: string;
  intro: string;
  sections: Array<{
    title: string;
    content: string[];
  }>;
}

export interface SiteCopy {
  nav: NavCopy;
  footer: FooterCopy;
  home: HomeCopy;
  about: AboutCopy;
  projects: ProjectsCopy;
  blog: BlogCopy;
  privacy: PrivacyCopy;
  notFound: NotFoundCopy;
}

export const copyFr: SiteCopy = {
  nav: {
    brand: "~/ Voldigoade",
    items: [
      { href: "/", label: "Accueil" },
      { href: "/about", label: "À propos" },
      { href: "/project", label: "Projets" },
      { href: "/blog", label: "Blog" },
    ],
    openMenu: "Ouvrir le menu",
    closeMenu: "Fermer le menu",
    signIn: "GitHub",
  },
  footer: {
    copyright: "Voldigoade",
    source: "Source",
    githubAria: "Profil GitHub de Voldigoade",
    projectsAria: "Explorer les projets",
    blogAria: "Lire le blog",
    links: [
      { href: "/robots.txt", label: "Robots" },
      { href: "/sitemap.xml", label: "Plan du site" },
      { href: "/rss.xml", label: "RSS" },
      { href: "/privacy-policy", label: "Confidentialité" },
    ],
  },
  home: {
    hero: {
      workspace: "workspace://voldigoade",
      greeting: "BONJOUR, JE SUIS",
      tagline:
        "Rust, CLI, OSINT, privacy, systems. Je développe des tools, je teste des idées et je documente ce qui marche.",
      projectsCta: "Voir les projets",
      blogCta: "Voir le blog",
    },
    quickFocus: {
      title: "Focus technique",
      items: [
        {
          title: "Rust & CLI",
          text: "Écrire des CLI rapides en Rust, avec typage strict et gestion propre des erreurs.",
        },
        {
          title: "OSINT & Footprint",
          text: "Analyser ce que des API et des métadonnées publiques exposent réellement en pratique.",
        },
        {
          title: "Firmware & Rootfs",
          text: "Comparer des rootfs de firmware extraits, repérer les diffs et sortir des rapports clairs.",
        },
        {
          title: "Local-First & Privacy",
          text: "Préférer le traitement en local, sans télémétrie invasive ni dépendance inutile au cloud.",
        },
      ],
    },
    workflow: {
      title: "Workflow",
      steps: [
        {
          title: "Cadrer",
          description:
            "Partir d'un besoin précis : un parser, un diff d'arbre rootfs ou un audit de repo. Pas d'architecture inutile.",
        },
        {
          title: "Inspecter",
          description:
            "Lire les RFC, le code source amont et les traces réseau. Tester les hypothèses avec des tests reproductibles.",
        },
        {
          title: "Coder",
          description:
            "Écrire du Rust typé et sans fioritures. Gérer les erreurs proprement et minimiser les dépendances externes.",
        },
        {
          title: "Documenter",
          description:
            "Publier le code sur GitHub, lister ce qui marche, ce qui plante et les limites connues.",
        },
      ],
    },
    domains: {
      title: "Projets & Travaux",
      viewAll: "Tous les projets",
      items: [
        {
          title: "Spoor",
          summary:
            "CLI Rust pour voir ce qu'un compte ou un repo GitHub expose publiquement : commits, clés et métadonnées.",
          bullets: [
            "Implémentation CLI et service HTTP en Rust",
            "Suivi de progression et cache SQLite local",
            "Exports JSON et rapports structurés",
          ],
          href: "https://github.com/Voldigoade/spoor",
        },
        {
          title: "Crucksware",
          summary:
            "Prototype Rust pour comparer deux rootfs de firmware extraits et sortir un rapport texte ou JSON.",
          bullets: [
            "Diff sémantique de dossiers rootfs Linux",
            "Sortie déterministe en texte et JSON",
            "Projet expérimental en cours de dev",
          ],
          href: "https://github.com/Voldigoade/crucksware",
        },
        {
          title: "Recherche Messageries",
          summary:
            "Comparatif sourcé d'applications de messagerie sécurisée : Signal, SimpleX, Session, Olvid, Threema, Briar.",
          bullets: [
            "Analyse selon les threat models",
            "Exposition des métadonnées réseau",
            "Références primaires et audits publics",
          ],
          href: "https://github.com/Voldigoade/recherche-messageries",
        },
      ],
    },
    featuredProjects: {
      title: "Projets en vedette",
      viewAll: "Voir tous les projets",
    },
    recentWriting: {
      title: "Dernières publications",
      viewAll: "Voir tout le blog",
      emptyText:
        "Aucun article publié pour le moment. Les prochains write-ups seront disponibles ici.",
    },
    githubOverview: {
      title: "Activité GitHub",
      profileCta: "Profil GitHub",
      subtitle: "Métadonnées publiques récupérées depuis l'API GitHub.",
      activityTitle: "Activité GitHub publique",
      activitySubtitle:
        "Données publiques agrégées sur les dépôts sélectionnés.",
      reposTitle: "Dépôts publics",
      reposSubtitle: "Sélection de projets open source et dépôts de recherche.",
      followers: "Abonnés",
      following: "Abonnements",
      repos: "Dépôts",
      stars: "Étoiles",
      forks: "Forks",
      watchers: "Suivis",
    },
    matrix: {
      title: "Stack & Outils",
      subtitle: "Aperçu des technologies et des dépôts du portfolio.",
      directionTitle: "Axes techniques",
      contextTitle: "Contexte des projets",
      contextSubtitle:
        "Les détails d'implémentation vivent directement dans le code source.",
      tabRust: "Rust Tooling",
      tabResearch: "Recherche",
      tabPortfolio: "Portfolio",
      stack: [
        {
          title: "Spoor",
          body: "Inspection d'empreinte publique GitHub en Rust : profils, repos, commits et clés.",
        },
        {
          title: "Crucksware",
          body: "Diff sémantique de deux rootfs de firmware en Rust, avec reports texte et JSON.",
        },
        {
          title: "Messageries",
          body: "Comparatif sourcé des messageries chiffrées selon les threat models et les métadonnées.",
        },
      ],
      snippets: {
        next: `// Spoor: inspection GitHub en Rust\nCLI + service HTTP\nProfils, repos, commits, identités et clés\nDonnées observées et limites d'inférence`,
        query: `// Crucksware: triage firmware en Rust\nDiff d'arbres rootfs extraits\nRapports déterministes texte et JSON\nProjet expérimental sans release`,
        store: `// Portfolio Voldigoade\nNext.js + React + TypeScript + Bun\nBilingue FR/EN, zéro cookie, analytics Cloudflare\nComposants rétro, thèmes sombre et clair`,
      },
      flipCards: [
        {
          front: "Rigueur",
          back: "Citer les sources primaires et séparer faits observés et déductions.",
        },
        {
          front: "Pragmatisme",
          back: "Développer des tools ciblés sans complexité inutile ni frameworks lourds.",
        },
        {
          front: "Local-first",
          back: "Traiter les données en local et expliciter ce qui part sur le réseau.",
        },
      ],
    },
    morph: {
      title: "Du code aux outils",
      prefix: "L'objectif :",
      words: ["Construire", "Inspecter", "Tester", "Explorer", "Comparer"],
      p1: "J'explore les systèmes et la privacy avec des tools en Rust et des comparatifs sourcés. Les repos publics détaillent les choix d'implémentation et les limites réelles de chaque tool.",
      p2: "Le code est sur GitHub, les write-ups sont ici. Ce qui est expérimental ou en cours est documenté tel quel, sans prétention.",
    },
    terminal: {
      title: "Spoor Demo",
      cardTitle: "Exécution réelle de Spoor",
      p1: "Spoor inspecte les métadonnées publiques d'un compte ou d'un repo GitHub (commits, clés, signatures).",
      p2: "Le terminal ci-contre rejoue une capture déterministe réelle de la commande `spoor repo Voldigoade/spoor` exécutée avec le binaire Rust.",
      p3: "Aucune simulation inventée ni fausse commande : les données correspondent aux identités réelles de commit et au scan public.",
      docLink: "Documentation Spoor sur GitHub",
      resultsTitle: "Comprendre les sorties",
      cards: [
        {
          title: "Données observées",
          text: "Faits bruts extraits des commits publics (identités de commits, adresses noreply, signatures vérifiées).",
        },
        {
          title: "Valeurs dérivées",
          text: "Métriques agrégées (nombre de commits, langages détectés, volumétrie) calculées directement sur le sample scanné.",
        },
        {
          title: "Limites & Quotas",
          text: "Les résultats dépendent des quotas de l'API GitHub et de la profondeur de scan configurée.",
        },
      ],
      meta: {
        tool: "Spoor CLI",
        command: "spoor repo Voldigoade/spoor",
        target: "Voldigoade/spoor",
        sha: "7d49428a88b86204b23ae509b0be954d9c41110b",
        date: "2026-10-18 23:38:13 UTC",
      },
    },
    faq: {
      title: "FAQ",
      items: [
        {
          question: "Sur quoi tu bosses ?",
          answer:
            "Principalement sur des CLI en Rust (Spoor, Crucksware) et des études comparatives sur les messageries sécurisées. Tout est documenté avec les limites réelles de chaque projet.",
        },
        {
          question: "C'est quoi Spoor ?",
          answer:
            "Un CLI en Rust pour auditer ce qu'un profil ou repo GitHub expose publiquement : identités de commits, clés SSH/GPG et exports structurés.",
          ctaHref: "https://github.com/Voldigoade/spoor",
          ctaLabel: "Voir Spoor",
        },
        {
          question: "C'est quoi Crucksware ?",
          answer:
            "Un prototype en Rust pour comparer deux rootfs de firmware extraits et générer un rapport de diff en texte ou JSON. Projet expérimental.",
          ctaHref: "https://github.com/Voldigoade/crucksware",
          ctaLabel: "Voir Crucksware",
        },
        {
          question: "Quelle est ta stack ?",
          answer:
            "Rust pour les CLI et le bas niveau, Python pour les scripts et l'analyse de données, TypeScript / Next.js pour le web.",
        },
        {
          question: "Les projets sont-ils open source ?",
          answer:
            "Oui, les projets publics sont sous licence open source (généralement MIT ou Apache 2.0). Tout le code est accessible sur GitHub.",
          ctaHref: "https://github.com/Voldigoade",
          ctaLabel: "Profil GitHub",
        },
        {
          question: "Où trouver les write-ups ?",
          answer:
            "La section Blog regroupe des notes techniques, des analyses d'outils et des retours d'expérience en français et en anglais.",
          ctaHref: "/blog",
          ctaLabel: "Lire le blog",
        },
      ],
    },
  },
  about: {
    title: "À propos",
    intro: [
      "Je travaille surtout sur des CLI et du tooling autour de Rust, OSINT, privacy et systèmes. J'aime comprendre comment un tool se comporte vraiment, où sont ses limites et ce qu'on peut vérifier. Le code est sur GitHub, les write-ups sont ici.",
    ],
    projectsCta: "Voir les projets",
    blogCta: "Lire le blog",
    focusTitle: "Focus",
    focusItems: [
      {
        title: "Rust / CLI",
        text: "Développement d'outils en ligne de commande : typage strict, gestion d'erreurs robuste et performance.",
      },
      {
        title: "OSINT / Privacy",
        text: "Inspection d'empreinte publique, analyse des métadonnées exposées et études de protocoles chiffrés.",
      },
      {
        title: "Firmware / Reverse",
        text: "Diff sémantique de rootfs de firmware extraits, inspection d'arbres de fichiers et extraction d'artefacts.",
      },
      {
        title: "Local-First",
        text: "Outils autonomes s'exécutant en local, sans dépendance continue à des services cloud tiers.",
      },
    ],
    stackTitle: "Stack & Environnement",
    stackItems: [
      {
        title: "Rust",
        detail: "Langage principal pour les CLI et l'outillage système",
      },
      {
        title: "Linux",
        detail: "Environnement de dev, scripts shell et conteneurs",
      },
      {
        title: "Python",
        detail: "Scripts d'analyse, parsing de données et MkDocs",
      },
      {
        title: "TypeScript & Next.js",
        detail: "Interfaces web légères et statiques",
      },
      {
        title: "SQLite",
        detail: "Stockage local structuré et cache hors-ligne",
      },
      {
        title: "Git & GitHub",
        detail: "Versioning public, CI GitHub Actions et releases",
      },
    ],
    currentWorkTitle: "Projets en cours",
    currentWorkItems: [
      {
        title: "Spoor",
        text: "CLI Rust pour inspecter ce qu'un compte ou un repo GitHub expose publiquement : commits, clés et métadonnées.",
        href: "https://github.com/Voldigoade/spoor",
      },
      {
        title: "Crucksware",
        text: "Prototype Rust pour diff deux rootfs de firmware extraits et sortir un report texte ou JSON. Expérimental.",
        href: "https://github.com/Voldigoade/crucksware",
      },
      {
        title: "Recherche Messageries",
        text: "Comparatif sourcé de messageries sécurisées selon les threat models, métadonnées et audits publics.",
        href: "https://github.com/Voldigoade/recherche-messageries",
      },
    ],
    reposTitle: "Dépôts publics",
    reposCta: "Voir sur GitHub",
  },
  projects: {
    title: "Projets",
    description:
      "Outils open source, CLI en Rust et travaux de recherche publiés par Voldigoade.",
    indexTitle: "Index des Projets",
    indexDescription:
      "Filtrez par tag et accédez directement aux dépôts GitHub correspondants.",
    searchPlaceholder: "Filtrer les projets par nom...",
    searchAria: "Rechercher des projets",
    sortAria: "Trier les projets",
    sortRecent: "Plus récents d'abord",
    sortStarsDesc: "Étoiles : décroissant",
    sortStarsAsc: "Étoiles : croissant",
    sortNameAsc: "Nom : A-Z",
    emptyState: "Aucun projet ne correspond à ces critères.",
    errorState: "Impossible de charger les données des projets actuellement.",
    noDescription: "Pas de description fournie.",
    openSourceBadge: "Open Source",
    viewRepo: "Voir le dépôt",
  },
  blog: {
    title: "Blog",
    description:
      "Notes techniques, write-ups et retours d'expérience sur les systèmes, la sécurité et l'outillage.",
    searchPlaceholder: "Rechercher un article...",
    allFilter: "Tous",
    emptyHeading: "Aucun article publié",
    emptyDescription:
      "Aucun article n'est actuellement publié dans cette section. Les prochains write-ups paraîtront ici.",
    readTime: (mins: number) => `${mins} min de lecture`,
    readArticle: "Lire l'article",
    rssTitle: "Flux RSS",
  },
  privacy: {
    title: "Politique de Confidentialité",
    intro:
      "Cette page détaille le traitement des données techniques, les préférences locales et la mesure d'audience sur voldigoade.xyz.",
    sections: [
      {
        title: "Principes Généraux",
        content: [
          "La consultation de ce portfolio ne requiert aucun compte utilisateur. Le site lui-même ne pratique aucun profilage et n'effectue aucun suivi au niveau individuel.",
          "L'hébergement est assuré par Vercel et le code source est sur GitHub. Comme pour tout service web, les prestataires d'hébergement et de réseau peuvent traiter des métadonnées de requête usuelles (adresses IP, user agents, horodatages) pour la distribution du contenu, la prévention des abus et la sécurité.",
        ],
      },
      {
        title: "Mesure d'Audience (Cloudflare Web Analytics)",
        content: [
          "Ce site utilise exclusivement Cloudflare Web Analytics pour mesurer la fréquentation globale de manière agrégée.",
          "Cette solution fonctionne sans cookies, sans recours au stockage local du navigateur et sans aucune technique d'empreinte numérique (fingerprinting). Aucune donnée à caractère personnel n'est collectée ou transmise à des tiers publicitaires.",
        ],
      },
      {
        title: "Absence de Cookies & Stockage Local (localStorage)",
        content: [
          "Ce site n'émet et ne dépose aucun cookie.",
          "Le stockage local de votre navigateur (localStorage) sert uniquement à mémoriser vos préférences d'affichage : le choix du thème (sombre ou clair) et l'état des filtres de projets. Ces données restent strictement sur votre appareil et ne sont jamais transmises à un serveur.",
        ],
      },
      {
        title: "Sécurité & Signalements",
        content: [
          "Le site est servi en HTTPS avec des en-têtes de sécurité stricts (Content-Security-Policy, interdiction de l'encapsulation en iframe via frame-ancestors 'none', HSTS).",
          "Pour signaler de manière responsable une vulnérabilité de sécurité, utilisez les avis de sécurité GitHub (GitHub Security Advisories) sur https://github.com/Voldigoade.",
        ],
      },
    ],
  },
  notFound: {
    badge: "Erreur 404",
    title: "Page Introuvable",
    description:
      "Cette ressource n'existe pas ou a été déplacée. Utilisez les boutons ci-dessous pour revenir aux sections actives.",
    homeButton: "Retour à l'accueil",
    projectsButton: "Voir les projets",
  },
};

export const copyEn: SiteCopy = {
  nav: {
    brand: "~/ Voldigoade",
    items: [
      { href: "/en", label: "Home" },
      { href: "/en/about", label: "About" },
      { href: "/en/project", label: "Projects" },
      { href: "/en/blog", label: "Blog" },
    ],
    openMenu: "Open menu",
    closeMenu: "Close menu",
    signIn: "GitHub",
  },
  footer: {
    copyright: "Voldigoade",
    source: "Source",
    githubAria: "Voldigoade GitHub profile",
    projectsAria: "Explore projects",
    blogAria: "Read blog",
    links: [
      { href: "/robots.txt", label: "Robots" },
      { href: "/sitemap.xml", label: "Sitemap" },
      { href: "/en/rss.xml", label: "RSS" },
      { href: "/en/privacy-policy", label: "Privacy" },
    ],
  },
  home: {
    hero: {
      workspace: "workspace://voldigoade",
      greeting: "HELLO, I AM",
      tagline:
        "Rust, CLI, OSINT, privacy, systems. I build tools, test ideas and document what actually works.",
      projectsCta: "View projects",
      blogCta: "View blog",
    },
    quickFocus: {
      title: "Technical Focus",
      items: [
        {
          title: "Rust & CLI",
          text: "Building fast CLI tools in Rust with strict typing and clean error handling.",
        },
        {
          title: "OSINT & Footprint",
          text: "Analyzing what public APIs and metadata actually expose in practice.",
        },
        {
          title: "Firmware & Rootfs",
          text: "Comparing extracted firmware rootfs trees, spotting diffs and extracting artifacts.",
        },
        {
          title: "Local-First & Privacy",
          text: "Focusing on local execution, without telemetry or unnecessary cloud dependencies.",
        },
      ],
    },
    workflow: {
      title: "Workflow",
      steps: [
        {
          title: "Scope",
          description:
            "Start from a concrete need: a parser, a rootfs diff, or a repo audit. No over-engineering.",
        },
        {
          title: "Inspect",
          description:
            "Read RFCs, upstream source code and network traces. Test assumptions with reproducible tests.",
        },
        {
          title: "Build",
          description:
            "Write clean, strongly typed Rust. Handle errors explicitly and keep dependencies minimal.",
        },
        {
          title: "Document",
          description:
            "Publish to GitHub, state what works, what fails, and documented limits.",
        },
      ],
    },
    domains: {
      title: "Projects & Research",
      viewAll: "All projects",
      items: [
        {
          title: "Spoor",
          summary:
            "Rust CLI to inspect what a GitHub account or repo exposes publicly: commits, keys, and metadata.",
          bullets: [
            "Rust CLI implementation and HTTP query service",
            "Real-time progress reporting and local SQLite cache",
            "Structured JSON exports and audit summaries",
          ],
          href: "https://github.com/Voldigoade/spoor",
        },
        {
          title: "Crucksware",
          summary:
            "Rust prototype to compare two extracted firmware rootfs directories and output text or JSON reports.",
          bullets: [
            "Semantic diff of Linux rootfs folders",
            "Deterministic text and JSON reports",
            "Experimental project under active dev",
          ],
          href: "https://github.com/Voldigoade/crucksware",
        },
        {
          title: "Messaging Research",
          summary:
            "Source-based comparison of secure messaging apps: Signal, SimpleX, Session, Olvid, Threema, Briar.",
          bullets: [
            "Evaluated against threat models",
            "Network metadata exposure analysis",
            "Primary references and public audits",
          ],
          href: "https://github.com/Voldigoade/recherche-messageries",
        },
      ],
    },
    featuredProjects: {
      title: "Featured Projects",
      viewAll: "View all projects",
    },
    recentWriting: {
      title: "Recent Writing",
      viewAll: "View full blog",
      emptyText:
        "No published articles yet. Upcoming write-ups will appear here.",
    },
    githubOverview: {
      title: "GitHub Activity",
      profileCta: "GitHub Profile",
      subtitle: "Public metadata fetched directly from the GitHub API.",
      activityTitle: "Public GitHub Activity",
      activitySubtitle: "Aggregated public data across curated repositories.",
      reposTitle: "Public Repositories",
      reposSubtitle: "Curated open source projects and research repositories.",
      followers: "Followers",
      following: "Following",
      repos: "Repos",
      stars: "Stars",
      forks: "Forks",
      watchers: "Watchers",
    },
    matrix: {
      title: "Stack & Tools",
      subtitle: "Overview of technologies and repositories in this portfolio.",
      directionTitle: "Project Directions",
      contextTitle: "Tools & Project Context",
      contextSubtitle:
        "Implementation details live directly in the open source code.",
      tabRust: "Rust Tooling",
      tabResearch: "Research",
      tabPortfolio: "Portfolio",
      stack: [
        {
          title: "Spoor",
          body: "Public GitHub footprint inspection in Rust: profiles, repos, commits, and keys.",
        },
        {
          title: "Crucksware",
          body: "Semantic diff of two extracted firmware rootfs trees in Rust with text and JSON reports.",
        },
        {
          title: "Messaging",
          body: "Source-linked comparison of encrypted messengers across threat models and metadata.",
        },
      ],
      snippets: {
        next: `// Spoor: GitHub inspection in Rust\nCLI tool + HTTP service\nProfiles, repositories, commit identities, keys\nObserved data and explicit inference limits`,
        query: `// Crucksware: firmware triage in Rust\nDiff extracted rootfs trees\nDeterministic text and JSON reports\nExperimental project, no releases yet`,
        store: `// Voldigoade Portfolio\nNext.js + React + TypeScript + Bun\nFR/EN bilingual, zero cookies, Cloudflare analytics\nRetro components with light and dark themes`,
      },
      flipCards: [
        {
          front: "Integrity",
          back: "Keep primary sources visible and separate observed facts from inferences.",
        },
        {
          front: "Pragmatism",
          back: "Build focused tools without unnecessary complexity or bloated frameworks.",
        },
        {
          front: "Local-first",
          back: "Process data locally and make any network activity fully transparent.",
        },
      ],
    },
    morph: {
      title: "From Ideas to Tools",
      prefix: "I focus on:",
      words: ["Build", "Inspect", "Test", "Explore", "Compare"],
      p1: "I explore systems and privacy through Rust tools and source-backed research. Public repos show implementation choices and real boundaries for each tool.",
      p2: "Code is on GitHub, write-ups live here. Anything experimental or in progress is documented as-is, without hype.",
    },
    terminal: {
      title: "Spoor Demo",
      cardTitle: "Real Spoor Execution",
      p1: "Spoor inspects public metadata from a GitHub account or repository (commits, keys, signatures).",
      p2: "The terminal below replays a real deterministic capture of `spoor repo Voldigoade/spoor` executed with the Rust binary.",
      p3: "No fabricated output or fake commands: data matches real commit identities and the public scan.",
      docLink: "Spoor documentation on GitHub",
      resultsTitle: "Understanding Results",
      cards: [
        {
          title: "Observed Data",
          text: "Raw facts extracted from public commits (commit identities, noreply emails, verified signatures).",
        },
        {
          title: "Derived Values",
          text: "Aggregated metrics (commit count, detected languages, volume) calculated directly from the scanned sample.",
        },
        {
          title: "Limits & Quotas",
          text: "Results depend on GitHub API rate limits and the configured scan depth.",
        },
      ],
      meta: {
        tool: "Spoor CLI",
        command: "spoor repo Voldigoade/spoor",
        target: "Voldigoade/spoor",
        sha: "7d49428a88b86204b23ae509b0be954d9c41110b",
        date: "2026-10-18 23:38:13 UTC",
      },
    },
    faq: {
      title: "FAQ",
      items: [
        {
          question: "What do you work on?",
          answer:
            "Mostly on Rust CLI tools (Spoor, Crucksware) and comparative research on secure messaging. Everything is documented with the actual limits of each project.",
        },
        {
          question: "What is Spoor?",
          answer:
            "A Rust CLI to inspect public GitHub footprints: commit identities, SSH/GPG keys, and structured exports.",
          ctaHref: "https://github.com/Voldigoade/spoor",
          ctaLabel: "View Spoor",
        },
        {
          question: "What is Crucksware?",
          answer:
            "A Rust prototype to diff two extracted firmware rootfs trees and produce clean text or JSON reports. Experimental work.",
          ctaHref: "https://github.com/Voldigoade/crucksware",
          ctaLabel: "View Crucksware",
        },
        {
          question: "What is your stack?",
          answer:
            "Rust for CLI tools and low-level work, Python for scripting and data analysis, TypeScript / Next.js for the web.",
        },
        {
          question: "Are the projects open source?",
          answer:
            "Yes, public projects are licensed as open source (typically MIT or Apache 2.0). All code is on GitHub.",
          ctaHref: "https://github.com/Voldigoade",
          ctaLabel: "GitHub Profile",
        },
        {
          question: "Where are the write-ups?",
          answer:
            "The Blog section collects technical notes, tool breakdowns, and write-ups in French and English.",
          ctaHref: "/en/blog",
          ctaLabel: "Read blog",
        },
      ],
    },
  },
  about: {
    title: "About",
    intro: [
      "I mostly work on CLI tools around Rust, OSINT, privacy and systems. I like understanding how tools behave in practice, where their limits are, and what can actually be verified. Code is on GitHub; write-ups live here.",
    ],
    projectsCta: "View projects",
    blogCta: "Read blog",
    focusTitle: "Focus",
    focusItems: [
      {
        title: "Rust / CLI",
        text: "Command-line tools: strict typing, robust error handling, and performance.",
      },
      {
        title: "OSINT / Privacy",
        text: "Public footprint inspection, metadata exposure analysis, and encrypted protocol studies.",
      },
      {
        title: "Firmware / Reverse",
        text: "Semantic diffing of extracted firmware rootfs trees, file hierarchy inspection, and artifact extraction.",
      },
      {
        title: "Local-First",
        text: "Standalone tools running locally without constant dependencies on external cloud services.",
      },
    ],
    stackTitle: "Stack & Environment",
    stackItems: [
      {
        title: "Rust",
        detail: "Primary language for CLI tools and systems development",
      },
      {
        title: "Linux",
        detail: "Primary development environment, shell scripting, containers",
      },
      { title: "Python", detail: "Analysis scripts, data parsing, and MkDocs" },
      { title: "TypeScript & Next.js", detail: "Fast, static web interfaces" },
      {
        title: "SQLite",
        detail: "Structured local storage and offline caching",
      },
      {
        title: "Git & GitHub",
        detail: "Public versioning, GitHub Actions CI, and releases",
      },
    ],
    currentWorkTitle: "Current Work",
    currentWorkItems: [
      {
        title: "Spoor",
        text: "Rust CLI to inspect what a GitHub account or repo exposes publicly: commits, keys, and metadata.",
        href: "https://github.com/Voldigoade/spoor",
      },
      {
        title: "Crucksware",
        text: "Rust prototype to diff two extracted firmware rootfs directories and output text or JSON reports. Experimental.",
        href: "https://github.com/Voldigoade/crucksware",
      },
      {
        title: "Messaging Research",
        text: "Source-based comparison of secure messaging apps across threat models, metadata, and public audits.",
        href: "https://github.com/Voldigoade/recherche-messageries",
      },
    ],
    reposTitle: "Public Repositories",
    reposCta: "View on GitHub",
  },
  projects: {
    title: "Projects",
    description:
      "Open source tools, Rust CLIs, and technical research published by Voldigoade.",
    indexTitle: "Project Index",
    indexDescription:
      "Filter by tag and access corresponding GitHub repositories directly.",
    searchPlaceholder: "Filter projects by name...",
    searchAria: "Search projects",
    sortAria: "Sort projects",
    sortRecent: "Most recent first",
    sortStarsDesc: "Stars: descending",
    sortStarsAsc: "Stars: ascending",
    sortNameAsc: "Name: A-Z",
    emptyState: "No projects match the selected criteria.",
    errorState: "Unable to load repository data at this time.",
    noDescription: "No description provided.",
    openSourceBadge: "Open Source",
    viewRepo: "View repository",
  },
  blog: {
    title: "Blog",
    description:
      "Technical notes, write-ups, and project logs covering systems, security, and tooling.",
    searchPlaceholder: "Search articles...",
    allFilter: "All",
    emptyHeading: "No published articles",
    emptyDescription:
      "No articles are currently published in this section. Upcoming write-ups will appear here.",
    readTime: (mins: number) => `${mins} min read`,
    readArticle: "Read article",
    rssTitle: "RSS Feed",
  },
  privacy: {
    title: "Privacy Policy",
    intro:
      "This page outlines technical data processing, local preferences, and analytics on voldigoade.xyz.",
    sections: [
      {
        title: "Core Principles",
        content: [
          "Browsing this portfolio requires no user account. The site itself does not intentionally perform user-level tracking or profiling.",
          "Hosting is provided by Vercel and source code is hosted on GitHub. Hosting and network providers may process standard request metadata such as IP addresses, user agents, and timestamps for delivery, abuse prevention, and security.",
        ],
      },
      {
        title: "Aggregate Analytics (Cloudflare Web Analytics)",
        content: [
          "This site exclusively uses Cloudflare Web Analytics to monitor availability and aggregate traffic.",
          "This solution operates without cookies, without accessing browser local storage, and without fingerprinting techniques. No personal data is collected or shared with third-party advertisers.",
        ],
      },
      {
        title: "No Cookies & Local Storage (localStorage)",
        content: [
          "This site sets zero cookies.",
          "Browser local storage (localStorage) is used solely to remember client-side display preferences: theme selection (dark or light) and project filter state. This data remains on your device.",
        ],
      },
      {
        title: "Security & Vulnerability Reporting",
        content: [
          "The site is served over HTTPS with strict security headers (Content-Security-Policy, frame blocking via frame-ancestors 'none', HSTS).",
          "To responsibly report a security vulnerability, please use GitHub Security Advisories on https://github.com/Voldigoade.",
        ],
      },
    ],
  },
  notFound: {
    badge: "Error 404",
    title: "Page Not Found",
    description:
      "This resource does not exist or has been moved. Use the buttons below to return to active sections.",
    homeButton: "Back to home",
    projectsButton: "View projects",
  },
};

export function getCopy(locale: Locale = "fr"): SiteCopy {
  return locale === "en" ? copyEn : copyFr;
}
