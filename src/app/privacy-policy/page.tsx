import type { Metadata } from "next";
import { PolicyPageClient } from "@/components/policies/policy-page-client";
import { siteUrl } from "@/lib/site-config";

const privacyPolicyOgImageUrl = `${siteUrl}/privacy-policy/opengraph-image`;

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description:
    "Traitement des données techniques, préférences de navigation et mesure d'audience sur voldigoade.xyz.",
  alternates: { canonical: "/privacy-policy" },
  openGraph: {
    title: "Politique de confidentialité | Voldigoade",
    description:
      "Informations sur la mesure d'audience, les préférences de navigation et la protection des données sur voldigoade.xyz.",
    url: `${siteUrl}/privacy-policy`,
    type: "website",
    locale: "fr_FR",
    images: [privacyPolicyOgImageUrl],
  },
  twitter: {
    card: "summary_large_image",
    title: "Politique de confidentialité | Voldigoade",
    description:
      "Informations sur la mesure d'audience, les préférences de navigation et la protection des données sur voldigoade.xyz.",
    images: [privacyPolicyOgImageUrl],
  },
};

export default function PrivacyPolicyPage() {
  return (
    <PolicyPageClient
      pageTitle="Politique de Confidentialité"
      intro="Cette politique explicite le traitement des données techniques, la gestion des préférences locales et la mesure d'audience sur voldigoade.xyz."
      sections={[
        {
          title: "Principes Fondamentaux",
          content: [
            "La consultation de ce portfolio ne nécessite aucun compte utilisateur. Ce site ne pratique aucun traçage inter-sites, ne commercialise aucune donnée et ne comporte aucun formulaire de collecte intrusive.",
            "Les liens menant vers GitHub ou d'autres plateformes externes sont régis par les politiques de confidentialité respectives de ces services.",
          ],
        },
        {
          title: "Mesure d'Audience & Télémétrie",
          content: [
            "Cloudflare Web Analytics peut être activé afin de mesurer les performances d'acheminement et de disponibilité. Cette solution fonctionne sans cookie et sans collecte d'identifiants personnels.",
            "Google Analytics 4 est strictement conditionné à votre consentement explicite via le bandeau dédié. Lorsqu'il est autorisé, il opère selon des paramètres de minimisation stricts (anonymisation des adresses IP, désactivation des signaux publicitaires et suppression des paramètres d'URL).",
          ],
        },
        {
          title: "Stockage Local (localStorage)",
          content: [
            "Le stockage local de votre navigateur est exclusivement utilisé pour conserver vos préférences d'affichage (thème sombre ou clair, filtres actifs) et l'état de votre consentement relatif aux cookies.",
            "Vous pouvez à tout moment réinitialiser ou modifier vos choix de consentement via le bouton « Gérer les préférences » accessible en bas de chaque page.",
          ],
        },
        {
          title: "Sécurité & Signalements",
          content: [
            "Le site est servi exclusivement en HTTPS avec des en-têtes de sécurité renforcés (Content-Security-Policy, protection contre l'encapsulation en iframe, HSTS).",
            "Pour toute question relative à cette politique ou pour signaler une vulnérabilité de sécurité, utilisez les avis de sécurité GitHub (GitHub Security Advisories) sur les dépôts officiels du projet : https://github.com/Voldigoade.",
          ],
        },
      ]}
    />
  );
}
