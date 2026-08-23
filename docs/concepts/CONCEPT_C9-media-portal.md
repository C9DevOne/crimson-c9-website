# CrimsonC9 — Concept: C9 Media Portal

_Contributor-facing intake, plus the team's browse/filter/review interface for all event and project media. Sits on top of the storage architecture in `CONCEPT_media-pipeline.md` — same bucket, same retention mechanic, extended rather than duplicated._

_Status: Current — 2026-08-23 — first full spec, ready to build against._

---

## Decisions log

| Date        | Decision                                                                                                                                                                                                               | Why                                                                                                                                                |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| 28 Jul 2026 | Name: **C9 Media Portal**                                                                                                                                                                                              | Covers intake, review, project organisation, and delivery in one system                                                                            |
| 28 Jul 2026 | **One `Assets` collection, one `stage` field** (Intake / Working / Archive / Delivered)                                                                                                                                | Replaces three separate systems with one interface and a filter                                                                                    |
| 28 Jul 2026 | Upload threshold: **5 GB per file**                                                                                                                                                                                    | Above this, contributor uses external transfer (SwissTransfer/WeTransfer) and pastes the link                                                      |
| 28 Jul 2026 | Aaron generates and shares intake links; no separate permission system needed for v1                                                                                                                                   | Simplest correct answer at team size                                                                                                               |
| 28 Jul 2026 | **No reviewer assignment** — everyone on the team can browse and filter everything themselves                                                                                                                          | Removes a whole subsystem; avoids the failure mode of forgetting to assign someone who needed access                                               |
| 28 Jul 2026 | Retention uses **one mechanic everywhere**: anyone can flag an item, plus a per-stage age cap as a fallback, both funnel to the same human-confirmed digest → trash → hard-delete flow already defined for RAW masters | Consistent with removing reviewer assignment — no separate confirmation-tracking system needed                                                     |
| 28 Jul 2026 | **Consent is asked only of guests**, not artists/videographers who already have a standing relationship with C9                                                                                                        | Artists/videographers are covered by their existing working relationship; guests are the actual open question                                      |
| 28 Jul 2026 | Notifications: **email**, expected to stay the mechanism as the team scales                                                                                                                                            | Simple hook, no reason to replace it at foreseeable team sizes                                                                                     |
| 28 Jul 2026 | External transfer links: **manual expiry entry + reminder**, no automated tracking                                                                                                                                     | We don't control that storage, so we can't detect its expiry — a human enters what the contributor told us                                         |
| 28 Jul 2026 | **In-line video playback ships in v1**; thumbnail grid is deferred to v1.1                                                                                                                                             | Playback needs no processing (signed URL + range requests); thumbnails need a background image/frame-extraction step that `clientUploads` bypasses |
| 28 Jul 2026 | Artist self-serve accounts: **not in v1**                                                                                                                                                                              | Team shares relevant material manually for now; revisit if that becomes a bottleneck                                                               |

---

## 1. What it is

One `Assets` collection in Payload. Every piece of media — a phone clip fresh off an event, a working project file, an archived master, a finished YouTube-bound export — is a row in the same table, distinguished only by its `stage`. One interface reads that collection and filters on `stage` (plus event, role, type). This is what makes "intake review," "project organisation," and "archive browsing" the same feature instead of three.

Moving between stages is a **metadata change, not a file move.** The object stays wherever it was uploaded; only the `stage` field updates. The one exception is deletion — the only step where bytes actually relocate is the move into `trash/` ahead of hard-delete.

## 2. Contributor flow

1. **Receive the link** — generated per event by Aaron on the Event record in Payload admin, shared however's natural (WhatsApp, email). No account, no signup.
2. **Fill in details** — name, role (Artist / Videographer / Photographer / Guest), footage type (Handheld / Multicam / Photo / Audio / Other), free-text notes.
3. **Consent — guests only.** If role = Guest, two extra fields appear:
   - _"Can we use your footage for social media?"_ — yes/no
   - If yes: _"Where and how should we credit you?"_ — platform(s) + name/handle
     Artists and videographers skip this entirely — their working relationship with C9 already covers it.
4. **Pick upload path by size** — under ~5 GB: upload directly in the form. Over that: paste a SwissTransfer/WeTransfer link, plus a rough expiry date if known.
5. **Upload and confirm** — progress bar for direct uploads (keep the tab open), then a plain thank-you screen.

## 3. Team flow — the interface

A page behind existing team logins (reuses Payload auth, no new auth system):

- **Filter**: event, role, type, stage, storage location
- **Sort**: newest first (default), or by size
- **Search**: contributor name, filename, notes
- **Row actions**: download (signed URL) or open external link; watch inline where the codec allows; move to next stage; flag for deletion
- **Notification**: an email fires on new submission; the interface also shows an unreviewed count per event

