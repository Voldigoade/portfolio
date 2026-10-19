export interface LinkItem {
  href: string;
  name: string;
  description: string;
}

export const links: LinkItem[] = [
  {
    href: "https://github.com/Voldigoade",
    name: "GitHub",
    description: "Public software projects and source-linked research",
  },
  {
    href: "https://voldigoade.xyz",
    name: "Portfolio",
    description: "Main portfolio, writing and project documentation",
  },
  {
    href: "https://github.com/Voldigoade/spoor",
    name: "Spoor",
    description:
      "Terminal-first GitHub public-footprint inspection tool in Rust",
  },
  {
    href: "https://github.com/Voldigoade/crucksware",
    name: "Crucksware",
    description: "Semantic firmware diff and triage in Rust",
  },
  {
    href: "https://github.com/Voldigoade/recherche-messageries",
    name: "Recherche Messageries",
    description:
      "Source-based research comparing secure messaging architectures",
  },
];
