import type { Locale } from './locales';

export const experience = {
  fr: {
    identity: 'Logiciels, systèmes, sécurité.',
    explore: 'À propos',
    about: 'À propos',
    introduction:
      'Je développe des logiciels et des outils pour Linux et le web. Je travaille aussi sur les réseaux, la sécurité, la vie privée et des expériences techniques.',
    stack: 'Domaines & outils',
    areas: [
      {
        name: 'Logiciels',
        lines: [
          'Rust · Python · TypeScript',
          'React / Next.js · Node.js',
          'Tauri · SQLite',
        ],
      },
      { name: 'Systèmes & réseaux', lines: ['Linux / Unix', 'Automatisation'] },
      { name: 'Sécurité & vie privée', lines: ['Recherche technique'] },
    ],
  },
  en: {
    identity: 'Software, systems, security.',
    explore: 'About me',
    about: 'About',
    introduction:
      'I develop software and tools for Linux and the web. I also work on networking, security, privacy and technical experiments.',
    stack: 'Areas & tools',
    areas: [
      {
        name: 'Software',
        lines: [
          'Rust · Python · TypeScript',
          'React / Next.js · Node.js',
          'Tauri · SQLite',
        ],
      },
      { name: 'Systems & networking', lines: ['Linux / Unix', 'Automation'] },
      { name: 'Security & privacy', lines: ['Technical research'] },
    ],
  },
  es: {
    identity: 'Software, sistemas, seguridad.',
    explore: 'Acerca de mí',
    about: 'Acerca de',
    introduction:
      'Desarrollo software y herramientas para Linux y la web. También trabajo con redes, seguridad, privacidad y experimentos técnicos.',
    stack: 'Áreas y herramientas',
    areas: [
      {
        name: 'Software',
        lines: [
          'Rust · Python · TypeScript',
          'React / Next.js · Node.js',
          'Tauri · SQLite',
        ],
      },
      { name: 'Sistemas y redes', lines: ['Linux / Unix', 'Automatización'] },
      { name: 'Seguridad y privacidad', lines: ['Investigación técnica'] },
    ],
  },
} satisfies Record<Locale, unknown>;
