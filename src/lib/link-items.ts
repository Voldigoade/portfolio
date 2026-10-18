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
    href: "https://github.com/Voldigoade/recherche-messageries",
    name: "Recherche Messageries",
    description:
      "Source-driven comparative research into secure messaging architectures",
  },
  {
    href: "https://github.com/Voldigoade/ide-research",
    name: "IDE Research",
    description:
      "Comparison of developer environments, AI tooling and architectures",
  },
  {
    href: "https://github.com/Voldigoade/crukst",
    name: "Crukst",
    description: "Experimental Rust foundation for planned firmware comparison",
  },
];
