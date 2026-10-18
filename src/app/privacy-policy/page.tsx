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
      intro="Cette politique explicite le traitement des données techniques, l'absence totale de cookies, la gestion des préférences locales et la mesure d'audience sur voldigoade.xyz."
      sections={[
        {
          title: "Principes Fondamentaux",
          content: [
            "La consultation de ce portfolio est entièrement anonyme et ne requiert aucun compte utilisateur. Ce site ne pratique aucun profilage, ne commercialise aucune donnée et ne comporte aucun formulaire ni mécanisme de collecte intrusive.",
            "L'hébergement est assuré par Vercel et le code source ainsi que les dépôts de recherche sont hébergés sur GitHub. Les interactions avec ces plateformes externes relèvent de leurs politiques de confidentialité respectives.",
          ],
        },
        {
          title: "Mesure d'Audience Sans Cookie (Cloudflare Web Analytics)",
          content: [
            "Ce site utilise exclusivement Cloudflare Web Analytics pour évaluer la disponibilité et la fréquentation globale de manière respectueuse de la vie privée.",
            "Cette solution fonctionne sans aucun cookie, sans recours au stockage local du navigateur et sans aucune technique d'empreinte numérique (fingerprinting). Aucune donnée à caractère personnel n'est collectée ou transmise à des tiers publicitaires.",
          ],
        },
        {
          title: "Absence de Cookies & Stockage Local (localStorage)",
          content: [
            "Ce site n'émet et ne dépose strictement aucun cookie, qu'il soit interne ou tiers.",
            "Le stockage local de votre navigateur (localStorage) est exclusivement sollicité pour mémoriser vos préférences d'affichage : le choix du thème (sombre ou clair) et l'état des filtres d'exploration. Ces données demeurent strictement confinées à votre appareil et ne sont jamais transmises à nos serveurs.",
          ],
        },
        {
          title: "Sécurité & Signalements",
          content: [
            "Le site est servi exclusivement en HTTPS avec des en-têtes de sécurité stricts (Content-Security-Policy rigoureuse, interdiction absolue de l'encapsulation en iframe via frame-ancestors 'none', HSTS).",
            "Pour toute question relative à cette politique ou pour signaler de manière responsable une vulnérabilité de sécurité, utilisez exclusivement les avis de sécurité GitHub (GitHub Security Advisories) sur le profil officiel : https://github.com/Voldigoade.",
          ],
        },
      ]}
    />
  );
}
