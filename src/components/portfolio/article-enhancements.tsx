"use client";

import { useEffect } from "react";
import type { WritingLocale } from "@/lib/blog";

interface ArticleEnhancementsProps {
  locale?: WritingLocale;
}

export function ArticleEnhancements({
  locale = "fr",
}: ArticleEnhancementsProps) {
  useEffect(() => {
    const handleCopyClick = async (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;

      const button = target.closest<HTMLButtonElement>(".copy-code-button");
      if (!button) return;

      const encodedCode = button.dataset.code;
      if (!encodedCode) return;

      const labelSpan = button.querySelector<HTMLSpanElement>(".copy-label");
      const originalLabel = labelSpan ? labelSpan.textContent : null;
      const copiedLabel = locale === "en" ? "Copied" : "Copié";

      try {
        const rawCode = decodeURIComponent(encodedCode);
        await navigator.clipboard.writeText(rawCode);

        if (labelSpan) {
          labelSpan.textContent = copiedLabel;
        }
        button.setAttribute("data-copied", "true");

        setTimeout(() => {
          if (labelSpan && originalLabel) {
            labelSpan.textContent = originalLabel;
          }
          button.removeAttribute("data-copied");
        }, 2000);
      } catch (err) {
        console.warn("Failed to copy code to clipboard:", err);
      }
    };

    document.addEventListener("click", handleCopyClick);
    return () => {
      document.removeEventListener("click", handleCopyClick);
    };
  }, [locale]);

  return null;
}
