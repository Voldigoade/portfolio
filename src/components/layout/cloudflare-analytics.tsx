import Script from "next/script";

type CloudflareAnalyticsProps = {
  token: string;
};

export function CloudflareAnalytics({ token }: CloudflareAnalyticsProps) {
  if (!/^[a-f0-9]{32}$/i.test(token.trim())) {
    return null;
  }

  const beaconPayload = JSON.stringify({ token: token.trim() });

  return (
    <Script
      type="module"
      defer
      src="https://static.cloudflareinsights.com/beacon.min.js"
      data-cf-beacon={beaconPayload}
      strategy="lazyOnload"
    />
  );
}
