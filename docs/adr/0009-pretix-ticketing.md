# ADR-0009: Pretix as Ticketing Platform (Replacing Weeztix)

**Status:** Proposed — leading candidate, not yet accepted
**Date:** 2026-06 (context corrected 2026-08)
**Deciders:** Aaron, Nick

## Context

**Weeztix** was used to ticket the collective's most recent event — a genuine success — run as a temporary single-page "Bunker Dreams" portal at the site's root. The shared Navbar, Sidebar, and Footer were removed from the root layout, and every other route (artists, events, music, connect, about, contact, imprint, support, terms) was disabled by renaming its folder with a `_` prefix, so the site operated purely as a ticket portal for the duration of the event. Resident Advisor served as the discovery channel alongside it; Weeztix handled the actual sale.

It was always understood as a stopgap rather than a platform choice. With the event over, that portal is now stale and scheduled for removal (see `WORKING_LOG.md`). A permanent ticketing solution is needed going forward, and — consistent with the project's ownership philosophy — a self-hosted option is preferred over continuing with a third-party managed platform.

## Decision

**Not yet finalized.** Current leading candidate: **Pretix**, self-hosted on a separate subdomain (`tickets.crimsonc9.com`), on infrastructure yet to be finalized (Railway, Hetzner, or DigitalOcean — tracked in `WORKING_LOG.md`). Whatever platform is ultimately chosen, the ticket widget will be embedded into `/events` rather than linking out — that part of the decision is settled regardless of which platform sits behind it, so the site's visual identity holds through the purchase flow.

## Alternatives Considered

- **Continuing with Weeztix** — already proven to work, zero additional setup required. Ruled out for the same reason as any managed SaaS: it cedes both data ownership and fee structure to a third party, in tension with the project's core philosophy. It also isn't a workable long-term pattern — running the entire site as a single-page portal per event isn't sustainable once the prototype's other pages exist.
- **A different managed ticketing SaaS** (e.g. Eventbrite-style platforms) — same fundamental trade-off as Weeztix.
- **Resident Advisor as primary sales channel** — already available, but was never intended as more than discovery; kept in that role only.

## Consequences

- **Positive:** GDPR-native, self-hosted, no per-ticket platform fee, and the embedded widget keeps the purchase flow visually consistent with the rest of the site.
- **Negative:** Requires standing up and maintaining a separate server — genuine operational surface a managed SaaS wouldn't require. Deployment isn't complete yet. There's no urgency pressure from a ticketing standpoint (the last event sold successfully without this infrastructure existing), but the site can't return to full multi-page operation until either Pretix is live or another interim step covers the gap.
