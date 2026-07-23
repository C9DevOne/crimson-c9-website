import { getPayload } from "payload";
import configPromise from "@payload-config";
import EventsClient from "./events-client";
import { Event, Media } from "@/payload-types";

export const dynamic = "force-dynamic";

export default async function EventsPage() {
  const payload = await getPayload({ config: configPromise });

  const eventsRes = await payload.find({
    collection: "events",
    depth: 1,
    sort: "-date",
  });

  const formattedEvents = eventsRes.docs.map((event: Event) => {
    let imageUrl = "/key_portal_background_169.png";
    if (event.coverImage && typeof event.coverImage === "object") {
      const media = event.coverImage as Media;
      if (media.url) {
        imageUrl = media.url;
      }
    }

    return {
      id: event.id,
      title: event.title,
      slug: event.slug,
      status: event.status,
      date: event.date,
      venue: event.venue || "TBA",
      city: event.city || "Aachen / Cologne / Berlin",
      imageUrl,
      ticketUrl: event.ticketUrl || null,
      residentAdvisorUrl: event.residentAdvisorUrl || null,
      lineup:
        event.lineup?.map((item) => {
          let name = item.guestName || "Resident Act";
          if (item.artist && typeof item.artist === "object") {
            name = item.artist.name;
          }
          return {
            name,
            startTime: item.startTime,
            setType: item.setType,
          };
        }) || [],
    };
  });

  return <EventsClient events={formattedEvents} />;
}
