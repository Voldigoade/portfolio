export const DEFAULT_SITE_URL = "https://voldigoade.xyz";

function normalizeSiteUrl(rawUrl: string): string {
  const normalized = rawUrl.startsWith("http") ? rawUrl : `https://${rawUrl}`;

  try {
    const parsed = new URL(normalized);
    parsed.pathname = "/";
    parsed.search = "";
    parsed.hash = "";
    return parsed.toString().replace(/\/$/, "");
  } catch {
    return DEFAULT_SITE_URL;
  }
}

export const siteUrl = normalizeSiteUrl(
  process.env.NEXT_PUBLIC_SITE_URL ?? process.env.SITE_URL ?? DEFAULT_SITE_URL,
);

export const siteHost = new URL(`${siteUrl}/`).host;

export const siteName = "Voldigoade";
export const githubUser = "Voldigoade";
export const githubUrl = "https://github.com/Voldigoade";

// Technical project references
export const spoorUrl = "https://github.com/Voldigoade/spoor";
export const rechercheMessageriesUrl =
  "https://github.com/Voldigoade/recherche-messageries";
export const ideResearchUrl = "https://github.com/Voldigoade/ide-research";
export const crukstUrl = "https://github.com/Voldigoade/crukst";

// Public profile destination for the link hub
export const linkHubUrl = githubUrl;
export const ogImageUrl = `${siteUrl}/opengraph-image`;
