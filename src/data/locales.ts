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
    privacyDescription: 'Ce que ce site fait — et ce qu’il n’enregistre pas.',
    privacySections: [
      {
        title: 'Spoor',
        text: 'Quand vous lancez une recherche, le nom de profil ou de dépôt est envoyé à l’API publique de Spoor. Le mode rapide consulte des données publiques GitHub, sans appel à GitLeak. Les résultats restent en mémoire dans votre navigateur ; les fichiers exportés sont fournis par Spoor. Le service et son hébergeur reçoivent les informations techniques nécessaires à ces requêtes.',
      },
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
        text: 'When you start a lookup, the profile or repository name is sent to Spoor’s public API. Fast mode checks public GitHub data without calling GitLeak. Results stay in browser memory; exported files come from Spoor. The service and its hosting provider receive the technical information needed for these requests.',
      },
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
        text: 'Al iniciar una consulta, el nombre del perfil o repositorio se envía a la API pública de Spoor. El modo rápido consulta datos públicos de GitHub sin llamar a GitLeak. Los resultados permanecen en la memoria del navegador; Spoor proporciona los archivos exportados. El servicio y su proveedor de alojamiento reciben la información técnica necesaria para estas solicitudes.',
      },
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
