import type { GlobalConfig } from "payload";
import { isAdminOrEditor } from "../access";

export const SocialLinks: GlobalConfig = {
  slug: "social-links",
  admin: {
    group: "Settings",
    description:
      "All social media URLs. Update here and they reflect everywhere — nav, footer, connect page — without a code deploy.",
  },
  access: {
    read: () => true,
    update: isAdminOrEditor,
  },
  fields: [
    {
      name: "instagram",
      type: "text",
      label: "Instagram",
      defaultValue: "https://instagram.com/crimsonc9",
    },
    {
      name: "soundcloud",
      type: "text",
      label: "SoundCloud",
      defaultValue: "https://soundcloud.com/crimsonc9",
    },
    {
      name: "youtube",
      type: "text",
      label: "YouTube",
      defaultValue: "https://www.youtube.com/@CrimsonC9",
    },
    {
      name: "spotify",
      type: "text",
      label: "Spotify",
    },
    {
      name: "whatsappCommunity",
      type: "text",
      label: "WhatsApp Community",
      defaultValue: "https://chat.whatsapp.com/LhsIlkJzr0r1jH4oloBnuL",
    },
    {
      name: "residentAdvisor",
      type: "text",
      label: "Resident Advisor",
    },
  ],
};
