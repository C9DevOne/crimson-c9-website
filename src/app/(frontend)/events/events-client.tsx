"use client";

import DecryptedText from "@/components/ui/decrypted_text";
import Image from "next/image";
import { EventItem } from "@/types/cms";

export default function EventsClient({ events }: { events: EventItem[] }) {
  const upcomingEvents = events.filter((e) => e.status === "upcoming");
  const pastEvents = events.filter((e) => e.status === "past");

  return (
    <div className="flex min-h-screen flex-col bg-[#0a0a0a] text-white">
      {/* Hero Header */}
      <div className="mx-auto w-full max-w-5xl px-6 pt-12 pb-8 text-center">
        <h1 className="text-brand-crimson mb-4 text-4xl font-extrabold tracking-wider uppercase md:text-6xl">
          <DecryptedText
            text="EVENTS & ARCHIVE"
            speed={100}
            maxIterations={20}
            sequential={true}
            animateOn="hover"
            revealDirection="center"
            className="text-brand-crimson"
            encryptedClassName="text-white/20"
            useRandomColors={true}
          />
        </h1>
        <p className="mx-auto max-w-xl text-xs tracking-widest text-zinc-400 uppercase md:text-sm">
          Aachen · Cologne · Berlin — Experience the movement live.
        </p>
      </div>

      {/* Events List */}
      <div className="mx-auto w-full max-w-5xl flex-1 space-y-16 px-6 pb-20">
        {/* Upcoming Section */}
        <section>
          <h2 className="text-brand-crimson mb-6 border-b border-zinc-800 pb-2 text-xl font-bold tracking-widest uppercase">
            Upcoming Gatherings
          </h2>
          {upcomingEvents.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="group hover:border-brand-crimson/50 relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 transition"
                >
                  <div className="relative mb-4 h-48 w-full overflow-hidden rounded-xl bg-zinc-950">
                    <Image
                      src={event.imageUrl}
                      alt={event.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="bg-brand-crimson absolute top-3 right-3 rounded-full px-3 py-1 text-xs font-semibold tracking-wider text-white uppercase">
                      {event.status}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="font-mono text-xs text-zinc-400">
                      {new Date(event.date).toLocaleDateString("en-US", {
                        weekday: "short",
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                    <h3 className="group-hover:text-brand-crimson text-2xl font-bold tracking-tight text-white transition-colors">
                      {event.title}
                    </h3>
                    <p className="text-sm text-zinc-400">
                      {event.venue} — {event.city}
                    </p>
                  </div>

                  {event.lineup.length > 0 && (
                    <div className="mt-4 border-t border-zinc-800/80 pt-4">
                      <p className="mb-2 text-xs font-semibold tracking-widest text-zinc-500 uppercase">
                        Lineup
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {event.lineup.map((act, idx) => (
                          <span
                            key={idx}
                            className="rounded-md bg-zinc-800 px-2.5 py-1 text-xs text-zinc-300"
                          >
                            {act.name} {act.setType ? `(${act.setType})` : ""}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-6 flex items-center gap-4">
                    {event.ticketUrl && (
                      <a
                        href={event.ticketUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-brand-crimson hover:bg-brand-crimson/80 rounded-full px-5 py-2 text-xs font-bold tracking-wider text-white uppercase transition-colors"
                      >
                        Tickets
                      </a>
                    )}
                    {event.residentAdvisorUrl && (
                      <a
                        href={event.residentAdvisorUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-full border border-zinc-700 px-5 py-2 text-xs font-bold tracking-wider text-zinc-300 uppercase transition-colors hover:border-zinc-500 hover:text-white"
                      >
                        Resident Advisor
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm tracking-wider text-zinc-500 uppercase italic">
              No upcoming events announced right now. Stay tuned.
            </p>
          )}
        </section>

        {/* Past Section */}
        {pastEvents.length > 0 && (
          <section>
            <h2 className="mb-6 border-b border-zinc-800 pb-2 text-xl font-bold tracking-widest text-zinc-400 uppercase">
              Archive & Past Events
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              {pastEvents.map((event) => (
                <div
                  key={event.id}
                  className="rounded-xl border border-zinc-800/60 bg-zinc-950 p-5 transition hover:border-zinc-700"
                >
                  <div className="mb-1 font-mono text-xs text-zinc-500">
                    {new Date(event.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                    })}
                  </div>
                  <h3 className="text-lg font-bold text-zinc-200">{event.title}</h3>
                  <p className="mt-1 text-xs text-zinc-400">
                    {event.venue}, {event.city}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
