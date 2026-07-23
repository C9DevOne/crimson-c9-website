import type { GlobalConfig } from "payload";
import { isAdminOrEditor } from "../access";

export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  admin: {
    group: "Settings",
    description: "Core site-wide settings.",
  },
  access: {
    read: () => true,
    update: isAdminOrEditor,
  },
  fields: [
    {
      name: "siteName",
      type: "text",
      defaultValue: "CrimsonC9",
      label: "Site Name",
    },
    {
      name: "tagline",
      type: "text",
      defaultValue: "Change Through Music",
      label: "Tagline",
    },
    {
      name: "metaDescription",
      type: "textarea",
      label: "Default Meta Description",
      admin: {
        description: "Default SEO description used when a page doesn't have its own.",
      },
    },
    {
      name: "ogImage",
      type: "upload",
      relationTo: "media",
      label: "Default Social Share Image",
      admin: { description: "Used as the og:image fallback for all pages." },
    },
    {
      name: "contactEmail",
      type: "email",
      defaultValue: "hello@crimsonc9.com",
      label: "Contact Email",
    },
  ],
};
