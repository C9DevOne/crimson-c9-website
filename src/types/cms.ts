/**
 * CMS Data Interfaces
 * Shared frontend types for Payload CMS collections & globals data.
 */

export type EventItem = {
  id: number;
  title: string;
  slug: string;
  status: "upcoming" | "past" | "cancelled" | "draft";
  date: string;
  venue: string;
  city: string;
  imageUrl: string;
  ticketUrl: string | null;
  residentAdvisorUrl: string | null;
  lineup: {
    name: string;
    startTime?: string | null;
    setType?: string | null;
  }[];
};

export type ReleaseItem = {
  id: number;
  title: string;
  slug: string;
  type: "track" | "ep" | "album" | "podcast-episode";
  releaseDate?: string | null;
  coverArtUrl: string;
  soundcloudUrl?: string | null;
  spotifyUrl?: string | null;
  youtubeUrl?: string | null;
  artists: string[];
  isFeatured?: boolean | null;
};

export type ArtistItem = {
  image: string;
  text: string;
  subtitle: string;
  description: string;
  instagram?: string;
  soundcloud?: string;
};

export type AboutData = {
  siteName: string;
  tagline: string;
  metaDescription: string;
  contactEmail: string;
  artistCount: number;
  artistNames: string[];
};

export type ConnectData = {
  instagram?: string | null;
  soundcloud?: string | null;
  youtube?: string | null;
  spotify?: string | null;
  whatsappCommunity?: string | null;
  residentAdvisor?: string | null;
  contactEmail: string;
};

export type ContactData = {
  contactEmail: string;
  siteName: string;
  tagline: string;
  instagram?: string | null;
  whatsappCommunity?: string | null;
};

export type SupportData = {
  contactEmail: string;
  whatsappCommunity?: string | null;
  siteName: string;
};

export type ImprintData = {
  siteName: string;
  tagline: string;
  contactEmail: string;
};

export type TermsData = {
  siteName: string;
  contactEmail: string;
};

export type FeaturedData = {
  heroHeadline?: string | null;
  heroSubtext?: string | null;
  featuredArtist?: {
    name: string;
    role?: string | null;
    bio?: string | null;
    imageUrl: string;
  } | null;
  featuredEvent?: {
    title: string;
    date: string;
    venue?: string | null;
    city?: string | null;
    status: string;
    imageUrl: string;
  } | null;
  featuredRelease?: {
    title: string;
    type: string;
    coverArtUrl: string;
    soundcloudUrl?: string | null;
    spotifyUrl?: string | null;
  } | null;
};
