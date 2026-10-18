import Script from "next/script";

type CloudflareAnalyticsProps = {
  token: string;
};

export function CloudflareAnalytics({ token }: CloudflareAnalyticsProps) {
  if (!token || token.trim() === "") {
    return null;
  }

  const beaconPayload = JSON.stringify({ token: token.trim() });

  return (
    <Script
      defer
      src="https://static.cloudflareinsights.com/beacon.min.js"
      data-cf-beacon={beaconPayload}
      strategy="lazyOnload"
    />
  );
}
