import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Voldigoade Portfolio",
    short_name: "Voldigoade",
    description:
      "Public software projects and source-linked research into systems, security, privacy, and developer tools.",
    start_url: "/",
    display: "standalone",
    background_color: "#fff5e6",
    theme_color: "#ff7a00",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "48x48",
        type: "image/x-icon",
      },
      {
        src: "/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
