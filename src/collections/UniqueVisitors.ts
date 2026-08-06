import type { CollectionConfig } from "payload";
import { isAdmin } from "../access";

export const UniqueVisitors: CollectionConfig = {
  slug: "unique-visitors",
  admin: {
    useAsTitle: "id",
    defaultColumns: ["timestamp"],
    description: "Anonymized unique daily visitor logs.",
  },
  access: {
    read: isAdmin,
    create: () => true, // Allow creation from the tracker API
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      name: "sessionId",
      type: "text",
      required: true,
      index: true,
    },
    {
      name: "timestamp",
      type: "date",
      required: true,
      index: true,
      hooks: {
        beforeChange: [({ value }) => value || new Date().toISOString()],
      },
    },
  ],
};
