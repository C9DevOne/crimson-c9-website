# CrimsonC9 — Payload CMS Content Overview

_Prepared for Nick — database/collection planning reference_  
_Last updated: June 2026_

---

## How to Read This Document

Each section maps to a **Payload Collection** (a repeatable content type, like a database table with rows) or a **Global** (a singleton — one record that always exists, like site settings). For each, the fields are listed with their type and any important notes.

**Field type key:**

| Type           | What it is                                                                                                                       |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `text`         | Single line of text                                                                                                              |
| `textarea`     | Multi-line plain text                                                                                                            |
| `richText`     | Rich text editor (bold, links, embeds etc)                                                                                       |
| `number`       | Numeric value                                                                                                                    |
| `date`         | Date/time picker                                                                                                                 |
| `select`       | Dropdown with fixed options                                                                                                      |
| `checkbox`     | True/false toggle                                                                                                                |
| `image`        | Image upload — artists upload via Payload UI; a Payload upload hook pushes the file to Backblaze B2 and stores the resulting URL |
| `array`        | Repeatable group of fields                                                                                                       |
| `relationship` | Link to another collection (like a foreign key)                                                                                  |
| `url`          | Plain URL string                                                                                                                 |

---

## Collections

Collections are the repeatable content types. Think of each one as a database table.

---

### 1. Artists

**Route:** `/artists/[slug]`  
**Who edits:** Individual artists update their own entries only — scoped access control enforced. Developers manage the schema.  
**Volume:** ~5–15 records to start, grows slowly.

| Field             | Type              | Notes                                                      |
| ----------------- | ----------------- | ---------------------------------------------------------- |
| `name`            | `text`            | Display name, e.g. "Ace9"                                  |
| `slug`            | `text`            | Auto-generated from name. Becomes the URL: `/artists/ace9` |
| `status`          | `select`          | `active` / `inactive` — controls visibility on roster page |
| `role`            | `text`            | e.g. "Resident DJ", "Live Act", "Visual Artist"            |
| `shortBio`        | `textarea`        | 1–2 sentences shown on hover overlay on roster page        |
| `fullBio`         | `richText`        | Long-form bio for individual artist page                   |
| `profileImage`    | `image`           | Primary portrait — stored in Backblaze B2                  |
| `headerImage`     | `image`           | Optional full-width banner for individual page             |
| `genres`          | `array` of `text` | Tags like "Hard Techno", "Industrial", "Melodic"           |
| `email`           | `text`            | Booking contact — can be hidden from public display        |
| `socials`         | `array`           | Repeatable rows of `{ platform: select, url: text }`       |
| `soundcloudEmbed` | `url`             | SoundCloud profile or featured set URL                     |
| `spotifyEmbed`    | `url`             | Spotify artist page or playlist URL                        |
| `featuredMix`     | `url`             | YouTube or SoundCloud embed URL for homepage feature       |
| `order`           | `number`          | Manual sort order on roster page                           |
| `publishedAt`     | `date`            | When the artist page goes live                             |

**Notes for Nick:**

- `socials` is an array so artists can add as many platforms as they need without us hardcoding Instagram/SoundCloud fields.
- `email` should be a restricted field — visible in the CMS but not exposed raw in the public API. Frontend can render a contact form that sends to it server-side instead.
- `slug` should be unique-constrained at the database level.
- Image fields (`profileImage`, `headerImage`) use Payload's built-in upload UI. A Payload `afterChange` hook handles pushing the file to Backblaze B2 and storing the resulting URL — artists never need to touch Backblaze directly.

---

### 2. Events

**Route:** `/events` (listing) + `/events/[slug]` (individual archive pages, future)  
**Who edits:** Aaron or designated team member, possibly an events manager later.  
**Volume:** Grows continuously — this becomes the permanent archive.

