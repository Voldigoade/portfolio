import { buildTwitterImage, ogContentType, ogSize } from "@/lib/og-image";

export const alt = "Terms of Service | Voldigoade";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return buildTwitterImage({
    eyebrow: "Terms Of Service",
    title: "Usage Terms",
    subtitle: "Open Source & Security Research",
    accent: "accent",
  });
}
