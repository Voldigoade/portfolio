import type { Locale } from '../data/locales';

interface SpoorCopy {
  subtitle: string;
  open: string;
  minimize: string;
  target: string;
  placeholder: string;
  inspect: string;
  starting: string;
  running: string;
  stop: string;
  complete: string;
  partial: string;
  partialText: string;
  warningText: string;
  user: string;
  repository: string;
  export: string;
  formats: string;
  unavailable: string;
  exportError: string;
  copy: string;
  copied: string;
  copyError: string;
  idleHint: string;
  noScript: string;
  rateLimit: string;
  rateHint: string;
  errors: Record<string, string>;
  fields: Record<string, string>;
  statuses: Record<string, string>;
}

export const spoorCopy: Record<Locale, SpoorCopy> = {
  fr: {
    subtitle: 'Inspection publique GitHub',
    open: 'Ouvrir',
    minimize: 'Réduire',
    target: 'Profil ou dépôt GitHub',
    placeholder: 'utilisateur ou dépôt GitHub',
    inspect: 'Inspecter',
    starting: 'Démarrage',
    running: 'Recherche en cours',
    stop: 'Annuler',
    complete: 'Complet',
    partial: 'Partiel',
    partialText: 'Le rapport couvre une partie des données publiques.',
    warningText: 'Le rapport signale des limites.',
    user: 'Compte GitHub',
    repository: 'Dépôt GitHub',
    export: 'Exporter',
    formats: 'Formats d’export',
    unavailable: 'Les exports seront disponibles avec le service.',
    exportError: 'Export indisponible. Réessayez.',
    copy: 'Copier',
    copied: 'Copié',
    copyError: 'La copie a échoué. Réessayez.',
    idleHint: 'Voldigoade · github.com/Voldigoade · torvalds/linux',
    noScript: 'JavaScript est nécessaire pour utiliser Spoor.',
    rateLimit: 'Limite de requêtes atteinte',
    rateHint: 'Réessayez plus tard. Aucun nouvel essai automatique.',
    errors: {
      invalidTarget: 'Entrez un utilisateur GitHub ou propriétaire/dépôt.',
      network: 'Connexion interrompue. Réessayez.',
      provider: 'La recherche n’a pas abouti. Réessayez.',
      notFound: 'Recherche introuvable. Relancez-la.',
      rateLimited: 'Limite de requêtes atteinte.',
      timeout: 'Le service met trop de temps à répondre. Réessayez.',
      notReady: 'Le résultat n’est pas encore disponible. Réessayez.',
    },
    fields: {
      repositories: 'Dépôts',
      created: 'Création',
      languages: 'Langages',
      identities: 'Adresses observées',
      followers: 'Abonnés',
      keys: 'Clés publiques',
    },
    statuses: {
      pending: 'en attente',
      running: 'en cours',
      complete: 'complet',
      partial: 'partiel',
      cached: 'en cache',
      skipped: 'non utilisé',
      unavailable: 'indisponible',
    },
  },
  en: {
    subtitle: 'GitHub public-footprint inspection',
    open: 'Open',
    minimize: 'Minimize',
    target: 'GitHub profile or repository',
    placeholder: 'GitHub username or repository',
    inspect: 'Inspect',
    starting: 'Starting',
    running: 'Lookup in progress',
    stop: 'Cancel',
    complete: 'Complete',
    partial: 'Partial',
    partialText: 'The report covers part of the public data.',
    warningText: 'The report includes limitations.',
    user: 'GitHub user',
    repository: 'GitHub repository',
    export: 'Export',
    formats: 'Export formats',
    unavailable: 'Exports will be available with the service.',
    exportError: 'Export unavailable. Try again.',
    copy: 'Copy',
    copied: 'Copied',
    copyError: 'Could not copy. Try again.',
    idleHint: 'Voldigoade · github.com/Voldigoade · torvalds/linux',
    noScript: 'JavaScript is required to use Spoor.',
    rateLimit: 'Rate limit reached',
    rateHint: 'Try again later. There are no automatic retries.',
    errors: {
      invalidTarget: 'Enter a GitHub username or owner/repository.',
      network: 'Connection interrupted. Try again.',
      provider: 'The lookup failed. Try again.',
      notFound: 'Lookup not found. Start it again.',
      rateLimited: 'Rate limit reached.',
      timeout: 'The service took too long to respond. Try again.',
      notReady: 'The result is not ready yet. Try again.',
    },
    fields: {
      repositories: 'Repositories',
      created: 'Created',
      languages: 'Languages',
      identities: 'Emails observed',
      followers: 'Followers',
      keys: 'Public keys',
    },
    statuses: {
      pending: 'pending',
      running: 'running',
      complete: 'complete',
      partial: 'partial',
      cached: 'cached',
      skipped: 'not used',
      unavailable: 'unavailable',
    },
  },
  es: {
    subtitle: 'Inspección pública de GitHub',
    open: 'Abrir',
    minimize: 'Reducir',
    target: 'Perfil o repositorio de GitHub',
    placeholder: 'usuario o repositorio de GitHub',
    inspect: 'Inspeccionar',
    starting: 'Iniciando',
    running: 'Consulta en curso',
    stop: 'Cancelar',
    complete: 'Completo',
    partial: 'Parcial',
    partialText: 'El informe cubre parte de los datos públicos.',
    warningText: 'El informe indica limitaciones.',
    user: 'Usuario de GitHub',
    repository: 'Repositorio de GitHub',
    export: 'Exportar',
    formats: 'Formatos de exportación',
    unavailable: 'Las exportaciones estarán disponibles con el servicio.',
    exportError: 'Exportación no disponible. Inténtalo de nuevo.',
    copy: 'Copiar',
    copied: 'Copiado',
    copyError: 'No se ha podido copiar. Inténtalo de nuevo.',
    idleHint: 'Voldigoade · github.com/Voldigoade · torvalds/linux',
    noScript: 'Se necesita JavaScript para usar Spoor.',
    rateLimit: 'Límite de solicitudes alcanzado',
    rateHint: 'Inténtalo más tarde. No se reintenta automáticamente.',
    errors: {
      invalidTarget:
        'Introduce un usuario de GitHub o propietario/repositorio.',
      network: 'Conexión interrumpida. Inténtalo de nuevo.',
      provider: 'La consulta ha fallado. Inténtalo de nuevo.',
      notFound: 'Consulta no encontrada. Iníciala de nuevo.',
      rateLimited: 'Límite de solicitudes alcanzado.',
      timeout: 'El servicio tarda demasiado en responder. Inténtalo de nuevo.',
      notReady: 'El resultado aún no está disponible. Inténtalo de nuevo.',
    },
    fields: {
      repositories: 'Repositorios',
      created: 'Creación',
      languages: 'Lenguajes',
      identities: 'Correos observados',
      followers: 'Seguidores',
      keys: 'Claves públicas',
    },
    statuses: {
      pending: 'pendiente',
      running: 'en curso',
      complete: 'completo',
      partial: 'parcial',
      cached: 'en caché',
      skipped: 'no utilizado',
      unavailable: 'no disponible',
    },
  },
};
