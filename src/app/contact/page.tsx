import type { Metadata } from "next";
import { ContactPageClient } from "@/components/pages/contact-page-client";
import { siteUrl } from "@/lib/site-config";

const contactOgImageUrl = `${siteUrl}/contact/opengraph-image`;

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Voldigoade with project questions, feedback, and collaboration ideas.",
  alternates: {
    canonical: "/contact",
  },
  keywords: [
    "contact voldigoade",
    "systems engineering",
    "security research",
    "open source",
    "inquiry",
  ],
  openGraph: {
    title: "Contact Voldigoade",
    description:
      "Send technical inquiries, security research questions, or collaboration proposals.",
    url: `${siteUrl}/contact`,
    type: "website",
    images: [
      {
        url: contactOgImageUrl,
        width: 1200,
        height: 630,
        alt: "Contact Voldigoade",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Voldigoade",
    description:
      "Send technical inquiries, security research questions, or collaboration proposals.",
    images: [contactOgImageUrl],
  },
};

function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

export default function ContactPage() {
  const contactJsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact Voldigoade",
    url: `${siteUrl}/contact`,
    description:
      "Contact page for public project questions, feedback, and collaboration ideas.",
  };

  return (
    <>
      <script type="application/ld+json">
        {serializeJsonLd(contactJsonLd)}
      </script>
      <ContactPageClient />
    </>
  );
}
