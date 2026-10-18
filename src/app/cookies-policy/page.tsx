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
            "Browsing the portfolio does not require accepting Google analytics. Configured Google services load after explicit acceptance and may use cookies or browser storage.",
            "Default browsing and navigation of all projects, articles, and documentation does not require tracking cookies.",
          ],
        },
        {
          title: "Consent Gating & Storage",
          content: [
            "voldigoade_cookie_consent: Stores whether you accepted or dismissed the Cookie Notice. Only explicit acceptance enables the configured Google analytics scripts.",
            "Dismissing the notice leaves Google Analytics and Google Tag Manager disabled. Cloudflare Web Analytics, when configured, operates independently without cookies.",
          ],
        },
        {
          title: "Functional Local Storage",
          content: [
            "theme: Stores your dark mode or light mode appearance preference.",
            "voldigoade-blog-store, home-store, and projects-store: Remember writing and project filters across visits. showcase-store remembers interactive display preferences; system-pages-store remembers the last visited system page and retry count.",
            "The application does not persist contact-form fields or service credentials in local storage.",
          ],
        },
        {
          title: "Cookieless Analytics",
          content: [
            "Cloudflare Web Analytics may be enabled through site configuration. According to Cloudflare, its Web Analytics beacon does not use cookies, local storage, or browser fingerprinting for analytics.",
          ],
        },
        {
          title: "How to Revoke or Clear",
          content: [
            "To reset your choice, clear browser storage for voldigoade.xyz and reload the site. Google analytics will remain disabled until you accept again. Use your browser’s controls to remove any existing Google cookies as well.",
          ],
        },
      ]}
    />
  );
}
