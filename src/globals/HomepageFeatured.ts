import type { GlobalConfig } from "payload";
import { isAdminOrEditor } from "../access";

export const HomepageFeatured: GlobalConfig = {
  slug: "homepage-featured",
  admin: {
    group: "Settings",
    description:
      "Controls the dynamic editorial sections of the homepage without requiring a code change.",
  },
  access: {
    read: () => true,
    update: isAdminOrEditor,
  },
  fields: [
    {
      name: "heroHeadline",
      type: "text",
      label: "Hero Headline",
      admin: { description: "Optional override for hero text." },
    },
    {
      name: "heroSubtext",
      type: "textarea",
      label: "Hero Subtext",
      admin: { description: "Optional supporting copy beneath the headline." },
    },
    {
      name: "featuredArtist",
      type: "relationship",
      relationTo: "artists",
      label: "Featured Artist",
      admin: { description: "Artist shown in the homepage spotlight." },
    },
    {
      name: "featuredEvent",
      type: "relationship",
      relationTo: "events",
      label: "Featured Event",
      admin: { description: "Upcoming event to highlight on the homepage." },
    },
    {
      name: "featuredRelease",
      type: "relationship",
      relationTo: "releases",
      label: "Featured Release",
      admin: { description: "Track or release to feature on the homepage." },
    },
  ],
};
