import { buildTwitterImage, ogContentType, ogSize } from "@/lib/og-image";

export const alt = "About Voldigoade";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return buildTwitterImage({
    eyebrow: "About",
    title: "About Voldigoade",
    subtitle: "Software Engineer & Systems Researcher",
    accent: "accent",
  });
}
