import { buildOgImage, ogContentType, ogSize } from "@/lib/og-image";

export const alt = "Projects by Voldigoade";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return buildOgImage({
    eyebrow: "Projects",
    title: "Open Source Systems",
    subtitle: "Security | Systems & Rust | Tooling",
    accent: "primary",
  });
}
