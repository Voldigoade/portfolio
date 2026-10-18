import { buildTwitterImage, ogContentType, ogSize } from "@/lib/og-image";

export const alt = "Voldigoade retro portfolio social card";
export const size = ogSize;
export const contentType = ogContentType;

export default function TwitterImage() {
  return buildTwitterImage({
    eyebrow: "Voldigoade Portfolio",
    title: "Voldigoade",
    subtitle: "Systems, Security & Tooling",
    accent: "secondary",
  });
}
