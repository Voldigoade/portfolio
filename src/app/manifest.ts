import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Portfolio Voldigoade",
    short_name: "Voldigoade",
    description:
      "Projets logiciels open-source et recherches documentées sur les systèmes, la sécurité, la confidentialité et les outils développeur.",
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
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
