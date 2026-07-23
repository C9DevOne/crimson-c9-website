import type { CollectionConfig } from "payload";
import { isAdminOrEditor } from "../access";

export const CollaborationRequests: CollectionConfig = {
  slug: "collaboration-requests",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "type", "status", "submittedAt"],
    description:
      "Inbound enquiries from the /connect form. Read-only in CMS — no public GET endpoint.",
  },
  // Write-only from public API: anyone can create, only admins and editors can read/update/delete
  access: {
    create: () => true,
    read: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  hooks: {
    afterChange: [
      async ({ doc, operation }) => {
        // Only send notification email on new submissions
        if (operation !== "create") return;

        // TODO: Wire up Nodemailer / Resend / similar to send email to hello@crimsonc9.com
        // This hook fires on every new submission so submissions don't sit silently in the DB.
        // Example implementation:
        // await sendEmail({
        //   to: "hello@crimsonc9.com",
        //   subject: `New ${doc.type} enquiry from ${doc.name}`,
        //   text: doc.message,
        // });
        console.log(
          `[CollaborationRequests] New submission from ${doc.name} (${doc.type}) — notify hello@crimsonc9.com`,
        );
      },
    ],
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
      label: "Name",
    },
    {
      name: "email",
      type: "email",
      required: true,
      label: "Email",
    },
    {
      name: "type",
      type: "select",
      required: true,
      label: "Enquiry Type",
      options: [
        { label: "Booking", value: "booking" },
        { label: "Collaboration", value: "collaboration" },
        { label: "Volunteer", value: "volunteer" },
        { label: "Other", value: "other" },
      ],
    },
    {
      name: "message",
      type: "textarea",
      required: true,
      label: "Message",
    },
    {
      name: "submittedAt",
      type: "date",
      label: "Submitted At",
      admin: {
        position: "sidebar",
        readOnly: true,
        date: { pickerAppearance: "dayAndTime" },
      },
      hooks: {
        beforeChange: [
          ({ operation, value }) => {
            if (operation === "create") return new Date().toISOString();
            return value;
          },
        ],
      },
    },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "new",
      label: "Status",
      admin: { position: "sidebar" },
      options: [
        { label: "New", value: "new" },
        { label: "In Review", value: "in-review" },
        { label: "Responded", value: "responded" },
        { label: "Archived", value: "archived" },
      ],
    },
  ],
};
