import Script from "next/script";

type GoogleAnalyticsProps = {
  gaId: string;
};

export function GoogleAnalytics({ gaId }: GoogleAnalyticsProps) {
  if (!/^G-[A-Z0-9]+$/.test(gaId)) {
    return null;
  }
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="lazyOnload"
      />
      <Script id="ga-init" strategy="lazyOnload">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${gaId}', {
  anonymize_ip: true,
  allow_google_signals: false,
  allow_ad_personalization_signals: false,
  restricted_data_processing: true,
  page_location: window.location.origin + window.location.pathname
});`}
      </Script>
    </>
  );
}
