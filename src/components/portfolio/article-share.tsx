"use client";

import { useEffect, useRef, useState } from "react";
import type { WritingLocale } from "@/lib/blog";
import { cn } from "@/lib/utils";

interface ArticleShareProps {
  title: string;
  summary: string;
  canonicalUrl: string;
  locale?: WritingLocale;
  className?: string;
}

export function ArticleShare({
  title,
  summary,
  canonicalUrl,
  locale = "fr",
  className,
}: ArticleShareProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const shareLabel = locale === "en" ? "Share" : "Partager";
  const copyLinkLabel = locale === "en" ? "Copy link" : "Copier le lien";
  const copiedLabel = locale === "en" ? "Link copied" : "Lien copié";

  const handleShareClick = async () => {
    // Mobile / Web Share API check
    if (
      typeof navigator !== "undefined" &&
      typeof navigator.share === "function"
    ) {
      try {
        await navigator.share({
          title,
          text: summary,
          url: canonicalUrl,
        });
        return;
      } catch (err) {
        if ((err as Error).name === "AbortError") {
          return;
        }
        // Fall back to menu if Web Share fails
      }
    }

    setMenuOpen((prev) => !prev);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(canonicalUrl);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        setMenuOpen(false);
      }, 1800);
    } catch (err) {
      console.warn("Failed to copy link to clipboard:", err);
    }
  };

  useEffect(() => {
    if (!menuOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        buttonRef.current?.focus();
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  const xShareUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(canonicalUrl)}`;
  const whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${title} ${canonicalUrl}`)}`;
  const linkedinShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(canonicalUrl)}`;

  return (
    <div className={cn("relative inline-block text-left", className)}>
      <button
        ref={buttonRef}
        type="button"
        onClick={handleShareClick}
        aria-haspopup="true"
        aria-expanded={menuOpen}
        aria-label={shareLabel}
        className="inline-flex items-center gap-2 border-2 border-black bg-card px-3 py-1 font-mono text-xs font-black uppercase text-card-foreground shadow-retro-xs transition hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none active:translate-x-1 active:translate-y-1 focus-visible:outline-2 focus-visible:outline-primary cursor-pointer select-none"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
          <polyline points="16 6 12 2 8 6" />
          <line x1="12" y1="2" x2="12" y2="15" />
        </svg>
        <span>{shareLabel}</span>
      </button>

      {menuOpen && (
        <div
          ref={menuRef}
          role="menu"
          aria-label={shareLabel}
          className="absolute right-0 z-50 mt-2 w-48 border-4 border-black bg-card p-1 shadow-retro font-mono text-xs font-bold animate-in fade-in zoom-in-95 duration-100"
        >
          <a
            role="menuitem"
            href={xShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2 text-foreground hover:bg-primary hover:text-primary-foreground transition border-b-2 border-black/10"
          >
            <span aria-hidden="true">𝕏</span>
            <span>X / Twitter</span>
          </a>
          <a
            role="menuitem"
            href={whatsappShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2 text-foreground hover:bg-primary hover:text-primary-foreground transition border-b-2 border-black/10"
          >
            <span aria-hidden="true">💬</span>
            <span>WhatsApp</span>
          </a>
          <a
            role="menuitem"
            href={linkedinShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2 text-foreground hover:bg-primary hover:text-primary-foreground transition border-b-2 border-black/10"
          >
            <span aria-hidden="true">💼</span>
            <span>LinkedIn</span>
          </a>
          <button
            role="menuitem"
            type="button"
            onClick={handleCopyLink}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-foreground hover:bg-accent hover:text-accent-foreground transition cursor-pointer"
          >
            <span aria-hidden="true">🔗</span>
            <span>{copied ? copiedLabel : copyLinkLabel}</span>
          </button>
        </div>
      )}
    </div>
  );
}
