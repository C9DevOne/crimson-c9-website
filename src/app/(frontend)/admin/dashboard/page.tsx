import { getPayload } from "payload";
import configPromise from "@payload-config";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { Route } from "next";
import { DashboardClient } from "./dashboard-client";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const payload = await getPayload({ config: configPromise });
  const { user } = await payload.auth({ headers: await headers() });

  // Protect route to admin only
  if (!user || user.role !== "admin") {
    redirect((`/admin/login?redirect=` + encodeURIComponent("/admin/dashboard")) as Route);
  }

  // Fetch unique visitor logs from the database
  const visitors = await payload.find({
    collection: "unique-visitors",
    limit: 10000,
    sort: "-timestamp",
  });

  // Extract only needed fields to keep page props payload lightweight
  const serializedVisitors = visitors.docs.map((doc) => ({
    id: doc.id,
    timestamp: doc.timestamp,
  }));

  return <DashboardClient initialData={serializedVisitors} />;
}
