/**
 * Known-good social URLs, used when the CMS can't be reached.
 *
 * These intentionally duplicate the `defaultValue` entries on the `social-links` global in
 * `src/globals/SocialLinks.ts`. The duplication buys something specific: the CMS stays the
 * place to change a URL without a deploy, but a database outage no longer deletes the
 * "check out our channels" section from the landing page. Hiding core content because a
 * query failed is a worse failure than showing a URL that's one deploy out of date.
 *
 * If a channel's URL changes, update it in the CMS first — then mirror it here so the
 * fallback doesn't drift.
 */
export const DEFAULT_SOCIALS = {
  instagram: "https://instagram.com/crimsonc9",
  youtube: "https://www.youtube.com/@CrimsonC9",
  soundcloud: "https://soundcloud.com/crimsonc9",
} as const;

export type SocialUrls = {
  instagram: string;
  youtube: string;
  soundcloud: string;
};

/** Prefers the CMS value, falls back to the constant above when it's missing or empty. */
export function resolveSocials(cms?: {
  instagram?: string | null;
  youtube?: string | null;
  soundcloud?: string | null;
}): SocialUrls {
  return {
    instagram: cms?.instagram || DEFAULT_SOCIALS.instagram,
    youtube: cms?.youtube || DEFAULT_SOCIALS.youtube,
    soundcloud: cms?.soundcloud || DEFAULT_SOCIALS.soundcloud,
  };
}
