import type { Metadata } from "next";
import { PolicyPageClient } from "@/components/policies/policy-page-client";
import { siteUrl } from "@/lib/site-config";

const cookiesPolicyOgImageUrl = `${siteUrl}/cookies-policy/opengraph-image`;

export const metadata: Metadata = {
  title: "Politique des cookies",
  description:
    "Politique relative aux cookies et au stockage local sur voldigoade.xyz.",
  alternates: { canonical: "/cookies-policy" },
  openGraph: {
    title: "Politique des cookies | Voldigoade",
    description:
      "Gestion des cookies, du stockage local et des préférences de consentement sur voldigoade.xyz.",
    url: `${siteUrl}/cookies-policy`,
    type: "website",
    locale: "fr_FR",
    images: [cookiesPolicyOgImageUrl],
  },
  twitter: {
    card: "summary_large_image",
    title: "Politique des cookies | Voldigoade",
    description:
      "Gestion des cookies, du stockage local et des préférences de consentement sur voldigoade.xyz.",
    images: [cookiesPolicyOgImageUrl],
  },
};

export default function CookiesPolicyPage() {
  return (
    <PolicyPageClient
      pageTitle="Politique des Cookies & Stockage Local"
      intro="Ce document détaille l'utilisation des témoins de connexion (cookies) et du stockage local du navigateur sur voldigoade.xyz."
      sections={[
        {
          title: "Notre Approche des Témoins de Connexion",
          content: [
            "La navigation sur ce portfolio ne requiert aucun cookie publicitaire ni traceur commercial. L'accès complet aux projets, articles et documentations fonctionne sans cookie de traçage.",
            "L'activation de Google Analytics 4 est strictement subordonnée à votre accord préalable via le bandeau de consentement.",
          ],
        },
        {
          title: "Consentement & Clés de Stockage",
          content: [
            "voldigoade_cookie_consent : Mémorise si vous avez accepté ou refusé l'activation des métriques d'audience Google Analytics.",
            "En cas de refus, aucun script Google Analytics n'est chargé. Cloudflare Web Analytics, s'il est configuré, fonctionne de façon entièrement découplée et sans aucun cookie.",
          ],
        },
        {
          title: "Stockage Local Fonctionnel (localStorage)",
          content: [
            "theme : Conserve votre préférence d'apparence (mode clair, sombre ou automatique).",
            "voldigoade-blog-store, home-store, projects-store : Mémorisent l'état de vos filtres actifs pour simplifier votre navigation.",
            "Aucun identifiant secret, mot de passe ou donnée sensible n'est stocké dans votre navigateur.",
          ],
        },
        {
          title: "Mesure Sans Cookie (Cloudflare Analytics)",
          content: [
            "Cloudflare Web Analytics peut être activé au niveau de l'infrastructure. Ce service ne recourt à aucun cookie, aucun stockage local et aucune technique d'empreinte numérique (fingerprinting).",
          ],
        },
        {
          title: "Modification et Révocation du Consentement",
          content: [
            "Vous pouvez à tout instant rouvrir le panneau de consentement et modifier votre choix en cliquant sur « Gérer les préférences » dans le pied de page du site.",
            "Vous pouvez également effacer les données de stockage local de votre navigateur à tout moment via les paramètres de confidentialité de celui-ci.",
          ],
        },
      ]}
    />
  );
}
