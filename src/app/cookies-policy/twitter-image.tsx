import { buildTwitterImage, ogContentType, ogSize } from "@/lib/og-image";

export const alt = "Cookies Policy | Voldigoade";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return buildTwitterImage({
    eyebrow: "Cookies Policy",
    title: "Cookie Usage",
    subtitle: "Tracking & Preferences",
    accent: "secondary",
  });
}
