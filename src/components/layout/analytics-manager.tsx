"use client";

import { useEffect, useState } from "react";
import { CloudflareAnalytics } from "./cloudflare-analytics";
import { GoogleAnalytics } from "./google-analytics";

export const VOLDIGOADE_CONSENT_KEY = "voldigoade_cookie_consent";
export const VOLDIGOADE_CONSENT_EVENT = "voldigoade_consent_updated";
export const VOLDIGOADE_MANAGE_COOKIES_EVENT = "voldigoade_manage_cookies";

interface AnalyticsManagerProps {
  gaId?: string;
  cfToken?: string;
}

export function AnalyticsManager({ gaId, cfToken }: AnalyticsManagerProps) {
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
      {hasGoogleConsent && gaId ? <GoogleAnalytics gaId={gaId} /> : null}
    </>
  );
}
