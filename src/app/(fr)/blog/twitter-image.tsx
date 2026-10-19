import { buildTwitterImage, ogContentType, ogSize } from "@/lib/og-image";

export const alt = "Writing & Research by Voldigoade";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return buildTwitterImage({
    eyebrow: "Writing",
    title: "Writing & Research",
    subtitle: "Systems | Security & Privacy | OSINT",
    accent: "secondary",
  });
}
