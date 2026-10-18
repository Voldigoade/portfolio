import { buildTwitterImage, ogContentType, ogSize } from "@/lib/og-image";

export const alt = "Privacy Policy | Voldigoade";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return buildTwitterImage({
    eyebrow: "Privacy Policy",
    title: "Data & Privacy",
    subtitle: "Voldigoade Portfolio",
    accent: "secondary",
  });
}
