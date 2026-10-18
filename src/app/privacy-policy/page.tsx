import type { Metadata } from "next";
import { PolicyPageClient } from "@/components/policies/policy-page-client";
import { siteUrl } from "@/lib/site-config";

const privacyPolicyOgImageUrl = `${siteUrl}/privacy-policy/opengraph-image`;

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How voldigoade.xyz handles analytics preferences and contact messages.",
  alternates: { canonical: "/privacy-policy" },
  openGraph: {
    title: "Privacy Policy | Voldigoade",
    description:
      "Information about analytics, browser preferences, and contact messages on voldigoade.xyz.",
    url: `${siteUrl}/privacy-policy`,
    type: "website",
    images: [privacyPolicyOgImageUrl],
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy | Voldigoade",
    description:
      "Information about analytics, browser preferences, and contact messages on voldigoade.xyz.",
    images: [privacyPolicyOgImageUrl],
  },
};

export default function PrivacyPolicyPage() {
  return (
    <PolicyPageClient
      pageTitle="Privacy Policy"
      intro="This policy describes the data used by voldigoade.xyz for browsing preferences, optional analytics, and contact messages."
      sections={[
        {
          title: "Core Privacy Principles",
          content: [
            "Browsing the portfolio does not require an account. This application does not implement visitor fingerprinting or sell contact-form information.",
            "Links to GitHub and other external sites are subject to those services’ own privacy policies.",
          ],
        },
        {
          title: "Analytics & Telemetry",
          content: [
            "Cloudflare Web Analytics can be enabled through site configuration. Its cookieless beacon operates independently of the Google analytics consent choice.",
            "Google Analytics and Google Tag Manager load only when configured and after you explicitly accept the Cookie Notice. Google services may then use cookies or other browser storage according to their configuration.",
          ],
        },
        {
          title: "Contact Form Submissions",
          content: [
            "When the contact service is configured, submitting the form sends your name, email, topic, and message to Web3Forms for delivery. These details are used to handle your inquiry. Do not submit secrets or sensitive security reports.",
            "The application does not persist contact-form fields in browser local storage. Its temporary submission throttle runs in server memory and is not a durable abuse-prevention service.",
          ],
        },
        {
          title: "Cookies & Local Storage",
          content: [
            "Browser local storage remembers theme, cookie consent, filters, and interactive display preferences. See the Cookies Policy for details.",
            "Without explicit acceptance, the application does not load its configured Google analytics scripts. Cloudflare’s cookieless beacon may still be enabled.",
          ],
        },
        {
          title: "Data Security & Hygiene",
          content: [
            "The public site uses HTTPS. Hosting, form delivery, analytics, and linked services each have their own processing and retention policies.",
            "No online service can guarantee complete security. Avoid sending credentials, private keys, or confidential information through the general contact form.",
          ],
        },
        {
          title: "Contact & Data Rights",
          content: [
            "You have the right to request deletion or clarification regarding any communications sent through the contact form.",
            "For any inquiries regarding this policy, reach out via the Contact page or directly on GitHub: https://github.com/Voldigoade.",
          ],
        },
      ]}
    />
  );
}
