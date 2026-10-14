import type { APIRoute } from 'astro';
import { locales, route, type Page } from '../data/locales';

export const GET: APIRoute = ({ site }) => {
  const pages: Page[] = ['home', 'project', 'privacy'];
  const entries = pages
    .flatMap((page) =>
      locales.map((locale) => {
        const alternates = locales
          .map(
            (lang) =>
              `<xhtml:link rel="alternate" hreflang="${lang}" href="${new URL(route(lang, page), site)}"/>`,
          )
          .join('');
        return `<url><loc>${new URL(route(locale, page), site)}</loc>${alternates}<xhtml:link rel="alternate" hreflang="x-default" href="${new URL(route('fr', page), site)}"/></url>`;
      }),
    )
    .join('');
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${entries}</urlset>`,
    { headers: { 'Content-Type': 'application/xml' } },
  );
};
