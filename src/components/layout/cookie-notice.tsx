"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/retroui/Button";
import {
  VOLDIGOADE_CONSENT_EVENT,
  VOLDIGOADE_CONSENT_KEY,
  VOLDIGOADE_MANAGE_COOKIES_EVENT,
} from "./analytics-manager";

export function CookieNotice() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(VOLDIGOADE_CONSENT_KEY);
      if (stored !== "accepted" && stored !== "dismissed") {
        setVisible(true);
      }
    } catch {
      setVisible(true);
    }

    const handleManageCookies = () => {
      setVisible(true);
    };

    window.addEventListener(
      VOLDIGOADE_MANAGE_COOKIES_EVENT,
      handleManageCookies,
    );

    return () => {
      window.removeEventListener(
        VOLDIGOADE_MANAGE_COOKIES_EVENT,
        handleManageCookies,
      );
    };
  }, []);

  const accept = () => {
    try {
      window.localStorage.setItem(VOLDIGOADE_CONSENT_KEY, "accepted");
      window.dispatchEvent(new Event(VOLDIGOADE_CONSENT_EVENT));
    } catch {
      // storage unavailable
    }
    setVisible(false);
  };

  const dismiss = () => {
    try {
      window.localStorage.setItem(VOLDIGOADE_CONSENT_KEY, "dismissed");
      window.dispatchEvent(new Event(VOLDIGOADE_CONSENT_EVENT));
    } catch {
      // storage unavailable
    }
    setVisible(false);
  };

  if (!visible) {
    return null;
  }

  return (
    <div
      className="fixed bottom-2 right-2 z-50 border-4 border-black bg-card p-4 shadow-retro-lg sm:bottom-4 sm:right-4 sm:w-full sm:max-w-xl"
      role="dialog"
      aria-live="polite"
      aria-label="Mesure d'audience et cookies"
    >
      <p className="font-display text-lg uppercase tracking-wide">
        Mesure d&apos;audience
      </p>
      <p className="mt-2 text-sm font-medium leading-relaxed">
        Ce site utilise des métriques respectueuses de la vie privée et une
        mesure d&apos;audience optionnelle. Google Analytics n&apos;est activé
        qu&apos;avec votre accord explicite.
      </p>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
        <Button
          onClick={accept}
          className="w-full border-4 border-black uppercase shadow-retro-sm sm:w-auto"
        >
          Accepter
        </Button>
        <Button
          onClick={dismiss}
          variant="secondary"
          className="w-full border-4 border-black uppercase shadow-retro-sm sm:w-auto"
        >
          Refuser
        </Button>
        <Link
          href="/privacy-policy"
          className="retro-link block w-full text-center sm:w-auto"
        >
          Politique de confidentialité
        </Link>
      </div>
    </div>
  );
}