| Field                | Type               | Notes                                                                                    |
| -------------------- | ------------------ | ---------------------------------------------------------------------------------------- |
| `title`              | `text`             | Event name, e.g. "Spitfire Vol. 3"                                                       |
| `slug`               | `text`             | Auto-generated. Used for archive page URL                                                |
| `status`             | `select`           | `upcoming` / `past` / `cancelled` / `draft`                                              |
| `date`               | `date`             | Event date and time                                                                      |
| `venue`              | `text`             | Venue name                                                                               |
| `city`               | `text`             | City                                                                                     |
| `description`        | `richText`         | Event description, atmosphere notes                                                      |
| `coverImage`         | `image`            | Primary promo image — Backblaze B2                                                       |
| `gallery`            | `array` of `image` | Event photos — each pointing to Backblaze B2                                             |
| `lineup`             | `array`            | Repeatable rows of `{ artist: relationship(Artists), startTime: text, setType: select }` |
| `ticketUrl`          | `url`              | Link to Weeztix or other ticket provider                                                 |
| `residentAdvisorUrl` | `url`              | RA event listing link                                                                    |
| `aftermovieUrl`      | `url`              | YouTube embed URL                                                                        |
| `recordings`         | `array`            | Repeatable rows of `{ label: text, url: url }` — SoundCloud sets, mixes etc              |
| `promoMaterials`     | `array` of `url`   | Links to downloadable promo assets                                                       |
| `tags`               | `array` of `text`  | e.g. "Outdoor", "Club Night", "Festival"                                                 |
| `publishedAt`        | `date`             | Controls when event appears on site                                                      |

**Notes for Nick:**

- `lineup` uses a `relationship` to the Artists collection — so if an artist updates their name or profile, it reflects everywhere automatically. Each lineup row should support both a `relationship` to Artists _and_ a plain text `guestName` field — one or the other is used depending on whether the act is a CrimsonC9 resident or an external guest.
- `status` field drives the frontend logic: `upcoming` events show in the upcoming section, `past` events feed the archive.
- Image uploads (coverImage, gallery) go through Payload's upload UI with an `afterChange` hook pushing to Backblaze B2, consistent with the Artists collection.

---

### 3. Releases

**Route:** `/music` (listing page)  
**Who edits:** Aaron or music lead.  
**Volume:** Low — grows as releases happen.

| Field           | Type           | Notes                                             |
| --------------- | -------------- | ------------------------------------------------- |
| `title`         | `text`         | Release name                                      |
| `slug`          | `text`         | Auto-generated                                    |
| `type`          | `select`       | `track` / `ep` / `album` / `podcast-episode`      |
| `releaseDate`   | `date`         |                                                   |
| `artist`        | `relationship` | Links to Artists collection — can be multi-artist |
| `coverArt`      | `image`        | Backblaze B2                                      |
| `description`   | `richText`     | Notes about the release                           |
| `soundcloudUrl` | `url`          |                                                   |
| `spotifyUrl`    | `url`          |                                                   |
| `youtubeUrl`    | `url`          | For visualisers, sets                             |
| `isFeatured`    | `checkbox`     | Pin to top of music page or homepage              |
| `publishedAt`   | `date`         |                                                   |

---

### 4. Posts (Broadcast / News)

**Route:** `/broadcast`  
**Who edits:** Any team member — this is the editorial/free-form layer.  
**Volume:** Irregular — announcements, updates, longer editorial pieces.

| Field         | Type              | Notes                                                     |
| ------------- | ----------------- | --------------------------------------------------------- |
| `title`       | `text`            |                                                           |
| `slug`        | `text`            | Auto-generated                                            |
| `category`    | `select`          | `announcement` / `news` / `editorial` / `community`       |
| `author`      | `relationship`    | Links to Artists collection or a separate Team collection |
| `coverImage`  | `image`           | Backblaze B2                                              |
| `excerpt`     | `textarea`        | Short summary shown in listing                            |
| `content`     | `richText`        | Full post content — rich editor with embed support        |
| `tags`        | `array` of `text` |                                                           |
| `isFeatured`  | `checkbox`        |                                                           |
| `publishedAt` | `date`            |                                                           |
| `status`      | `select`          | `draft` / `published`                                     |

---

### 5. Collaboration Requests (Connect Page Form)

**Route:** Submissions from `/connect` form  
**Who edits:** Nobody edits — these are incoming submissions, read-only in CMS.  
**Volume:** Low — inbound enquiries.

| Field         | Type       | Notes                                               |
| ------------- | ---------- | --------------------------------------------------- |
| `name`        | `text`     |                                                     |
| `email`       | `text`     |                                                     |
| `type`        | `select`   | `booking` / `collaboration` / `volunteer` / `other` |
| `message`     | `textarea` |                                                     |
| `submittedAt` | `date`     | Auto-set on creation                                |
| `status`      | `select`   | `new` / `in-review` / `responded` / `archived`      |

