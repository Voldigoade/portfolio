---
title: "Spoor: Terminal-First GitHub Footprint Inspection"
slug: "spoor-github-footprint-inspection"
summary: "Architectural overview of Spoor, a Rust tool designed to audit public GitHub surface areas via CLI, HTTP and Server-Sent Events."
type: "Project Log"
tags: ["Rust", "CLI", "OSINT", "Security", "GitHub"]
publishedAt: "2026-10-15"
draft: false
---

# Spoor: Terminal-First GitHub Footprint Inspection

When reviewing personal or organizational public exposure on GitHub, the default web interface scatters useful signals across dozens of sub-pages: commit author email addresses, unlinked public keys, orphaned repository forks, and event streams.

Spoor was created to inspect these signals from the command line and structured programmatic interfaces without relying on third-party analytical intermediaries.

## Design Goals

1. **Local and direct**: Queries the public GitHub REST and GraphQL APIs directly using standard client credentials or unauthenticated public endpoints.
2. **Streaming feedback**: Real-time inspection progress delivered over terminal terminal-widgets or HTTP Server-Sent Events (SSE).
3. **Structured reports**: Machine-readable JSON output conformant to report schema 1.1, alongside human-readable summaries.
4. **Zero credential leakage**: All analysis is computed in-process; tokens never travel to unexpected telemetry endpoints.

```rust
// Core runner configuration
pub struct SpoorRunner {
    client: GitHubClient,
    options: AnalysisOptions,
    reporter: Box<dyn ProgressReporter>,
}

impl SpoorRunner {
    pub async fn inspect_target(&self, target: &Target) -> Result<Report, SpoorError> {
        self.reporter.send_phase("Fetching public activity");
        let events = self.client.fetch_public_events(target).await?;
        
        self.reporter.send_phase("Analyzing commit signatures");
        let signatures = analyze_commit_footprint(&events);
        
        Ok(Report::new(target, signatures))
    }
}
```

## SSE Streaming and Client Hydration

For web integrations, Spoor exposes an HTTP daemon with an SSE endpoint. The client connects using standard EventSource:

```typescript
const stream = new EventSource(`/api/spoor/stream?user=${username}`);
stream.onmessage = (event) => {
  const update = JSON.parse(event.data);
  console.log(`Phase: ${update.phase} (${update.progress}%)`);
};
```

If connection drops occur, polling fallback recovers the final report from the server-side job cache.
