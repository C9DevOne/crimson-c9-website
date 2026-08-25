import type { CollectionConfig } from "payload";
import { isAnyUser } from "../access";

export const Media: CollectionConfig = {
  slug: "media",
  access: {
    read: () => true,
    create: isAnyUser,
    update: ({ req }) => {
      const user = req.user;
      if (!user) return false;
      if (user.role === "admin" || user.role === "editor") return true;
      return {
        uploadedBy: {
          equals: user.id,
        },
      };
    },
    delete: ({ req }) => {
      const user = req.user;
      if (!user) return false;
      if (user.role === "admin" || user.role === "editor") return true;
      return {
        uploadedBy: {
          equals: user.id,
        },
      };
    },
  },
  upload: {
    staticDir: "public/media",
    imageSizes: [
      {
        name: "thumbnail",
        width: 400,
        height: 300,
        position: "centre",
      },
      {
        name: "card",
        width: 768,
        height: 512,
        position: "centre",
      },
      {
        name: "hero",
        width: 1920,
        height: 1080,
        position: "centre",
      },
    ],
    adminThumbnail: "thumbnail",
    mimeTypes: ["image/*", "video/*"],
  },
  fields: [
    {
      name: "alt",
      type: "text",
      required: true,
      label: "Alt Text",
    },
    {
      name: "uploadedBy",
      type: "relationship",
      relationTo: "users",
      label: "Uploaded By",
      admin: {
        readOnly: true,
        position: "sidebar",
      },
      hooks: {
        beforeChange: [
          ({ req, operation }) => {
            if (operation === "create" && req?.user) {
              return req.user.id;
            }
          },
        ],
      },
    },
  ],
};
