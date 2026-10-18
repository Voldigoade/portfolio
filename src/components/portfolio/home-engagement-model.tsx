"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/retroui/Button";
import { Card } from "@/components/retroui/Card";
import { getCopy, type Locale } from "@/lib/site-copy";

export function HomeEngagementModel({ locale }: { locale?: Locale }) {
  const pathname = usePathname() || "/";
  const currentLocale: Locale =
    pathname === "/en" || pathname.startsWith("/en/") ? "en" : locale || "fr";

  const copy = getCopy(currentLocale).home.domains;
  const allProjectsHref = currentLocale === "en" ? "/en/project" : "/project";

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="font-display text-3xl uppercase sm:text-4xl">
          {copy.title}
        </h2>
        <Button
          asChild
          variant="secondary"
          className="w-full sm:w-auto uppercase"
        >
          <Link href={allProjectsHref}>{copy.viewAll}</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {copy.items.map((item) => (
          <Card
            key={item.title}
            className="flex h-full flex-col border-4 border-black bg-card shadow-retro-md"
          >
            <Card.Header>
              <Card.Title className="font-display text-2xl uppercase">
                {item.title}
              </Card.Title>
              <Card.Description className="text-sm leading-relaxed sm:text-base">
                {item.summary}
              </Card.Description>
            </Card.Header>
            <Card.Content className="flex flex-1 flex-col justify-between gap-4">
              <ul className="space-y-2">
                {item.bullets.map((bullet) => (
                  <li
                    key={bullet}
                    className="border-l-4 border-black pl-3 text-sm font-medium leading-relaxed"
                  >
                    {bullet}
                  </li>
                ))}
              </ul>
              <div className="pt-2">
                <Button
                  asChild
                  variant="secondary"
                  className="w-full border-4 border-black font-black uppercase shadow-retro-sm"
                >
                  <Link
                    href={item.href}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    {currentLocale === "en"
                      ? "View on GitHub"
                      : "Voir sur GitHub"}
                  </Link>
                </Button>
              </div>
            </Card.Content>
          </Card>
        ))}
      </div>
    </section>
  );
}
