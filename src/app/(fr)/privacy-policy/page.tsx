import type { Metadata } from "next";
import { PolicyPageClient } from "@/components/policies/policy-page-client";
import { siteUrl } from "@/lib/site-config";
import { copyFr } from "@/lib/site-copy";

const privacyPolicyOgImageUrl = `${siteUrl}/privacy-policy/opengraph-image`;

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description:
    "Traitement des données techniques, préférences de navigation et mesure d'audience sur voldigoade.xyz.",
  alternates: {
    canonical: "/privacy-policy",
    languages: {
      fr: "/privacy-policy",
      en: "/en/privacy-policy",
      "x-default": "/privacy-policy",
    },
  },
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
      pageTitle={copyFr.privacy.title}
      intro={copyFr.privacy.intro}
      sections={copyFr.privacy.sections}
    />
  );
}
