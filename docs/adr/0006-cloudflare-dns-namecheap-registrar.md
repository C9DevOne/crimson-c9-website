# ADR-0006: Cloudflare for DNS/CDN, Namecheap as Registrar Only

**Status:** Accepted
**Date:** 2026-04
**Deciders:** Aaron

## Context

The project needed domain registration and DNS management. The team wanted these decoupled from each other for portability, and a CDN layer was also useful for a visually heavy site.

## Decision

**Namecheap holds the domain registration only** — no hosting, no DNS. **Cloudflare handles DNS and CDN**, and incidentally enables free egress from Backblaze B2 via the Bandwidth Alliance partnership (see ADR-0004).

## Alternatives Considered

- **Keep DNS at Namecheap directly** — simpler, single-provider setup, but forgoes Cloudflare's CDN and the B2 egress cost benefit, and is harder to migrate away from later if needed.
- **AWS Route 53** — capable, but unnecessary complexity and cost given the project has no other AWS infrastructure to justify it.

## Consequences

- **Positive:** Domain registration and DNS are independently portable — the project isn't locked into one provider for both. The B2 egress benefit is a direct cost win.
- **Negative:** One additional account/dashboard to manage. DNS changes must be made carefully to avoid disrupting Zoho Mail (`hello@crimsonc9.com`), which depends on correct MX records staying intact.

---

## Update — 2026-11-22: DNS only, proxy off

Still Cloudflare, but with the orange cloud **off** on every record, which is now load-bearing rather than incidental. Caddy terminates TLS on the Hetzner box and obtains its own Let's Encrypt certificates; a proxied record would both break the ACME challenge and put Cloudflare's certificate in front of ours.

So the "CDN" half of this ADR is not in use, and nor is the Bandwidth Alliance egress argument — that only mattered for B2, which was never wired (ADR-0004). What remains is DNS, which is still a good reason to be here.

Records: `crimsonc9.com`, `www` and `staging` are A records to the server; `tickets` and `staging.tickets` likewise, for the shop.
