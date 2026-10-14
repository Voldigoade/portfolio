export const locales = ['fr', 'en', 'es'] as const;
export type Locale = (typeof locales)[number];
export type Page = 'home' | 'project' | 'privacy' | '404';

export const languageNames: Record<Locale, string> = {
  fr: 'Français',
  en: 'English',
  es: 'Español',
};

const segments: Record<Locale, Record<Page, string>> = {
  fr: {
    home: '',
    project: 'projets/secure-messaging',
    privacy: 'confidentialite',
    '404': '404',
  },
  en: {
    home: 'en',
    project: 'en/projects/secure-messaging',
    privacy: 'en/privacy',
    '404': 'en/404',
  },
  es: {
    home: 'es',
    project: 'es/proyectos/secure-messaging',
    privacy: 'es/privacidad',
    '404': 'es/404',
  },
};

export function route(locale: Locale, page: Page = 'home'): string {
  return `/${segments[locale][page]}`;
}

export const copy = {
  fr: {
    title: 'Voldigoade — logiciels, systèmes, sécurité, vie privée',
    description:
      'Logiciels, systèmes, réseaux et vie privée. Les travaux et les recherches de Voldigoade, une couche après l’autre.',
    nav: ['Travaux', 'Terrains', 'Approche'],
    navLabel: 'Navigation principale',
    languageLabel: 'Langue',
    skip: 'Aller au contenu',
    hero: ['Un problème mène', 'souvent un étage', 'plus bas.'],
    intro:
      'Je construis des logiciels et je regarde ce qui se passe en dessous. Systèmes, réseaux, sécurité, vie privée : la frontière dépend du problème.',
    explore: 'Explorer les travaux',
    trace: ['logiciel', 'système', 'réseau', 'protocole'],
    work: 'Travaux choisis',
    workAside: 'Peu de choses publiques. Des sujets creusés.',
    read: 'Lire le projet',
    repository: 'Dépôt public',
    scope: 'Champ d’étude',
    layers: 'Entre les couches',
    layersIntro:
      'Le point de départ change. La façon de regarder reste la même.',
    domains: [
      {
        title: 'Logiciels & outils',
        text: 'Des applications locales, des outils de développement, des automatisations. Surtout en Rust, Python et TypeScript. Le langage suit le besoin.',
        detail: 'Local-first · outils · automatisation',
      },
      {
        title: 'Systèmes & réseaux',
        text: 'Du processus au paquet. Linux, Unix, protocoles et services : comprendre les échanges et les contraintes avant d’ajouter une abstraction.',
        detail: 'Linux / Unix · réseaux · protocoles',
      },
      {
        title: 'Sécurité & recherche',
        text: 'Qui voit quoi, à quel moment, et sous quelles hypothèses ? Vie privée, anonymat, cryptographie : partir du modèle de menace, garder les limites visibles.',
        detail: 'Vie privée · modèles de confiance · preuves',
      },
    ],
    approach: 'Partir du concret.',
    approachText: [
      'Un comportement inattendu, une contrainte, un outil qui manque. Je commence là, puis je descends jusqu’à comprendre ce qui se passe.',
      'Une application peut finir en service système, puis en capture réseau. Je construis, je teste, je reprends les hypothèses. La bonne couche est celle où le problème se résout.',
    ],
    contact: 'La suite se passe sur GitHub.',
    contactText: 'Les dépôts publics, les sources et les échanges sont là-bas.',
    contactLink: 'Retrouver Voldigoade',
    footer: 'Logiciels · systèmes · sécurité · vie privée',
    privacy: 'Confidentialité',
    top: 'Retour en haut',
    back: 'Retour aux travaux',
    visit: 'Lire la recherche',
    privacyTitle: 'Une surface volontairement sobre.',
    privacyDescription: 'Ce que ce site fait — et ce qu’il n’enregistre pas.',
    privacySections: [
      {
        title: 'Dans le navigateur',
        text: 'Ce site ne dépose aucun cookie et n’utilise ni stockage local, ni traceur, ni outil d’analyse d’audience. Aucun compteur de visites n’est activé. Les polices et les images sont servies avec le site.',
      },
      {
        title: 'Lors d’une requête',
        text: 'L’application ne collecte ni adresse IP ni profil de visiteur. L’hébergeur reçoit les informations nécessaires à la livraison des pages et peut traiter des journaux techniques selon sa propre politique.',
      },
      {
        title: 'Liens externes',
        text: 'Les liens GitHub et le site de recherche vous conduisent vers des services distincts, avec leurs propres règles. Aucun contenu de ces services n’est chargé automatiquement ici.',
      },
    ],
    hostPrivacy: 'Politique de confidentialité de Vercel',
    notFound: 'Cette page n’est pas ici.',
    notFoundText:
      'Le lien a peut-être changé. Les travaux restent accessibles depuis l’accueil.',
    home: 'Revenir à l’accueil',
  },
  en: {
    title: 'Voldigoade — software, systems, security, privacy',
    description:
      'Software, systems, networks and privacy. Work and research by Voldigoade, one layer at a time.',
    nav: ['Work', 'Areas', 'Approach'],
    navLabel: 'Main navigation',
    languageLabel: 'Language',
    skip: 'Skip to content',
    hero: ['One problem often', 'leads a layer', 'deeper.'],
    intro:
      'I build software and look at what happens underneath. Systems, networks, security, privacy: where one ends and another begins depends on the problem.',
    explore: 'Explore the work',
    trace: ['software', 'system', 'network', 'protocol'],
    work: 'Selected work',
    workAside: 'A small public surface. A closer look underneath.',
    read: 'Read the project',
    repository: 'Public repository',
    scope: 'Scope of research',
    layers: 'Across layers',
    layersIntro:
      'The starting point changes. The way I look at things stays the same.',
    domains: [
      {
        title: 'Software & tools',
        text: 'Local applications, developer tools and automation. Mostly Rust, Python and TypeScript. The language depends on what needs doing.',
        detail: 'Local-first · tooling · automation',
      },
      {
        title: 'Systems & networks',
        text: 'From a process to a packet. Linux, Unix, protocols and services: understand the exchanges and constraints before adding another abstraction.',
        detail: 'Linux / Unix · networking · protocols',
      },
      {
        title: 'Security & research',
        text: 'Who can see what, when, and under which assumptions? Privacy, anonymity and cryptography: start with the threat model and keep the limits in view.',
        detail: 'Privacy · trust models · evidence',
      },
    ],
    approach: 'Start with something concrete.',
    approachText: [
      'Unexpected behaviour, a constraint, a missing tool. That is usually where I start. Then I keep digging until the behaviour makes sense.',
      'An app can turn into a system service, then a packet capture. I build, test and revisit the assumptions. The right layer is the one where the problem can actually be solved.',
    ],
    contact: 'The rest is on GitHub.',
    contactText: 'Public repositories, sources and conversations live there.',
    contactLink: 'Find Voldigoade',
    footer: 'Software · systems · security · privacy',
    privacy: 'Privacy',
    top: 'Back to top',
    back: 'Back to work',
    visit: 'Read the research',
    privacyTitle: 'A deliberately small footprint.',
    privacyDescription: 'What this site does, and what it does not record.',
    privacySections: [
      {
        title: 'In your browser',
        text: 'This site uses no cookies, local storage, trackers or audience analytics. No view counter is enabled. Fonts and images are served with the site.',
      },
      {
        title: 'When you request a page',
        text: 'The application does not collect IP addresses or build visitor profiles. The hosting provider receives the information needed to deliver pages and may process technical logs under its own policy.',
      },
      {
        title: 'External links',
        text: 'GitHub links and the research website take you to separate services with their own policies. No content from those services is loaded automatically here.',
      },
    ],
    hostPrivacy: 'Vercel privacy policy',
    notFound: 'This page is not here.',
    notFoundText:
      'The link may have changed. You can still find the work from the homepage.',
    home: 'Return home',
  },
  es: {
    title: 'Voldigoade — software, sistemas, seguridad, privacidad',
    description:
      'Software, sistemas, redes y privacidad. Los proyectos y la investigación de Voldigoade, capa a capa.',
    nav: ['Proyectos', 'Ámbitos', 'Enfoque'],
    navLabel: 'Navegación principal',
    languageLabel: 'Idioma',
    skip: 'Ir al contenido',
    hero: ['Un problema suele', 'llevar a una capa', 'más abajo.'],
    intro:
      'Construyo software y miro qué ocurre por debajo. Sistemas, redes, seguridad, privacidad: los límites los marca el problema.',
    explore: 'Explorar los proyectos',
    trace: ['software', 'sistema', 'red', 'protocolo'],
    work: 'Proyectos seleccionados',
    workAside: 'Poco a la vista. Más bajo la superficie.',
    read: 'Ver el proyecto',
    repository: 'Repositorio público',
    scope: 'Ámbito del estudio',
    layers: 'Entre capas',
    layersIntro:
      'Cambia el punto de partida. La forma de observar sigue siendo la misma.',
    domains: [
      {
        title: 'Software y herramientas',
        text: 'Aplicaciones locales, herramientas de desarrollo y automatización. Sobre todo Rust, Python y TypeScript. El lenguaje depende de lo que haga falta.',
        detail: 'Local-first · herramientas · automatización',
      },
      {
        title: 'Sistemas y redes',
        text: 'Del proceso al paquete. Linux, Unix, protocolos y servicios: entender los intercambios y las restricciones antes de añadir otra abstracción.',
        detail: 'Linux / Unix · redes · protocolos',
      },
      {
        title: 'Seguridad e investigación',
        text: '¿Quién ve qué, cuándo y bajo qué supuestos? Privacidad, anonimato y criptografía: empezar por el modelo de amenazas y dejar claros los límites.',
        detail: 'Privacidad · modelos de confianza · evidencias',
      },
    ],
    approach: 'Empezar por algo concreto.',
    approachText: [
      'Un comportamiento inesperado, una restricción, una herramienta que falta. Suelo empezar ahí y seguir bajando hasta entender lo que ocurre.',
      'Una aplicación puede acabar en un servicio del sistema y después en una captura de red. Construyo, pruebo y reviso los supuestos. La capa adecuada es aquella donde se resuelve el problema.',
    ],
    contact: 'El resto está en GitHub.',
    contactText:
      'Allí están los repositorios públicos, las fuentes y las conversaciones.',
    contactLink: 'Encontrar a Voldigoade',
    footer: 'Software · sistemas · seguridad · privacidad',
    privacy: 'Privacidad',
    top: 'Volver arriba',
    back: 'Volver a los proyectos',
    visit: 'Leer la investigación',
    privacyTitle: 'Una huella deliberadamente pequeña.',
    privacyDescription: 'Qué hace este sitio y qué datos no registra.',
    privacySections: [
      {
        title: 'En el navegador',
        text: 'Este sitio no utiliza cookies, almacenamiento local, rastreadores ni análisis de audiencia. No hay contador de visitas. Las fuentes y las imágenes se sirven desde el propio sitio.',
      },
      {
        title: 'Al solicitar una página',
        text: 'La aplicación no recoge direcciones IP ni crea perfiles de visitantes. El proveedor de alojamiento recibe la información necesaria para servir las páginas y puede tratar registros técnicos según su propia política.',
      },
      {
        title: 'Enlaces externos',
        text: 'Los enlaces a GitHub y a la web de investigación llevan a servicios distintos, con sus propias políticas. Aquí no se carga automáticamente ningún contenido de esos servicios.',
      },
    ],
    hostPrivacy: 'Política de privacidad de Vercel',
    notFound: 'Esta página no está aquí.',
    notFoundText:
      'Puede que el enlace haya cambiado. Los proyectos siguen disponibles desde el inicio.',
    home: 'Volver al inicio',
  },
} satisfies Record<Locale, unknown>;
