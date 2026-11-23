# Vendored webfonts

These files are served from our own origin instead of being fetched from Google. See
CRI-21 for why: `next/font/google` downloads them **at build time**, which made every CI
run and every Docker build depend on `fonts.googleapis.com`. That dependency failed on
2026-11-22, went red on `main`, skipped the deploy and left the site serving a 502.

A second reason, smaller but real: visitors no longer make a request to `fonts.gstatic.com`
just by opening the page, so there is no third-party font request to account for in the
privacy policy.

## What is here

| File                                   | Family            | Weight  | Source                                            |
| -------------------------------------- | ----------------- | ------- | ------------------------------------------------- |
| `DMSans-Variable-latin.woff2`          | DM Sans           | 400–700 | Google Fonts `dmsans` v17, latin subset           |
| `Philosopher-Regular-latin.woff2`      | Philosopher       | 400     | Google Fonts `philosopher` v21, latin subset      |
| `Philosopher-Bold-latin.woff2`         | Philosopher       | 700     | Google Fonts `philosopher` v21, latin subset      |
| `CinzelDecorative-Regular-latin.woff2` | Cinzel Decorative | 400     | Google Fonts `cinzeldecorative` v19, latin subset |
| `CinzelDecorative-Bold-latin.woff2`    | Cinzel Decorative | 700     | Google Fonts `cinzeldecorative` v19, latin subset |

**Latin subset only**, which is exactly what `subsets: ["latin"]` already restricted us to
before this change, so nothing that renders is different. It covers Latin-1 Supplement, so
German umlauts and ß are included. Cyrillic and Greek are not — Philosopher ships them
upstream, and if the site ever needs them the subset files have to be added back here
deliberately rather than appearing by magic.

DM Sans is one variable file covering the whole 400–700 range, which is why the weight count
and the file count do not line up.

**Cinzel Decorative is the hero headline and nothing else** (CRI-22). It is a display face,
unreadable below about 24px, so it is wired to `--font-hero` and used on one element rather
than to `--font-display`, which Philosopher carries. It is also the only family here loaded
with `preload: false`: used once, preloading it would cost the first paint more than it buys.

## Updating them

There is no automation, and that is the point — a build that cannot reach Google is the
problem this solves. To take a newer version, fetch the CSS with a modern browser
User-Agent (Google serves older formats otherwise), pick the `@font-face` block whose
`unicode-range` contains `U+0000-00FF`, and download the `.woff2` it names:

```
curl -A "<a modern browser UA>" \
  "https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400..700&display=swap"
```

Then update the version in the table above.

## Licence

All three families are licensed under the SIL Open Font License 1.1. Serving the files is
redistribution, so the full licence text ships alongside them: `OFL-DMSans.txt`,
`OFL-Philosopher.txt` and `OFL-CinzelDecorative.txt`. None may be sold on its own, and each keeps its reserved name.
