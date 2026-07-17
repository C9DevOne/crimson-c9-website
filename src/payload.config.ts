import { buildConfig } from "payload";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
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

// Globals
import { SiteSettings } from "./globals/SiteSettings";
import { SocialLinks } from "./globals/SocialLinks";
import { HomepageFeatured } from "./globals/HomepageFeatured";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

// Resolve the canonical server URL:
// - On Vercel: NEXT_PUBLIC_SERVER_URL is set manually in the dashboard (preferred)
// - Fallback: VERCEL_URL is auto-set by Vercel (no https prefix, so we add it)
// - Local dev: localhost:3000
const serverURL =
  process.env.NEXT_PUBLIC_SERVER_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

export default buildConfig({
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
  collections: [Users, Artists, Events, Releases, Posts, CollaborationRequests, Media],

  // All globals
  globals: [SiteSettings, SocialLinks, HomepageFeatured],

  // Rich text editor
  editor: lexicalEditor(),

  // Postgres adapter — DATABASE_URI must be set in environment
  // In production (Vercel): use the Transaction pooler URL from Supabase (port 6543)
  // In local dev: use the Session mode URL (port 5432) or Transaction pooler
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || "",
    },
    // In production, migrations are run via the Vercel build command.
    // In dev, push:true lets Payload sync schema changes without generating migration files.
    push: process.env.NODE_ENV === "development",
  }),

  // TypeScript type generation output
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },

  // Secret for JWT signing — PAYLOAD_SECRET must be set in environment
  secret: process.env.PAYLOAD_SECRET || "",

  // Upload storage directory (local dev only).
  // On Vercel the filesystem is ephemeral — wire up Backblaze B2 storage adapter
  // via @payloadcms/storage-s3 before going live with media uploads.
  upload: {
    limits: {
      fileSize: 10_000_000, // 10MB
    },
  },
});
