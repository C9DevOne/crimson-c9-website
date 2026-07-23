import type { CollectionConfig } from "payload";
import { isAdmin, isAdminFieldLevel } from "../access";

export const Users: CollectionConfig = {
  slug: "users",
  admin: {
    useAsTitle: "email",
    defaultColumns: ["email", "role"],
    description: "CMS users including admins, editors, and artists.",
  },
  auth: true, // enables Payload's built-in auth (login, JWT, sessions)
  access: {
    // Admins can read all users; logged-in users can read their own account info
    read: ({ req }) => {
      if (!req.user) return false;
      if (req.user.role === "admin") return true;
      return { id: { equals: req.user.id } };
    },
    create: isAdmin,
    // Admins can update all; logged-in users can update their own account info
    update: ({ req }) => {
      if (!req.user) return false;
      if (req.user.role === "admin") return true;
      return { id: { equals: req.user.id } };
    },
    delete: isAdmin,
  },
  fields: [
    {
      name: "role",
      type: "select",
      required: true,
      defaultValue: "admin",
      options: [
        { label: "Admin (full access)", value: "admin" },
        { label: "Editor (content only)", value: "editor" },
        { label: "Artist (own profile only)", value: "artist" },
        { label: "Photographer (media uploads)", value: "photographer" },
      ],
      admin: { position: "sidebar" },
      access: {
        update: isAdminFieldLevel,
      },
    },
  ],
};
