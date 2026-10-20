"use client";

import { useEffect } from "react";

interface ArticleNavbarSyncProps {
  translationSlug?: string;
}

export function ArticleNavbarSync({ translationSlug }: ArticleNavbarSyncProps) {
  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("article-translation-sync", {
        detail: { translationSlug },
      }),
    );
  }, [translationSlug]);

  return null;
}
