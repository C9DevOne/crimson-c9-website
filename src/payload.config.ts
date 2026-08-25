import { buildConfig } from "payload";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { s3Storage } from "@payloadcms/storage-s3";
import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";

// Collections
import { Users } from "./collections/Users";
import { Artists } from "./collections/Artists";
import { Events } from "./collections/Events";
import { Releases } from "./collections/Releases";
import { Posts } from "./collections/Posts";
import { CollaborationRequests } from "./collections/CollaborationRequests";
import { Media } from "./collections/Media";
import { UniqueVisitors } from "./collections/UniqueVisitors";

// Globals
import { SiteSettings } from "./globals/SiteSettings";
import { SocialLinks } from "./globals/SocialLinks";
import { HomepageFeatured } from "./globals/HomepageFeatured";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

// Fail fast with an actionable message in local dev, instead of a cryptic Payload
// internal error surfacing later, deep inside whichever route first calls getPayload().
// Guarded to non-production so this can never affect a Vercel build or deploy — Next
// sets NODE_ENV=production for every deployed build (Preview and Production alike),
// regardless of which Vercel Environment it is.
if (process.env.NODE_ENV !== "production") {
  const missing = ["DATABASE_URI", "PAYLOAD_SECRET"].filter((name) => !process.env[name]);
  if (missing.length > 0) {
    throw new Error(
      `Missing required env var(s): ${missing.join(", ")}.\n` +
        `Copy .env.example to .env.local and fill them in, or run \`vercel env pull .env.local\` ` +
        `to pull real values from the team's Vercel project.`,
    );
  }
}

// Resolve the canonical server URL:
// - On Vercel: NEXT_PUBLIC_SERVER_URL is set manually in the dashboard (preferred)
// - Fallback: VERCEL_URL is auto-set by Vercel (no https prefix, so we add it)
// - Local dev: localhost:3000
const serverURL =
  process.env.NEXT_PUBLIC_SERVER_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

export default buildConfig({
  // Image resizer adapter required by Payload for media image resizing
  sharp,

  // Canonical URL — required for CORS, email links, and media URLs to work in production
  serverURL,

  // Admin panel configuration
  admin: {
    user: "users",
    meta: {
      titleSuffix: "— CrimsonC9 CMS",
    },
  },

  // All collections
  collections: [
    Users,
    Artists,
    Events,
    Releases,
    Posts,
    CollaborationRequests,
    Media,
    UniqueVisitors,
  ],

  // All globals
  globals: [SiteSettings, SocialLinks, HomepageFeatured],

  // Rich text editor
  editor: lexicalEditor(),

  // Postgres adapter — DATABASE_URI must be set in environment
  // In production (Vercel): use the Transaction pooler URL from Supabase (port 6543) via DATABASE_URI
  // In local dev: use DATABASE_URI_DEV (or fallback to DATABASE_URI)
  db: postgresAdapter({
    pool: {
      connectionString:
        (process.env.NODE_ENV === "development"
          ? process.env.DATABASE_URI_DEV || process.env.DATABASE_URI
          : process.env.DATABASE_URI) || "",
    },
    // Migrations are deliberately NOT run from the Vercel build command — builds fire on
    // every push including previews, run concurrently, and happen for code that never ships.
    // A failed build is harmless; a half-applied migration is not. Run them deliberately.
    // See docs/WORKING_LOG.md and docs/TRAP_LORE.md.
    //
    // push:true lets Payload sync schema changes in dev without generating migration files.
    // It alters whatever database DATABASE_URI points at, directly and without prompting —
    // so make sure that is NOT production before running `npm run dev`.
    push: process.env.NODE_ENV === "development",
  }),

  // TypeScript type generation output
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },

  // Secret for JWT signing — PAYLOAD_SECRET must be set in environment
  secret: process.env.PAYLOAD_SECRET || "",

  // Plugins — Backblaze B2 media storage via S3 adapter
  plugins: [
    s3Storage({
      collections: {
        media: {
          prefix: "media",
        },
      },
      bucket: process.env.S3_BUCKET || "",
      clientUploads: true,
      signedDownloads: {
        expiresIn: 7200, // 2 hours
      },
      config: {
        endpoint: process.env.S3_ENDPOINT,
        region: process.env.S3_REGION,
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID || "",
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || "",
        },
        forcePathStyle: true,
      },
      // When S3 credentials are not configured (e.g. offline dev), fallback to local storage
      enabled: Boolean(process.env.S3_BUCKET && process.env.S3_ACCESS_KEY_ID),
    }),
  ],

  // Upload storage directory / fallback limits
  upload: {
    limits: {
      fileSize: 50_000_000, // 50MB for server uploads; clientUploads handles larger files direct to B2
    },
  },
});
