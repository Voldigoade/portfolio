"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { SignInButton } from "@/components/layout/sign-in-button";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/retroui/Button";
import { Menu } from "@/components/retroui/icons";
import { getCopy, type Locale } from "@/lib/site-copy";
import { cn } from "@/lib/utils";

function getAlternateUrl(currentPath: string, targetLocale: Locale): string {
  const isEn = currentPath === "/en" || currentPath.startsWith("/en/");

  if (targetLocale === "en") {
    if (isEn) return currentPath;
    if (currentPath === "/") return "/en";
    return `/en${currentPath}`;
  }

  // target is French
  if (!isEn) return currentPath;
  if (currentPath === "/en") return "/";
  return currentPath.replace(/^\/en/, "") || "/";
}

export function Navbar({ locale }: { locale?: Locale }) {
  const pathname = usePathname() || "/";
  const [open, setOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  // Determine current active locale from pathname or prop
  const currentLocale: Locale =
    pathname === "/en" || pathname.startsWith("/en/") ? "en" : locale || "fr";

  const copy = getCopy(currentLocale);
  const [frHref, setFrHref] = useState(() => getAlternateUrl(pathname, "fr"));
  const [enHref, setEnHref] = useState(() => getAlternateUrl(pathname, "en"));

  // Check if page specifies custom alternate link (e.g. translated blog article)
  useEffect(() => {
    const frAlternate = document
      .querySelector('link[rel="alternate"][hreflang="fr"]')
      ?.getAttribute("href");
    const enAlternate = document
      .querySelector('link[rel="alternate"][hreflang="en"]')
      ?.getAttribute("href");

    if (frAlternate) {
      try {
        setFrHref(new URL(frAlternate).pathname);
      } catch {
        setFrHref(getAlternateUrl(pathname, "fr"));
      }
    } else {
      setFrHref(getAlternateUrl(pathname, "fr"));
    }

    if (enAlternate) {
      try {
        setEnHref(new URL(enAlternate).pathname);
      } catch {
        setEnHref(getAlternateUrl(pathname, "en"));
      }
    } else {
      setEnHref(getAlternateUrl(pathname, "en"));
    }
  }, [pathname]);

  const homeHref = currentLocale === "en" ? "/en" : "/";

  const isCurrent = (href: string) => {
    if (href === "/" || href === "/en") {
      return pathname === href;
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const languageSwitcher = (
    // biome-ignore lint/a11y/useSemanticElements: interactive toggle button group
    <div
      className="inline-flex items-center border-4 border-black bg-muted p-0.5 shadow-retro-sm font-mono text-xs font-black uppercase"
      role="group"
      aria-label={
        currentLocale === "fr" ? "Sélecteur de langue" : "Language selector"
      }
    >
      <Link
        href={frHref}
        className={cn(
          "px-2 py-1 transition text-center",
          currentLocale === "fr"
            ? "border-2 border-black bg-primary text-primary-foreground font-black shadow-retro-xs"
            : "text-muted-foreground hover:text-foreground",
        )}
        aria-current={currentLocale === "fr" ? "true" : undefined}
        aria-label="Version française"
      >
        FR
      </Link>
      <span
        className="px-1 text-black/40 dark:text-white/40 font-bold select-none"
        aria-hidden="true"
      >
        |
      </span>
      <Link
        href={enHref}
        className={cn(
          "px-2 py-1 transition text-center",
          currentLocale === "en"
            ? "border-2 border-black bg-primary text-primary-foreground font-black shadow-retro-xs"
            : "text-muted-foreground hover:text-foreground",
        )}
        aria-current={currentLocale === "en" ? "true" : undefined}
        aria-label="English version"
      >
        EN
      </Link>
    </div>
  );

  return (
    <header className="fixed top-0 z-50 w-full border-b-4 border-black bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-20 w-full max-w-6xl items-center justify-between gap-4 px-4">
        <Link
          href={homeHref}
          className="border-4 border-black bg-accent px-3 py-2 text-sm font-black text-accent-foreground tracking-wide shadow-retro sm:text-base"
        >
          {copy.nav.brand}
        </Link>

        <nav
          aria-label={
            currentLocale === "fr" ? "Navigation principale" : "Main navigation"
          }
          className="hidden items-center gap-2 md:flex"
        >
          {copy.nav.items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isCurrent(item.href) ? "page" : undefined}
              className={cn(
                "border-4 border-black px-3 py-2 text-sm font-black uppercase tracking-wide shadow-retro transition hover:translate-x-1 hover:translate-y-1 hover:shadow-none",
                isCurrent(item.href)
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-card-foreground",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          {languageSwitcher}

          <div className="hidden md:flex md:items-center md:gap-2">
            <SignInButton className="h-11 border-4 border-black px-4 font-black uppercase shadow-retro-sm" />
          </div>

          <ThemeToggle />

          <Button
            variant="secondary"
            size="icon"
            className="md:hidden h-11 w-11"
            onClick={() => setOpen((v) => !v)}
            ref={menuButtonRef}
            aria-label={open ? copy.nav.closeMenu : copy.nav.openMenu}
            aria-expanded={open}
            aria-controls="mobile-navigation"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-navigation"
            aria-label={
              currentLocale === "fr" ? "Navigation mobile" : "Mobile navigation"
            }
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                setOpen(false);
                menuButtonRef.current?.focus();
              }
            }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="border-t-4 border-black bg-background p-4 md:hidden"
          >
            <div className="grid gap-2">
              <SignInButton className="w-full justify-center uppercase" />
              {copy.nav.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={isCurrent(item.href) ? "page" : undefined}
                  className={cn(
                    "border-4 border-black px-3 py-2 text-center text-sm font-black uppercase shadow-retro",
                    isCurrent(item.href)
                      ? "bg-primary text-primary-foreground"
                      : "bg-card text-card-foreground",
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
