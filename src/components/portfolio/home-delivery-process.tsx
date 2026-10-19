"use client";

import { usePathname } from "next/navigation";
import { Card } from "@/components/retroui/Card";
import { getCopy, type Locale } from "@/lib/site-copy";

export function HomeDeliveryProcess({ locale }: { locale?: Locale }) {
  const pathname = usePathname() || "/";
  const currentLocale: Locale =
    pathname === "/en" || pathname.startsWith("/en/") ? "en" : locale || "fr";

  const copy = getCopy(currentLocale).home.workflow;

  return (
    <section className="space-y-4">
      <h2 className="font-display text-3xl uppercase sm:text-4xl">
        {copy.title}
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {copy.steps.map((step, index) => (
          <Card
            key={step.title}
            className="h-full border-4 border-black bg-card shadow-retro-md"
          >
            <Card.Header>
              <p className="retro-badge w-max text-[10px] sm:text-xs">
                {currentLocale === "en"
                  ? `Step ${index + 1}`
                  : `Étape ${index + 1}`}
              </p>
              <Card.Title className="mt-2 font-display text-2xl uppercase">
                {step.title}
              </Card.Title>
            </Card.Header>
            <Card.Content>
              <p className="font-medium leading-relaxed">{step.description}</p>
            </Card.Content>
          </Card>
        ))}
      </div>
    </section>
  );
}
