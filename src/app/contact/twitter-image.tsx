import { buildTwitterImage, ogContentType, ogSize } from "@/lib/og-image";

export const alt = "Contact Voldigoade";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return buildTwitterImage({
    eyebrow: "Contact",
    title: "Get In Touch",
    subtitle: "Systems | Security Auditing | Open Source",
    accent: "primary",
  });
}