No thumbnail grid in v1 — a well-labelled table with working playback covers the actual problem (findability) without the extra processing pipeline thumbnails require.

## 4. Schema — `Assets` collection

| Field                                                 | Notes                                                                      |
| ----------------------------------------------------- | -------------------------------------------------------------------------- |
| `key`                                                 | B2 object key, immutable. Empty if `storageLocation = external`            |
| `title`                                               | Human label                                                                |
| `event`                                               | Relation to Events                                                         |
| `contributor`                                         | Name                                                                       |
| `role`                                                | Artist / Videographer / Photographer / Guest                               |
| `type`                                                | Handheld / Multicam / Photo / Audio / Other                                |
| `stage`                                               | Intake / Working / Archive / Delivered                                     |
| `storageLocation`                                     | `b2` / `external`                                                          |
| `externalUrl`, `externalProvider`, `externalExpiry`   | Only when `storageLocation = external`                                     |
| `size`                                                | Bytes                                                                      |
| `notes`                                               | Free text                                                                  |
| `consentGranted`, `consentPlatforms`, `consentCredit` | Only populated when `role = Guest`                                         |
| `retention`                                           | `keep` / `flagged-for-deletion` — settable by anyone                       |
| `deleteAfter`                                         | Auto-set when flagged, or by the stage's age cap                           |
| `downloaded`                                          | Delivered-stage only: someone has a personal backup of the finished export |
| `postedUrl`                                           | Delivered-stage only: set once live on YouTube                             |

## 5. Retention — one mechanic, every stage

Same pattern as the RAW-master policy in `CONCEPT_media-pipeline.md`, now covering intake too instead of needing its own system:

1. **Trigger**: either someone manually flags an item, or its stage's age cap passes with nothing flagged:
   - Intake, unclaimed: **60 days**
   - Working masters, flagged RAW: **~90 days** (as already decided)
   - Delivered exports: countdown starts only once _both_ `downloaded` and `postedUrl` are set, then **30 days**
2. **Digest email** (GitHub Actions cron) lists what's due — never deletes automatically
3. **Human confirms** → object moves to `trash/`
4. **B2 lifecycle rule** hard-deletes from `trash/` after a further 30-day grace period

External-transfer items skip this entirely for the delete step — they're not our storage, they simply expire on the provider's own schedule. Our job there is only the reminder ahead of the entered expiry date.

## 6. Big files, still the same answer

Files over 5 GB never enter B2 at all — contributor uploads to SwissTransfer/WeTransfer themselves and the Portal stores the link plus a manually-entered expiry. This keeps genuinely large multicam material out of paid storage entirely unless someone actively pulls something from it, which is the real cost lever here, more than any storage vendor choice.

## 7. Build notes

- **Bucket CORS needs `GET` as well as `PUT`.** Uploads need `PUT`; in-line playback needs `GET` on the same origin, or the video silently fails to load.
- **Signed URLs for playback need a generous expiry** (hours, not minutes) — a timeout mid-watch just stops playback with no clear error.
- **Codec limits are real but mostly self-solving.** Browsers decode H.264/H.265 fine; some RAW/pro codecs won't play at all. The footage most likely to hit that wall (genuine multicam RAW) is exactly the footage that lives on an external link, reviewed in that service's own player — not in ours.
- **`clientUploads` skips Payload's built-in image processing**, which is why thumbnails are a deferred, separate piece of work (background resize/frame-extraction) rather than something that comes for free.
- **Object keys are always system-generated**, never derived from the original filename — this is what makes three people all uploading `IMG_0001.MOV` a non-issue.

## 8. Explicitly not in v1

- Reviewer assignment (removed by decision, not just deferred)
- Thumbnail grid (deferred to v1.1)
- Artist self-serve accounts (deferred until manual sharing is actually a bottleneck)
- Automated external-link expiry detection (manual entry + reminder instead)

## 9. Open — defaults proposed, confirm or adjust

1. **Age caps above (60 / 90 / 30 days)** — reasonable defaults, easy to tune later; flag if any feel wrong for how the team actually works.
2. **Intake link lifetime** — proposed default: stays open 30 days post-event, closable manually if needed sooner. Not yet confirmed.
3. **Expired/invalid link behaviour** — should show a plain "this link isn't active" message rather than a raw error. Small UI detail, worth remembering at build time.

## Related files

- `CONCEPT_media-pipeline.md` — underlying B2/Payload architecture, bucket setup, and the retention mechanic this doc extends rather than duplicates.
