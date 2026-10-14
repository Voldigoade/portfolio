import type { Locale } from './locales';

interface ProjectTranslation {
  title: string;
  summary: string;
  description: string;
  status: string;
  focus: string[];
  question: string;
  context: string;
  dimensions: { title: string; text: string }[];
  methodTitle: string;
  method: string;
  limitsTitle: string;
  limits: string;
  statusTitle: string;
  statusText: string;
  artifactsTitle: string;
  artifacts: string[];
}

interface Project {
  slug: string;
  repository: string;
  website: Record<Locale, string>;
  translations: Record<Locale, ProjectTranslation>;
}

export const projects: Project[] = [
  {
    slug: 'secure-messaging',
    repository: 'https://github.com/Voldigoade/recherche-messageries',
    website: {
      fr: 'https://voldigoade.github.io/recherche-messageries/',
      en: 'https://voldigoade.github.io/recherche-messageries/en/',
      es: 'https://voldigoade.github.io/recherche-messageries/es/',
    },
    translations: {
      fr: {
        title: 'Recherche sur les messageries',
        summary:
          'Comparer des modèles de confiance, pas distribuer des notes de sécurité.',
        description:
          'Une recherche documentaire sur les messageries, leurs architectures, leurs métadonnées et leurs compromis. Le point de départ : un modèle de menace, pas un classement universel.',
        status: 'Publié · recherche évolutive',
        focus: ['Architecture', 'Identité', 'Métadonnées', 'Exposition réseau'],
        question: 'Le modèle de menace avant le classement.',
        context:
          'Chiffrer le contenu, protéger une identité et limiter les traces réseau sont des problèmes différents. Signal, SimpleX, Session, Olvid, Threema, Briar ou Cwtch n’y répondent pas de la même façon. La question utile reste : protéger quoi, contre qui, dans quelles conditions ?',
        dimensions: [
          {
            title: 'Identité',
            text: 'Numéro de téléphone, identifiant, pseudonyme : comment se crée une identité et quels liens persistent entre les échanges ?',
          },
          {
            title: 'Métadonnées',
            text: 'Ce que le fournisseur, les contacts et les intermédiaires peuvent observer, même lorsque le contenu est chiffré.',
          },
          {
            title: 'Réseau',
            text: 'Adresses exposées, routage, appels directs ou relayés : suivre le trajet réel plutôt que s’arrêter au protocole de chiffrement.',
          },
          {
            title: 'Confiance',
            text: 'Hypothèses sur les clients, les serveurs et les tiers. Distinguer documentation, audits indépendants, vulnérabilités et preuves publiques.',
          },
        ],
        methodTitle: 'Croiser les sources. Garder les inconnues.',
        method:
          'La documentation primaire, le code public, les audits, les publications académiques, les avis de sécurité et les documents judiciaires sont confrontés aux scénarios de menace. Chaque conclusion dépend de la version, de la plateforme et de la configuration. Une inconnue reste une inconnue.',
        limitsTitle: 'Les limites font partie du travail.',
        limits:
          'Il s’agit d’une recherche fondée sur des sources, pas d’une certification. La version publiée ne repose ni sur un laboratoire réseau contrôlé, ni sur une acquisition forensique mobile commerciale, ni sur la reconstruction de chaque binaire distribué.',
        statusTitle: 'État public',
        statusText:
          'Le rapport, le registre de preuves et les guides sont publiés. Le corpus de référence est en français ; des guides en anglais et en espagnol donnent accès aux principaux éléments. La recherche reste révisable à mesure que les logiciels et les sources évoluent.',
        artifactsTitle: 'Dans le dépôt',
        artifacts: [
          'Rapport de recherche',
          'Registre des preuves',
          'Modèles de menace',
          'Guides de choix',
        ],
      },
      en: {
        title: 'Secure Messaging Research',
        summary:
          'Comparing trust models, without reducing security to a score.',
        description:
          'Source-driven research into messaging architectures, metadata and operational trade-offs. The starting point is a threat model, rather than a universal ranking.',
        status: 'Published · ongoing research',
        focus: ['Architecture', 'Identity', 'Metadata', 'Network exposure'],
        question: 'The threat model comes first.',
        context:
          'Encrypting content, protecting an identity and reducing network traces are different problems. Signal, SimpleX, Session, Olvid, Threema, Briar and Cwtch make different choices. The useful question is: protect what, from whom, and under which conditions?',
        dimensions: [
          {
            title: 'Identity',
            text: 'Phone numbers, identifiers and pseudonyms: how is an identity created, and which connections remain between conversations?',
          },
          {
            title: 'Metadata',
            text: 'What providers, contacts and intermediaries can observe, even when message content is encrypted.',
          },
          {
            title: 'Network',
            text: 'Exposed addresses, routing, direct and relayed calls: follow the actual path beyond the encryption protocol.',
          },
          {
            title: 'Trust',
            text: 'Assumptions about clients, servers and third parties. Separate documentation, independent audits, vulnerabilities and public evidence.',
          },
        ],
        methodTitle: 'Cross-check sources. Keep the unknowns.',
        method:
          'Primary documentation, public code, audits, academic research, security advisories and court records are examined against threat scenarios. Each conclusion depends on the version, platform and configuration. Missing evidence is left visible.',
        limitsTitle: 'The limits belong in the research.',
        limits:
          'This is source-driven research, not a security certification. The published version does not include controlled network lab testing, commercial mobile-forensics acquisition or reproducible builds of every distributed binary.',
        statusTitle: 'Public status',
        statusText:
          'The report, evidence register and guides are published. The reference corpus is maintained in French; English and Spanish guides cover the main points. Conclusions remain open to revision as the software and available evidence change.',
        artifactsTitle: 'In the repository',
        artifacts: [
          'Research report',
          'Evidence register',
          'Threat models',
          'Decision guides',
        ],
      },
      es: {
        title: 'Investigación sobre mensajería',
        summary:
          'Comparar modelos de confianza sin reducir la seguridad a una nota.',
        description:
          'Una investigación documental sobre arquitecturas de mensajería, metadatos y compromisos operativos. El punto de partida es un modelo de amenazas, no una clasificación universal.',
        status: 'Publicado · investigación abierta',
        focus: ['Arquitectura', 'Identidad', 'Metadatos', 'Exposición de red'],
        question: 'Primero, el modelo de amenazas.',
        context:
          'Cifrar el contenido, proteger una identidad y reducir el rastro en la red son problemas distintos. Signal, SimpleX, Session, Olvid, Threema, Briar y Cwtch toman decisiones diferentes. La pregunta útil es: ¿qué proteger, frente a quién y en qué condiciones?',
        dimensions: [
          {
            title: 'Identidad',
            text: 'Números de teléfono, identificadores y seudónimos: cómo se crea una identidad y qué vínculos persisten entre las conversaciones.',
          },
          {
            title: 'Metadatos',
            text: 'Lo que pueden observar los proveedores, los contactos y los intermediarios, incluso con el contenido cifrado.',
          },
          {
            title: 'Red',
            text: 'Direcciones expuestas, rutas, llamadas directas o retransmitidas: seguir el recorrido real más allá del protocolo de cifrado.',
          },
          {
            title: 'Confianza',
            text: 'Supuestos sobre clientes, servidores y terceros. Distinguir la documentación, las auditorías independientes, las vulnerabilidades y las pruebas públicas.',
          },
        ],
        methodTitle: 'Contrastar las fuentes. Conservar las incógnitas.',
        method:
          'La documentación primaria, el código público, las auditorías, los estudios académicos, los avisos de seguridad y los documentos judiciales se contrastan con escenarios de amenazas. Cada conclusión depende de la versión, la plataforma y la configuración. Lo desconocido se señala como tal.',
        limitsTitle: 'Los límites también forman parte del estudio.',
        limits:
          'Es una investigación documental, no una certificación de seguridad. La versión publicada no incluye pruebas en un laboratorio de red controlado, adquisiciones forenses móviles comerciales ni la reconstrucción de todos los binarios distribuidos.',
        statusTitle: 'Estado público',
        statusText:
          'El informe, el registro de pruebas y las guías están publicados. El corpus de referencia se mantiene en francés; las guías en inglés y español recogen los puntos principales. Las conclusiones se revisan cuando cambian el software o las fuentes disponibles.',
        artifactsTitle: 'En el repositorio',
        artifacts: [
          'Informe de investigación',
          'Registro de pruebas',
          'Modelos de amenazas',
          'Guías de elección',
        ],
      },
    },
  },
];
