import type { CollectionConfig } from "payload";

export const Users: CollectionConfig = {
  slug: "users",
  admin: {
    useAsTitle: "email",
    defaultColumns: ["email", "role"],
    description: "CMS admin users — Aaron, Nick, and any future admins.",
  },
  auth: true, // enables Payload's built-in auth (login, JWT, sessions)
  fields: [
    {
      name: "role",
      type: "select",
      required: true,
      defaultValue: "admin",
      options: [
        { label: "Admin (full access)", value: "admin" },
        { label: "Editor (content only)", value: "editor" },
      ],
      admin: { position: "sidebar" },
    },
  ],
};
