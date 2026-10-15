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
    project: 'projets',
    privacy: 'confidentialite',
    '404': '404',
  },
  en: {
    home: 'en',
    project: 'en/projects',
    privacy: 'en/privacy',
    '404': 'en/404',
  },
  es: {
    home: 'es',
    project: 'es/proyectos',
    privacy: 'es/privacidad',
    '404': 'es/404',
  },
};

export function route(
  locale: Locale,
  page: Page = 'home',
  projectSlug = 'secure-messaging',
): string {
  const path = segments[locale][page];
  return page === 'project' ? `/${path}/${projectSlug}` : `/${path}`;
}

export const copy = {
  fr: {
    title: 'Voldigoade',
    description:
      'Le portfolio de Voldigoade. Logiciels, systèmes, réseaux, sécurité, vie privée et recherche technique.',
    nav: ['À propos', 'Spoor', 'GitHub'],
    navLabel: 'Navigation principale',
    languageLabel: 'Langue',
    skip: 'Aller au contenu',
    work: 'Travaux choisis',
    read: 'Lire le projet',
    repository: 'Dépôt public',
    footer: 'Logiciels · systèmes · sécurité · vie privée',
    privacy: 'Confidentialité',
    top: 'Retour en haut',
    back: 'Retour aux travaux',
    visit: 'Lire la recherche',
    privacyTitle: 'Confidentialité',
    privacyDescription: 'Ce que ce site fait et ce qu’il n’enregistre pas.',
    privacySections: [
      {
        title: 'Spoor',
        text: 'Une recherche envoie le profil ou dépôt à Spoor. L’analyse rapide examine un échantillon de données GitHub et demande un enrichissement public à GitLeak lorsqu’il est disponible. Les résultats restent en mémoire dans le navigateur ; Spoor fournit les exports. Les avatars des résultats proviennent de GitHub.',
      },
      {
        title: 'Dans le navigateur',
        text: 'Ce site ne dépose aucun cookie et n’utilise ni stockage local, ni traceur, ni outil d’analyse d’audience. Aucun compteur de visites n’est activé. Les polices et les visuels du portfolio sont servis avec le site.',
      },
      {
        title: 'Lors d’une requête',
        text: 'Spoor traite temporairement l’adresse IP pour limiter les abus. Son limiteur conserve uniquement des identifiants salés en mémoire, sans profil visiteur. Les hébergeurs reçoivent les métadonnées réseau habituelles et peuvent conserver des journaux techniques.',
      },
      {
        title: 'Liens externes',
        text: 'GitHub, GitLeak et le site de recherche sont des services distincts, avec leurs propres règles de traitement des données.',
      },
    ],
    hostPrivacy: 'Politique de confidentialité de Vercel',
    notFound: 'Cette page n’est pas ici.',
    notFoundText:
      'Le lien a peut-être changé. Les travaux restent accessibles depuis l’accueil.',
    home: 'Revenir à l’accueil',
  },
  en: {
    title: 'Voldigoade',
    description:
      'Voldigoade’s portfolio. Software, systems, networking, security, privacy and technical research.',
    nav: ['About', 'Spoor', 'GitHub'],
    navLabel: 'Main navigation',
    languageLabel: 'Language',
    skip: 'Skip to content',
    work: 'Selected work',
    read: 'Read the project',
    repository: 'Public repository',
    footer: 'Software · systems · security · privacy',
    privacy: 'Privacy',
    top: 'Back to top',
    back: 'Back to work',
    visit: 'Read the research',
    privacyTitle: 'Privacy',
    privacyDescription: 'What this site does, and what it does not record.',
    privacySections: [
      {
        title: 'Spoor',
        text: 'A lookup sends the profile or repository to Spoor. Fast analysis samples public GitHub data and requests public GitLeak enrichment when available. Results stay in browser memory; exports come from Spoor. Result avatars come from GitHub.',
      },
      {
        title: 'In your browser',
        text: 'This site uses no cookies, local storage, trackers or audience analytics. No view counter is enabled. Portfolio fonts and visuals are served with the site.',
      },
      {
        title: 'When you request a page',
        text: 'Spoor briefly processes the client IP to prevent abuse. Its limiter keeps only salted identifiers in memory, without a visitor profile. Hosting providers receive normal network metadata and may keep technical logs.',
      },
      {
        title: 'External links',
        text: 'GitHub, GitLeak and the research website are separate services with their own data policies.',
      },
    ],
    hostPrivacy: 'Vercel privacy policy',
    notFound: 'This page is not here.',
    notFoundText:
      'The link may have changed. You can still find the work from the homepage.',
    home: 'Return home',
  },
  es: {
    title: 'Voldigoade',
    description:
      'El portfolio de Voldigoade. Software, sistemas, redes, seguridad, privacidad e investigación técnica.',
    nav: ['Acerca de', 'Spoor', 'GitHub'],
    navLabel: 'Navegación principal',
    languageLabel: 'Idioma',
    skip: 'Ir al contenido',
    work: 'Proyectos seleccionados',
    read: 'Ver el proyecto',
    repository: 'Repositorio público',
    footer: 'Software · sistemas · seguridad · privacidad',
    privacy: 'Privacidad',
    top: 'Volver arriba',
    back: 'Volver a los proyectos',
    visit: 'Leer la investigación',
    privacyTitle: 'Privacidad',
    privacyDescription: 'Qué hace este sitio y qué datos no registra.',
    privacySections: [
      {
        title: 'Spoor',
        text: 'Una consulta envía el perfil o repositorio a Spoor. El análisis rápido examina una muestra de datos públicos de GitHub y solicita enriquecimiento público a GitLeak cuando está disponible. Los resultados permanecen en la memoria del navegador; Spoor proporciona los archivos exportados. Los avatares proceden de GitHub.',
      },
      {
        title: 'En el navegador',
        text: 'Este sitio no utiliza cookies, almacenamiento local, rastreadores ni análisis de audiencia. No hay contador de visitas. Las fuentes y los recursos gráficos del portfolio se sirven con el sitio.',
      },
      {
        title: 'Al solicitar una página',
        text: 'Spoor procesa temporalmente la IP para prevenir abusos. Su limitador conserva únicamente identificadores con sal en memoria, sin crear perfiles de visitantes. Los proveedores de alojamiento reciben los metadatos de red habituales y pueden conservar registros técnicos.',
      },
      {
        title: 'Enlaces externos',
        text: 'GitHub, GitLeak y la web de investigación son servicios independientes con sus propias políticas de datos.',
      },
    ],
    hostPrivacy: 'Política de privacidad de Vercel',
    notFound: 'Esta página no está aquí.',
    notFoundText:
      'Puede que el enlace haya cambiado. Los proyectos siguen disponibles desde el inicio.',
    home: 'Volver al inicio',
  },
} satisfies Record<Locale, unknown>;
