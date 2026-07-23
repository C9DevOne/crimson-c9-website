import type { CollectionConfig } from "payload";
import { isAdminOrEditor } from "../access";

export const Releases: CollectionConfig = {
  slug: "releases",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "type", "releaseDate", "isFeatured"],
    description: "Tracks, EPs, albums, and podcast episodes.",
  },
  access: {
    read: () => true,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      label: "Release Title",
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      label: "Slug",
      admin: { position: "sidebar" },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (!value && data?.title) {
              return (data.title as string)
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
      name: "type",
      type: "select",
      required: true,
      label: "Type",
      options: [
        { label: "Track", value: "track" },
        { label: "EP", value: "ep" },
        { label: "Album", value: "album" },
        { label: "Podcast Episode", value: "podcast-episode" },
      ],
      admin: { position: "sidebar" },
    },
    {
      name: "isFeatured",
      type: "checkbox",
      label: "Featured",
      defaultValue: false,
      admin: {
        description: "Pin to top of the music page or homepage.",
        position: "sidebar",
      },
    },
    {
      name: "releaseDate",
      type: "date",
      label: "Release Date",
      admin: {
        position: "sidebar",
        date: { pickerAppearance: "dayOnly" },
      },
    },
    {
      name: "publishedAt",
      type: "date",
      label: "Published At",
      admin: {
        position: "sidebar",
        date: { pickerAppearance: "dayAndTime" },
      },
    },

    // ── Artists ───────────────────────────────────────────────────────────────
    {
      name: "artist",
      type: "relationship",
      relationTo: "artists",
      hasMany: true,
      label: "Artist(s)",
      admin: { description: "Can be multi-artist." },
    },

    // ── Media ─────────────────────────────────────────────────────────────────
    {
      name: "coverArt",
      type: "upload",
      relationTo: "media",
      label: "Cover Art",
    },
    {
      name: "description",
      type: "richText",
      label: "Description",
      admin: { description: "Notes about the release." },
    },

    // ── Links ─────────────────────────────────────────────────────────────────
    {
      name: "soundcloudUrl",
      type: "text",
      label: "SoundCloud URL",
    },
    {
      name: "spotifyUrl",
      type: "text",
      label: "Spotify URL",
    },
    {
      name: "youtubeUrl",
      type: "text",
      label: "YouTube URL",
      admin: { description: "For visualisers, sets." },
    },
  ],
};
