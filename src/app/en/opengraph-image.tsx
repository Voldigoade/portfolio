import { buildOgImage, ogContentType, ogSize } from "@/lib/og-image";

export const alt = "Voldigoade Portfolio preview";
export const size = ogSize;
export const contentType = ogContentType;

export default function OpenGraphImage() {
  return buildOgImage({
    eyebrow: "Voldigoade Portfolio",
    title: "Voldigoade",
    subtitle: "Software Projects | Systems | Privacy",
    accent: "primary",
  });
}
