# ADR-0002: Payload CMS Instead of Sanity

**Status:** Accepted (supersedes earlier plan to use Sanity)
**Date:** 2026-05
**Deciders:** Aaron, Nick

## Context

The project needed a headless CMS for Artists, Events, Releases, Posts, and Collaboration Requests. The initial plan used Sanity. As the project's "own your data, own your stack" philosophy solidified, the team reconsidered: Sanity is a hosted SaaS product where content lives inside Sanity's proprietary datastore, accessed via their API — the project would be renting access to its own content. Nick also brought hands-on prior experience with Payload, lowering the risk of switching.

## Decision

Use **Payload CMS**, self-hosted and code-first: collections are defined as TypeScript files in the project's own repo, and content is stored in the project's **own Postgres database** (see ADR-0003), not a third-party store.

## Alternatives Considered

- **Sanity** — excellent editing experience and DX, but content is locked inside Sanity's own datastore. Migrating away later would mean a full export/import process, and ongoing cost scales with usage on their terms.
- **Strapi** — also self-hostable and was seriously considered, but Payload's TypeScript-native design and tighter integration with the Next.js/S3 media pipeline, combined with Nick's existing familiarity, made it the stronger fit.
- **Contentful** — same vendor lock-in concern as Sanity; ruled out for the same reason.

## Consequences

- **Positive:** Full ownership of content data — nothing about the site's content depends on a third party staying in business or keeping pricing stable. Payload's native S3-compatible storage adapter directly enabled the Backblaze B2 media pipeline (ADR-0004).
- **Negative:** Self-hosting a CMS means the team owns more of the operational surface — schema migrations, admin authentication, upgrades — that a managed SaaS CMS would otherwise handle. This trade was accepted as consistent with the project's ownership philosophy.
