"use client";

import { useEffect, useState } from "react";
import { CloudflareAnalytics } from "./cloudflare-analytics";
import { GoogleAnalytics } from "./google-analytics";
import { GoogleTagManager } from "./google-tag-manager";

export const VOLDIGOADE_CONSENT_KEY = "voldigoade_cookie_consent";
export const VOLDIGOADE_CONSENT_EVENT = "voldigoade_consent_updated";

interface AnalyticsManagerProps {
  gaId?: string;
  gtmId?: string;
  cfToken?: string;
}

export function AnalyticsManager({
  gaId,
  gtmId,
  cfToken,
}: AnalyticsManagerProps) {
  const [hasGoogleConsent, setHasGoogleConsent] = useState(false);

  useEffect(() => {
    const checkConsent = () => {
      try {
        const stored = window.localStorage.getItem(VOLDIGOADE_CONSENT_KEY);
        setHasGoogleConsent(stored === "accepted");
      } catch {
        setHasGoogleConsent(false);
      }
    };

    checkConsent();

    const handleConsentEvent = () => checkConsent();
    window.addEventListener(VOLDIGOADE_CONSENT_EVENT, handleConsentEvent);
    window.addEventListener("storage", handleConsentEvent);

    return () => {
      window.removeEventListener(VOLDIGOADE_CONSENT_EVENT, handleConsentEvent);
      window.removeEventListener("storage", handleConsentEvent);
    };
  }, []);

  return (
    <>
      {cfToken ? <CloudflareAnalytics token={cfToken} /> : null}
      {hasGoogleConsent && gtmId ? <GoogleTagManager gtmId={gtmId} /> : null}
      {hasGoogleConsent && gaId ? <GoogleAnalytics gaId={gaId} /> : null}
    </>
  );
}
