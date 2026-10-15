import type { Locale } from './locales';

export const experience = {
  fr: {
    identity: 'Logiciels, systèmes, sécurité.',
    explore: 'À propos',
    about: 'À propos',
    introduction: [
      'Je passe assez facilement d’une couche à l’autre. Une appli web devient un service systemd, puis une capture réseau — et il y a souvent un outil Rust quelque part à la fin.',
      'J’écris surtout en Rust, Python et TypeScript. Le reste dépend de ce qu’il faut faire fonctionner. Je ne publie pas tout ; ce qui est ici, j’ai choisi de le sortir.',
    ],
    stack: 'Autour du code',
    areas: [
      { name: 'Systèmes & réseaux', lines: ['Linux / Unix · protocoles'] },
      { name: 'Sécurité & vie privée', lines: ['Technologies d’anonymat'] },
      {
        name: 'Logiciels locaux & desktop',
        lines: ['Tauri · SQLite · local-first'],
      },
      { name: 'Automatisation & outils', lines: ['Agents · LLM · Node.js'] },
      { name: 'Expérimentation', lines: ['Cryptographie · stéganographie'] },
      { name: 'Web', lines: ['React / Next.js · TypeScript'] },
    ],
    work: 'Quelques projets',
    source: 'Code source',
    read: 'Lire la recherche',
    projects: [
      {
        name: 'Spoor',
        description:
          'Un outil Rust en ligne de commande pour inspecter les données publiques GitHub. API HTTP/SSE, rapports structurés et exports.',
        url: 'https://github.com/Voldigoade/spoor',
        detail: 'Rust · CLI · HTTP/SSE',
      },
      {
        name: 'Secure Messaging Research',
        description:
          'Une recherche sourcée sur les messageries, selon le modèle de menace : sécurité, vie privée, métadonnées et exposition réseau.',
        url: 'https://github.com/Voldigoade/recherche-messageries',
        detail: 'Recherche · sources · modèles de menace',
        website: 'https://voldigoade.github.io/recherche-messageries/',
      },
    ],
  },
  en: {
    identity: 'Software, systems, security.',
    explore: 'About me',
    about: 'About',
    introduction: [
      'I tend to move between layers. A web app becomes a systemd service, then a packet capture — and a Rust tool usually turns up somewhere along the way.',
      'I mostly write Rust, Python and TypeScript. Everything else depends on what needs to work. I don’t publish everything; what’s here is work I chose to ship.',
    ],
    stack: 'Usually somewhere around',
    areas: [
      { name: 'Systems & networking', lines: ['Linux / Unix · protocols'] },
      { name: 'Security & privacy', lines: ['Anonymity technologies'] },
      {
        name: 'Local & desktop software',
        lines: ['Tauri · SQLite · local-first'],
      },
      { name: 'Automation & tooling', lines: ['Agents · LLMs · Node.js'] },
      { name: 'Experiments', lines: ['Cryptography · steganography'] },
      { name: 'Web', lines: ['React / Next.js · TypeScript'] },
    ],
    work: 'Selected work',
    source: 'Source',
    read: 'Read the research',
    projects: [
      {
        name: 'Spoor',
        description:
          'A Rust CLI for inspecting public GitHub data. HTTP/SSE API, structured reports and exports.',
        url: 'https://github.com/Voldigoade/spoor',
        detail: 'Rust · CLI · HTTP/SSE',
      },
      {
        name: 'Secure Messaging Research',
        description:
          'Source-driven messaging research, organized around threat models: security, privacy, metadata and network exposure.',
        url: 'https://github.com/Voldigoade/recherche-messageries',
        detail: 'Research · sources · threat models',
        website: 'https://voldigoade.github.io/recherche-messageries/en/',
      },
    ],
  },
  es: {
    identity: 'Software, sistemas, seguridad.',
    explore: 'Acerca de mí',
    about: 'Acerca de',
    introduction: [
      'Suelo pasar de una capa a otra. Una aplicación web acaba siendo un servicio de systemd, luego una captura de red — y, en algún momento, aparece una herramienta en Rust.',
      'Escribo sobre todo en Rust, Python y TypeScript. Lo demás depende de lo que haya que hacer funcionar. No lo publico todo; lo que hay aquí es trabajo que decidí sacar a la luz.',
    ],
    stack: 'En lo que suelo trabajar',
    areas: [
      { name: 'Sistemas y redes', lines: ['Linux / Unix · protocolos'] },
      { name: 'Seguridad y privacidad', lines: ['Tecnologías de anonimato'] },
      {
        name: 'Software local y de escritorio',
        lines: ['Tauri · SQLite · local-first'],
      },
      {
        name: 'Automatización y herramientas',
        lines: ['Agentes · LLM · Node.js'],
      },
      { name: 'Experimentación', lines: ['Criptografía · esteganografía'] },
      { name: 'Web', lines: ['React / Next.js · TypeScript'] },
    ],
    work: 'Proyectos seleccionados',
    source: 'Código fuente',
    read: 'Leer la investigación',
    projects: [
      {
        name: 'Spoor',
        description:
          'Una herramienta CLI en Rust para inspeccionar datos públicos de GitHub. API HTTP/SSE, informes estructurados y exportaciones.',
        url: 'https://github.com/Voldigoade/spoor',
        detail: 'Rust · CLI · HTTP/SSE',
      },
      {
        name: 'Secure Messaging Research',
        description:
          'Investigación documentada sobre mensajería según el modelo de amenaza: seguridad, privacidad, metadatos y exposición de red.',
        url: 'https://github.com/Voldigoade/recherche-messageries',
        detail: 'Investigación · fuentes · modelos de amenaza',
        website: 'https://voldigoade.github.io/recherche-messageries/es/',
      },
    ],
  },
} satisfies Record<Locale, unknown>;
