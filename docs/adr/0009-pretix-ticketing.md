# ADR-0009: Pretix as Ticketing Platform (Replacing Weeztix)

**Status:** Rejected 2026-11 — **superseded by a custom Stripe shop**
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

---

## Update — 2026-11: Pretix was not chosen

Ticketing is a **custom Next.js application** at `tickets.crimsonc9.com`, repo `C9DevOne/c9-tickets`, taking payment through Stripe Checkout. The go/no-go against a Pretix fallback was TIC-17; the custom shop won and is built.

Two parts of this ADR did survive, and one did not:

- **Self-hosted and GDPR-native** — held. The shop runs on the same Hetzner box, with its own Postgres.
- **A separate subdomain** — held, `tickets.crimsonc9.com`.
- **"The ticket widget will be embedded into `/events` rather than linking out"** — **not held.** The shop is a separate application on a separate subdomain, so there is no widget to embed. `crimsonc9.com` links out to it. The visual-consistency goal behind that sentence is being met instead by building the shop in the C9 look (TIC-7), which is a better answer than an iframe would have been.

The deployment-target question this ADR left open (Railway / Hetzner / DigitalOcean) was settled by the same move: Hetzner.
