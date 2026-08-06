import type { CollectionConfig } from "payload";
import { isAdminOrEditor } from "../access";

export const Events: CollectionConfig = {
  slug: "events",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "date", "city", "status"],
    description: "CrimsonC9 events — upcoming and archive. This collection grows continuously.",
  },
  access: {
    read: () => true,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  fields: [
    // ── Identity ──────────────────────────────────────────────────────────────
    {
      name: "title",
      type: "text",
      required: true,
      label: "Event Name",
      admin: { description: 'e.g. "Spitfire Vol. 3"' },
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
      name: "status",
      type: "select",
      required: true,
      defaultValue: "upcoming",
      options: [
        { label: "Upcoming", value: "upcoming" },
        { label: "Past", value: "past" },
        { label: "Cancelled", value: "cancelled" },
        { label: "Draft", value: "draft" },
      ],
      admin: { position: "sidebar" },
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

    // ── Event Details ─────────────────────────────────────────────────────────
    {
      name: "date",
      type: "date",
      required: true,
      label: "Event Date & Time",
      admin: { date: { pickerAppearance: "dayAndTime" } },
    },
    {
      name: "venue",
      type: "text",
      label: "Venue",
    },
    {
      name: "city",
      type: "text",
      label: "City",
    },
    {
      name: "description",
      type: "richText",
      label: "Description",
      admin: { description: "Event description and atmosphere notes." },
    },

    // ── Media ─────────────────────────────────────────────────────────────────
    {
      name: "coverImage",
      type: "upload",
      relationTo: "media",
      label: "Cover Image",
      admin: { description: "Primary promo image." },
    },
    {
      name: "gallery",
      type: "array",
      label: "Photo Gallery",
      admin: { description: "Event photos." },
      fields: [
        {
          name: "image",
          type: "upload",
          relationTo: "media",
          required: true,
        },
        {
          name: "caption",
          type: "text",
          label: "Caption",
        },
      ],
    },

    // ── Lineup ────────────────────────────────────────────────────────────────
    {
      name: "lineup",
      type: "array",
      label: "Lineup",
      admin: {
        description: "Use Artist relationship for residents; use Guest Name for external acts.",
      },
      fields: [
        {
          name: "artist",
          type: "relationship",
          relationTo: "artists",
          label: "Artist (Resident)",
          admin: {
            description: "Link to a CrimsonC9 resident artist.",
            condition: (_, siblingData) => !siblingData?.guestName,
          },
        },
        {
          name: "guestName",
          type: "text",
          label: "Guest Name",
          admin: {
            description: "Name of an external guest act — use instead of the Artist relationship.",
            condition: (_, siblingData) => !siblingData?.artist,
          },
        },
        {
          name: "startTime",
          type: "text",
          label: "Start Time",
          admin: { description: 'e.g. "23:00"' },
        },
        {
          name: "setType",
          type: "select",
          label: "Set Type",
          options: [
            { label: "DJ Set", value: "dj-set" },
            { label: "Live Act", value: "live" },
            { label: "B2B", value: "b2b" },
            { label: "Visual / VJ", value: "visual" },
            { label: "Opening", value: "opening" },
            { label: "Closing", value: "closing" },
          ],
        },
      ],
    },

    // ── Links & Externals ─────────────────────────────────────────────────────
    {
      name: "ticketUrl",
      type: "text",
      label: "Ticket URL",
      admin: { description: "Link to Weeztix or other ticket provider." },
    },
    {
      name: "residentAdvisorUrl",
      type: "text",
      label: "Resident Advisor URL",
      admin: { description: "RA event listing link." },
    },
    {
      name: "aftermovieUrl",
      type: "text",
      label: "Aftermovie URL",
      admin: { description: "YouTube embed URL." },
    },
    {
      name: "recordings",
      type: "array",
      label: "Recordings",
      admin: { description: "SoundCloud sets, mixes, etc." },
      fields: [
        { name: "label", type: "text", required: true, label: "Label" },
        { name: "url", type: "text", required: true, label: "URL" },
      ],
    },
    {
      name: "promoMaterials",
      type: "array",
      label: "Promo Materials",
      admin: { description: "Links to downloadable promo assets." },
      fields: [{ name: "url", type: "text", required: true, label: "URL" }],
    },

    // ── Tags ──────────────────────────────────────────────────────────────────
    {
      name: "tags",
      type: "array",
      label: "Tags",
      admin: { description: 'e.g. "Outdoor", "Club Night", "Festival"' },
      fields: [{ name: "tag", type: "text", required: true }],
    },
  ],
};
