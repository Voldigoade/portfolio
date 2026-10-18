import type { Metadata } from "next";
import { PolicyPageClient } from "@/components/policies/policy-page-client";
import { siteUrl } from "@/lib/site-config";

const termsOgImageUrl = `${siteUrl}/terms-of-service/opengraph-image`;

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms of Service and open-source usage guidelines for voldigoade.xyz.",
  alternates: { canonical: "/terms-of-service" },
  openGraph: {
    title: "Terms of Service | Voldigoade",
    description:
      "Usage terms, open-source code licenses, and security research guidelines for voldigoade.xyz.",
    url: `${siteUrl}/terms-of-service`,
    type: "website",
    images: [termsOgImageUrl],
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms of Service | Voldigoade",
    description:
      "Usage terms, open-source code licenses, and security research guidelines for voldigoade.xyz.",
    images: [termsOgImageUrl],
  },
};

export default function TermsOfServicePage() {
  return (
    <PolicyPageClient
      pageTitle="Terms of Service"
      intro="These Terms of Service govern access to voldigoade.xyz, including its project links and technical writing."
      sections={[
        {
          title: "Open Source Code & Content",
          content: [
            "Linked repositories publish their own license terms. Research text, data, and code may use different licenses; check the relevant repository before reusing material.",
            "Technical articles, architectural write-ups, and documentation published on this website are provided for educational and technical research purposes.",
          ],
        },
        {
          title: "Responsible Security Research",
          content: [
            "Tools, scripts, and footprint auditing utilities (including Spoor) are intended for defensive assessment, personal exposure auditing, and authorized security verification.",
            "Users are solely responsible for ensuring their use of any published tools complies with applicable legal frameworks and authorized testing boundaries.",
          ],
        },
        {
          title: "Disclaimer of Warranties",
          content: [
            "All content, benchmarks, code samples, and utilities on this site are provided 'AS IS' without warranty of any kind, express or implied.",
            "Materials may be incomplete or outdated. Check the linked sources and project limitations before relying on technical claims or code samples.",
          ],
        },
        {
          title: "Limitation of Liability",
          content: [
            "To the maximum extent permitted by applicable law, in no event shall Voldigoade be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use materials on this site.",
          ],
        },
        {
          title: "Vulnerability Disclosure",
          content: [
            "If you discover a security vulnerability, follow the relevant repository’s SECURITY.md reporting instructions where available. Do not include secrets or sensitive exploit details in a public issue or the general contact form.",
          ],
        },
      ]}
    />
  );
}
