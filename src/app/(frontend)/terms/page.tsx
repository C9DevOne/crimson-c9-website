import type { Metadata } from "next";
import TermsClient from "./terms-client";

export const metadata: Metadata = {
  title: "Terms & Privacy — CrimsonC9",
  description: "Terms of use and data protection information for CrimsonC9.",
  robots: { index: false, follow: true },
};

/** Same reasoning as /imprint: CMS-sourced cosmetics, with these as the standing values. */
const TERMS_DATA = {
  siteName: "CrimsonC9",
  contactEmail: "hello@crimsonc9.com",
};

export default function TermsPage() {
  return <TermsClient data={TERMS_DATA} />;
}
