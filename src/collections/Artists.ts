import type { CollectionConfig } from "payload";
import { isAdminOrEditor } from "../access";

export const Artists: CollectionConfig = {
  slug: "artists",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "role", "status", "publishedAt"],
    description:
      "CrimsonC9 resident artists and performers. Artists can only edit their own record.",
  },
  access: {
    // Public read for published/active artists
    read: () => true,
    create: isAdminOrEditor,
    // Admins and editors can update any profile; artists can update their own
    update: ({ req }) => {
      const user = req.user;
      if (!user) return false;
      if (user.role === "admin" || user.role === "editor") return true;
      if (user.role === "artist") {
        return {
          user: {
            equals: user.id,
          },
        };
      }
      return false;
    },
    delete: isAdminOrEditor,
  },
  fields: [
    // ── Identity ──────────────────────────────────────────────────────────────
    {
      name: "name",
      type: "text",
      required: true,
      label: "Display Name",
      admin: { description: 'e.g. "Ace9"' },
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      label: "Slug",
      admin: {
        description: "URL-safe identifier — auto-generated from name. e.g. ace9",
        position: "sidebar",
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (!value && data?.name) {
              return (data.name as string)
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)/g, "");
            }
            return value;
          },
        ],
      },
    },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "active",
      options: [
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" },
      ],
      admin: { position: "sidebar" },
    },
    {
      name: "role",
      type: "text",
      label: "Role",
      admin: { description: 'e.g. "Resident DJ", "Live Act", "Visual Artist"' },
    },

    // ── Bio ───────────────────────────────────────────────────────────────────
    {
      name: "shortBio",
      type: "textarea",
      label: "Short Bio",
      admin: {
        description: "1–2 sentences shown on hover overlay on the roster page.",
      },
    },
    {
      name: "fullBio",
      type: "richText",
      label: "Full Bio",
      admin: {
        description: "Long-form bio for the individual artist page.",
      },
    },

    // ── Media ─────────────────────────────────────────────────────────────────
    {
      name: "profileImage",
      type: "upload",
      relationTo: "media",
      label: "Profile Image",
      admin: { description: "Primary portrait." },
    },
    {
      name: "headerImage",
      type: "upload",
      relationTo: "media",
      label: "Header Image",
      admin: { description: "Optional full-width banner for the artist page." },
    },

    // ── Tags & Contact ────────────────────────────────────────────────────────
    {
      name: "genres",
      type: "array",
      label: "Genres",
      admin: { description: 'e.g. "Hard Techno", "Industrial", "Melodic"' },
      fields: [
        {
          name: "genre",
          type: "text",
          required: true,
        },
      ],
    },
    {
      name: "email",
      type: "email",
      label: "Booking Email",
      admin: {
        description: "Booking contact — visible in CMS but not exposed in the public API.",
      },
      access: {
        // Only admins can read the raw email; public API never sees it
        read: ({ req }) => Boolean(req.user),
      },
    },

    // ── Social & Music ────────────────────────────────────────────────────────
    {
      name: "socials",
      type: "array",
      label: "Social Links",
      admin: {
        description: "Add as many social platforms as needed.",
      },
      fields: [
        {
          name: "platform",
          type: "select",
          required: true,
          options: [
            { label: "Instagram", value: "instagram" },
            { label: "SoundCloud", value: "soundcloud" },
            { label: "Spotify", value: "spotify" },
            { label: "YouTube", value: "youtube" },
            { label: "Resident Advisor", value: "residentadvisor" },
            { label: "Bandcamp", value: "bandcamp" },
            { label: "Mixcloud", value: "mixcloud" },
            { label: "TikTok", value: "tiktok" },
            { label: "Facebook", value: "facebook" },
            { label: "X / Twitter", value: "twitter" },
            { label: "Other", value: "other" },
          ],
        },
        {
          name: "url",
          type: "text",
          required: true,
          label: "URL",
        },
      ],
    },
    {
      name: "soundcloudEmbed",
      type: "text",
      label: "SoundCloud Profile or Featured Set URL",
    },
    {
      name: "spotifyEmbed",
      type: "text",
      label: "Spotify Artist or Playlist URL",
    },
    {
      name: "featuredMix",
      type: "text",
      label: "Featured Mix URL",
      admin: {
        description: "YouTube or SoundCloud embed URL for homepage feature.",
      },
    },

    // ── Admin ─────────────────────────────────────────────────────────────────
    {
      name: "order",
      type: "number",
      label: "Sort Order",
      admin: {
        description: "Manual sort order on the roster page. Lower = earlier.",
        position: "sidebar",
      },
      access: {
        create: isAdminOrEditor,
        update: isAdminOrEditor,
      },
    },
    {
      name: "publishedAt",
      type: "date",
      label: "Published At",
      admin: {
        description: "When the artist page goes live.",
        position: "sidebar",
        date: { pickerAppearance: "dayAndTime" },
      },
    },
    {
      name: "user",
      type: "relationship",
      relationTo: "users",
      label: "Linked User Account",
      admin: {
        description:
          "The CMS user account associated with this artist, allowing them to edit their own profile.",
        position: "sidebar",
      },
      access: {
        create: isAdminOrEditor,
        update: isAdminOrEditor,
      },
    },
  ],
};
