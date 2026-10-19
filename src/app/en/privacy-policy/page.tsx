import type { Metadata } from "next";
import { PolicyPageClient } from "@/components/policies/policy-page-client";
import { siteUrl } from "@/lib/site-config";
import { copyEn } from "@/lib/site-copy";

const privacyPolicyOgImageUrl = `${siteUrl}/privacy-policy/opengraph-image`;

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Technical data processing, display preferences, and privacy-respecting analytics on voldigoade.xyz.",
  alternates: {
    canonical: "/en/privacy-policy",
    languages: {
      fr: "/privacy-policy",
      en: "/en/privacy-policy",
      "x-default": "/privacy-policy",
    },
  },
  openGraph: {
    title: "Privacy Policy | Voldigoade",
    description:
      "Details on cookieless analytics, local display preferences, and data privacy on voldigoade.xyz.",
    url: `${siteUrl}/en/privacy-policy`,
    type: "website",
    locale: "en_US",
    images: [privacyPolicyOgImageUrl],
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy | Voldigoade",
    description:
      "Details on cookieless analytics, local display preferences, and data privacy on voldigoade.xyz.",
    images: [privacyPolicyOgImageUrl],
  },
};

export default function EnglishPrivacyPolicyPage() {
  return (
    <PolicyPageClient
      pageTitle={copyEn.privacy.title}
      intro={copyEn.privacy.intro}
      sections={copyEn.privacy.sections}
    />
  );
}