**Notes for Nick:**

- This collection is write-only from the public API (form submissions), read-only in the CMS dashboard. No public GET endpoint needed.
- A Payload `afterChange` hook should fire on every new submission and send a notification email to hello@crimsonc9.com. The form does **not** email directly — submissions go into the database first, so without the hook they'd sit there silently. Hook is confirmed required.
- Role-based access: only admins (Aaron, Nick) should be able to read and update submission `status`. Artists have no access to this collection.

---

## Globals

Globals are singleton records — not a list of things, just one configuration object that always exists.

---

### 1. Site Settings

| Field             | Type       | Notes                      |
| ----------------- | ---------- | -------------------------- |
| `siteName`        | `text`     | "CrimsonC9"                |
| `tagline`         | `text`     | "Change Through Music"     |
| `metaDescription` | `textarea` | Default SEO description    |
| `ogImage`         | `image`    | Default social share image |
| `contactEmail`    | `text`     | hello@crimsonc9.com        |

---

### 2. Social Links

| Field               | Type  | Notes |
| ------------------- | ----- | ----- |
| `instagram`         | `url` |       |
| `soundcloud`        | `url` |       |
| `youtube`           | `url` |       |
| `spotify`           | `url` |       |
| `whatsappCommunity` | `url` |       |
| `residentAdvisor`   | `url` |       |

**Why a Global and not hardcoded:** If a URL ever changes (new RA profile, new Spotify page), one person updates it in the CMS and it reflects everywhere on the site — nav, footer, connect page — without a code deployment.

---

### 3. Homepage Featured Content

Controls the dynamic/editorial parts of the homepage without requiring a code change.

| Field             | Type           | Notes                              |
| ----------------- | -------------- | ---------------------------------- |
| `featuredArtist`  | `relationship` | Artist shown in homepage spotlight |
| `featuredEvent`   | `relationship` | Upcoming event to highlight        |
| `featuredRelease` | `relationship` | Track or release to feature        |
| `heroHeadline`    | `text`         | Optional override for hero text    |
| `heroSubtext`     | `textarea`     | Optional supporting copy           |

---

## Relationships Summary

This diagram shows how the collections connect:

```
Artists ←──────── Events (lineup field)
Artists ←──────── Releases (artist field)
Artists ←──────── Posts (author field)

Homepage Global ──→ Artists (featured)
Homepage Global ──→ Events (featured)
Homepage Global ──→ Releases (featured)
```

---

## What Lives Outside the CMS

For clarity — some things are intentionally _not_ in the CMS:

| Content                           | Where it lives                         | Why                                                                |
| --------------------------------- | -------------------------------------- | ------------------------------------------------------------------ |
| Logo, icons, static brand assets  | `/public` in repo                      | Never changes — no CMS needed                                      |
| Font files                        | `layout.tsx` via `next/font`           | Code-level, not editorial                                          |
| Actual media files (images/video) | Backblaze B2 (via Payload upload hook) | Artists upload through Payload UI; hook pushes to B2 automatically |
| Public video (aftermovies, sets)  | YouTube/SoundCloud                     | CMS stores the embed URL only                                      |
| User auth / accounts              | Supabase                               | Future feature, separate system                                    |
| Shop / merch                      | Stripe + future build                  | Out of current scope                                               |

---

## Resolved Decisions

These were open questions — all now confirmed:

1. **Media uploads:** Artists upload images directly through Payload's UI. A Payload `afterChange` hook pushes the file to Backblaze B2 and stores the URL. Artists never interact with Backblaze directly.

2. **Guest artists on lineups:** Each lineup row supports both a `relationship` to the Artists collection (for residents) and a plain text `guestName` fallback (for external acts). Nick to implement as a conditional field or union type in the schema.

3. **Access control:** Artists have scoped access — they can only read and edit their own Artist record. Admins (Aaron, Nick) have full CMS access. This should be configured from the start using Payload's built-in access control functions, not retrofitted later.

4. **Contact form notifications:** A Payload `afterChange` hook on the Collaboration Requests collection sends an email to hello@crimsonc9.com on every new submission. The form does not email directly — the hook is required or submissions are invisible.

---

_Hand this to Nick alongside the AI_CONTEXT.md for full project context._
