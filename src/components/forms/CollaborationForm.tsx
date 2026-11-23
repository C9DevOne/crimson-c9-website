"use client";

import { useState, type FormEvent } from "react";
import { ChevronDown, Loader2, Sprout } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/components/ui/utils";

/**
 * Enquiry types. These `value`s must match the `type` select options on the
 * `collaboration-requests` collection exactly — Payload validates against them and rejects
 * anything else, so a friendlier label goes in `label`, never in `value`.
 */
const ENQUIRY_TYPES = [
  { value: "booking", label: "Booking an artist" },
  { value: "collaboration", label: "Collaboration" },
  { value: "volunteer", label: "Volunteering / joining in" },
  { value: "other", label: "Something else" },
] as const;

/** Payload's REST endpoint for the collection — public `create`, no auth needed. */
const ENDPOINT = "/api/collaboration-requests";

type FieldErrors = Partial<Record<"name" | "email" | "message" | "type", string>>;
type Status = "idle" | "submitting" | "success" | "error";

export function CollaborationForm({ contactEmail }: { contactEmail: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const data = new FormData(form);

    // Honeypot: a real person never sees this field, so anything in it is a bot. Return a
    // success state without posting — silently accepting is what stops the bot retrying,
    // where a visible rejection just tells it what to fix.
    if ((data.get("website") as string)?.trim()) {
      setStatus("success");
      return;
    }

    const payload = {
      name: ((data.get("name") as string) ?? "").trim(),
      email: ((data.get("email") as string) ?? "").trim(),
      type: ((data.get("type") as string) ?? "").trim(),
      message: ((data.get("message") as string) ?? "").trim(),
    };

    // Validate client-side first. The collection enforces all four as required anyway, so
    // this is purely so the visitor gets a useful message next to the offending field
    // instead of a round trip ending in a generic failure.
    const nextErrors: FieldErrors = {};
    if (!payload.name) nextErrors.name = "Please tell us your name.";
    if (!payload.email) nextErrors.email = "We need an email address to reply to.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email))
      nextErrors.email = "That doesn't look like a valid email address.";
    if (!payload.type) nextErrors.type = "Pick what this is about.";
    if (!payload.message) nextErrors.message = "Add a message so we know what you need.";

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setFormError(null);
      setStatus("idle");
      return;
    }

    setErrors({});
    setFormError(null);
    setStatus("submitting");

    try {
      const response = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        // Payload returns { errors: [{ message }] }. Surface its message when there is one —
        // it's usually more specific than anything we'd write here.
        let detail: string | null = null;
        try {
          const body = await response.json();
          detail = body?.errors?.[0]?.message ?? null;
        } catch {
          // Non-JSON error body (a gateway or proxy page). Fall through to the generic text.
        }
        throw new Error(detail ?? `Request failed (${response.status})`);
      }

      setStatus("success");
    } catch (error) {
      setStatus("error");
      setFormError(error instanceof Error ? error.message : "Something went wrong.");
    }
  }

  if (status === "success") {
    return (
      <div
        className="flex flex-col items-center gap-4 py-10 text-center"
        role="status"
        aria-live="polite"
      >
        <Sprout className="text-glow-crimson size-10" aria-hidden="true" />
        <p className="font-display text-foreground text-2xl">Message received</p>
        <p className="font-body text-muted-foreground max-w-sm text-base">
          Thanks for reaching out — we read everything that lands here and will get back to you.
        </p>
      </div>
    );
  }

  const submitting = status === "submitting";

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      {/* Honeypot. Positioned off-screen rather than display:none — some bots skip fields
          that are outright hidden, but fill ones that are merely out of view. */}
      <div className="pointer-events-none absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="website">Website (leave blank)</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="name" label="Name" error={errors.name}>
          <Input
            id="name"
            name="name"
            autoComplete="name"
            disabled={submitting}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "name-error" : undefined}
            className="h-12 rounded-2xl border-white/10 bg-white/5 px-4"
          />
        </Field>

        <Field id="email" label="Email" error={errors.email}>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            disabled={submitting}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
            className="h-12 rounded-2xl border-white/10 bg-white/5 px-4"
          />
        </Field>
      </div>

      <Field id="type" label="Subject" error={errors.type}>
        {/* Native select rather than a Radix one: accessible for free, works without JS, and
            needs no extra component for a four-option list. Only the closed control is
            styled — the open list is drawn by the OS. */}
        <div className="relative">
          <select
            id="type"
            name="type"
            defaultValue=""
            disabled={submitting}
            aria-invalid={Boolean(errors.type)}
            aria-describedby={errors.type ? "type-error" : undefined}
            className={cn(
              "focus-visible:border-glow-crimson focus-visible:ring-glow-crimson/40 aria-invalid:border-destructive aria-invalid:ring-destructive/20 h-12 w-full appearance-none rounded-2xl border border-white/10 bg-white/5 px-4 pr-11 text-base transition-colors outline-none focus-visible:ring-3 disabled:pointer-events-none disabled:opacity-50 aria-invalid:ring-3 md:text-sm",
              "[&>option]:bg-secondary [&>option]:text-foreground",
            )}
          >
            <option value="" disabled>
              Choose one…
            </option>
            {ENQUIRY_TYPES.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown
            className="text-muted-foreground pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2"
            aria-hidden="true"
          />
        </div>
      </Field>

      <Field id="message" label="Message" error={errors.message}>
        <Textarea
          id="message"
          name="message"
          rows={5}
          disabled={submitting}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "message-error" : undefined}
          className="min-h-32 rounded-2xl border-white/10 bg-white/5 px-4 py-3"
        />
      </Field>

      <div className="flex flex-col gap-3">
        {/* Deliberately quiet: an outlined button that fills in on hover, rather than a
            solid glowing slab. The form is the end of a calm page, not a call to action
            competing with it. */}
        <Button
          type="submit"
          size="lg"
          disabled={submitting}
          className="border-glow-crimson/40 text-foreground hover:border-glow-crimson/70 hover:bg-glow-crimson/15 h-12 self-start rounded-full border bg-transparent px-9 text-sm font-medium tracking-wide transition-colors duration-300"
        >
          {submitting ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              Sending…
            </>
          ) : (
            "Send message"
          )}
        </Button>

        {/* aria-live so the outcome is announced, not just shown. */}
        <p aria-live="polite" className="min-h-5">
          {formError && (
            <span className="font-ui text-destructive-foreground text-xs">
              {formError} — you can also reach us directly at{" "}
              <a href={`mailto:${contactEmail}`} className="text-glow-crimson hover:underline">
                {contactEmail}
              </a>
              .
            </span>
          )}
        </p>

        {/* The consent checkbox and the inline privacy line were both removed at Aaron's
            request (2026-10-02). What still carries the GDPR Art. 13 duty to inform is the
            privacy section at /terms#privacy, reachable from the footer and the lantern on
            every page — so the information is still one click away rather than absent.
            Inline notice at the point of collection is the stronger position; worth
            revisiting before launch. */}
      </div>
    </form>
  );
}

/** Label + control + error message, so the three stay wired together consistently. */
function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="type-label">
        {label}
      </label>
      {children}
      {error && (
        <span id={`${id}-error`} className="font-ui text-destructive-foreground text-xs">
          {error}
        </span>
      )}
    </div>
  );
}
