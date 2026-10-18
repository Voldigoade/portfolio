import type { Metadata } from "next";
import { PolicyPageClient } from "@/components/policies/policy-page-client";
import { siteUrl } from "@/lib/site-config";

const privacyPolicyOgImageUrl = `${siteUrl}/privacy-policy/opengraph-image`;

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy Policy for voldigoade.xyz: privacy-first architecture, consent gating, and zero fingerprinting.",
  alternates: { canonical: "/privacy-policy" },
  openGraph: {
    title: "Privacy Policy | Voldigoade",
    description:
      "How data is protected on voldigoade.xyz with privacy-preserving telemetry and strict consent gating.",
    url: `${siteUrl}/privacy-policy`,
    type: "website",
    images: [privacyPolicyOgImageUrl],
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy | Voldigoade",
    description:
      "How data is protected on voldigoade.xyz with privacy-preserving telemetry and strict consent gating.",
    images: [privacyPolicyOgImageUrl],
  },
};

export default function PrivacyPolicyPage() {
  return (
    <PolicyPageClient
      pageTitle="Privacy Policy"
      intro="This Privacy Policy outlines how Voldigoade protects your privacy when visiting voldigoade.xyz. Privacy, data minimization, and transparency are core design principles of this site."
      sections={[
        {
          title: "Core Privacy Principles",
          content: [
            "This site is designed with data minimization as a primary invariant: no intrusive tracking, no canvas fingerprinting, and no sale of personal information.",
            "Static content, open-source articles, and project documentation are freely accessible without accounts or paywalls.",
          ],
        },
        {
          title: "Analytics & Telemetry",
          content: [
            "Cloudflare Web Analytics: We use Cloudflare Web Analytics for non-invasive, privacy-preserving aggregated traffic analysis. It does not use cookies, does not track individual IP addresses across sites, and does not profile visitors.",
            "Google Analytics / Tag Manager: Optional analytics are strictly consent-gated. If consent is not explicitly granted via the Cookie Notice, Google Analytics scripts are completely prevented from loading or running.",
          ],
        },
        {
          title: "Contact Form Submissions",
          content: [
            "If you submit an inquiry through the Contact page, the information you provide (name, email, topic, project scope) is processed securely via HTTPS solely to reply to your message.",
            "Form input is not stored in plain-text browser local storage, nor is it ever shared with advertisers or third-party marketers.",
          ],
        },
        {
          title: "Cookies & Local Storage",
          content: [
            "Local storage is used strictly for client-side user preferences: theme selection (dark/light) and your cookie consent preference (voldigoade_cookie_consent).",
            "No advertising or cross-site tracking cookies are set by this website.",
          ],
        },
        {
          title: "Data Security & Hygiene",
          content: [
            "All connections are enforced via TLS/HTTPS with modern cipher suites.",
            "Third-party integrations are kept to a strict minimum to reduce external attack surface.",
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
