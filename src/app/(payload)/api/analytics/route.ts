import { NextRequest, NextResponse } from "next/server";
import { getPayload } from "payload";
import configPromise from "@payload-config";
import crypto from "crypto";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    // Get visitor's IP and User Agent to compute unique daily hash
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "127.0.0.1";
    const userAgent = req.headers.get("user-agent") || "";

    // Hash IP + User Agent + Date to create a privacy-friendly daily session identifier
    const dateStr = new Date().toISOString().split("T")[0];
    const salt = process.env.PAYLOAD_SECRET || "fallback_salt";
    const sessionId = crypto
      .createHash("sha256")
      .update(`${ip}-${userAgent}-${dateStr}-${salt}`)
      .digest("hex");

    const payload = await getPayload({ config: configPromise });

    // Check if this visitor has already been recorded today
    const existing = await payload.find({
      collection: "unique-visitors",
      where: {
        sessionId: { equals: sessionId },
      },
      limit: 1,
    });

    if (existing.docs.length === 0) {
      await payload.create({
        collection: "unique-visitors",
        data: {
          sessionId,
          timestamp: new Date().toISOString(),
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to track visitor:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
