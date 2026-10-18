import type { Metadata } from "next";
import { PolicyPageClient } from "@/components/policies/policy-page-client";
import { siteUrl } from "@/lib/site-config";

const cookiesPolicyOgImageUrl = `${siteUrl}/cookies-policy/opengraph-image`;

export const metadata: Metadata = {
  title: "Cookies Policy",
  description: "Cookies and local storage policy for voldigoade.xyz.",
  alternates: { canonical: "/cookies-policy" },
  openGraph: {
    title: "Cookies Policy | Voldigoade",
    description:
      "How cookies, local storage, and consent preferences are managed on voldigoade.xyz.",
    url: `${siteUrl}/cookies-policy`,
    type: "website",
    images: [cookiesPolicyOgImageUrl],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cookies Policy | Voldigoade",
    description:
      "How cookies, local storage, and consent preferences are managed on voldigoade.xyz.",
    images: [cookiesPolicyOgImageUrl],
  },
};

export default function CookiesPolicyPage() {
  return (
    <PolicyPageClient
      pageTitle="Cookies & Storage Policy"
      intro="This policy explains how voldigoade.xyz utilizes cookies and browser local storage to maintain functionality and respect user choices."
      sections={[
        {
          title: "Our Approach to Cookies",
          content: [
            "voldigoade.xyz minimizes cookie usage to the greatest extent possible. We do not use third-party advertising cookies or cross-site tracking beacons.",
            "Default browsing and navigation of all projects, articles, and documentation does not require tracking cookies.",
          ],
        },
        {
          title: "Consent Gating & Storage",
          content: [
            "voldigoade_cookie_consent: When you interact with the Cookie Notice banner, your choice ('accepted' or 'rejected') is stored locally in your browser's localStorage so you are not prompted repeatedly.",
            "If you decline or dismiss consent, all optional analytics tools (including Google Analytics / Tag Manager) remain completely disabled and inert.",
          ],
        },
        {
          title: "Functional Local Storage",
          content: [
            "theme: Stores your dark mode or light mode appearance preference.",
            "blog-store / home-store: Stores filter preferences (such as selected writing tag or technical focus area) within your current session.",
            "No sensitive personal identification data or plain-text credentials are ever placed in local storage.",
          ],
        },
        {
          title: "Cookieless Analytics",
          content: [
            "We employ Cloudflare Web Analytics, a privacy-first measurement beacon that operates without setting cookies, tracking personal identifiable information, or fingerprinting browser devices.",
          ],
        },
        {
          title: "How to Revoke or Clear",
          content: [
            "You can reset your consent preference or theme at any time by clearing your browser's local storage for voldigoade.xyz, which will immediately re-trigger the default consent-gated state.",
          ],
        },
      ]}
    />
  );
}
