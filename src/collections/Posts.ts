import type { CollectionConfig } from "payload";

export const Posts: CollectionConfig = {
  slug: "posts",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "category", "status", "publishedAt"],
    description: "Broadcast / News — editorial updates and announcements.",
  },
  access: {
    read: ({ req }) => {
      // Published posts are public; drafts only visible to logged-in users
      if (req.user) return true;
      return {
        status: { equals: "published" },
      };
    },
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
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
      defaultValue: "draft",
      options: [
        { label: "Draft", value: "draft" },
        { label: "Published", value: "published" },
      ],
      admin: { position: "sidebar" },
    },
    {
      name: "category",
      type: "select",
      required: true,
      label: "Category",
      options: [
        { label: "Announcement", value: "announcement" },
        { label: "News", value: "news" },
        { label: "Editorial", value: "editorial" },
        { label: "Community", value: "community" },
      ],
      admin: { position: "sidebar" },
    },
    {
      name: "isFeatured",
      type: "checkbox",
      label: "Featured",
      defaultValue: false,
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

    // ── Author ────────────────────────────────────────────────────────────────
    {
      name: "author",
      type: "relationship",
      relationTo: "artists",
      label: "Author",
      admin: { description: "Links to the Artists collection." },
    },

    // ── Content ───────────────────────────────────────────────────────────────
    {
      name: "coverImage",
      type: "upload",
      relationTo: "media",
      label: "Cover Image",
    },
    {
      name: "excerpt",
      type: "textarea",
      label: "Excerpt",
      admin: { description: "Short summary shown in post listings." },
    },
    {
      name: "content",
      type: "richText",
      label: "Content",
      admin: { description: "Full post content — rich editor with embed support." },
    },

    // ── Tags ──────────────────────────────────────────────────────────────────
    {
      name: "tags",
      type: "array",
      label: "Tags",
      fields: [{ name: "tag", type: "text", required: true }],
    },
  ],
};
