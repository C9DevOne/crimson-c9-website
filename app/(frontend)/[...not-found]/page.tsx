import { notFound } from "next/navigation";

/**
 * Catch-all route that triggers the 404 page for any unmatched path.
 */
export default function CatchAllNotFound() {
  notFound();
}
