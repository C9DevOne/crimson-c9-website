import { connection } from "next/server";

/**
 * Liveness probe. Read by the compose healthcheck and, through it, by `deploy/deploy.sh`:
 * a container that never answers 200 here is never considered healthy, and the deploy
 * rolls back to the previous image instead of leaving a broken site up.
 *
 * It deliberately checks nothing but "this server is answering requests". There is no
 * database to reach for v1, and a probe that tests more than the thing it gates turns an
 * unrelated outage into a failed deploy. When Payload returns, a db check belongs here —
 * but only once the site actually can't serve without one.
 */
export async function GET() {
  // Opts out of prerendering. Under `cacheComponents` a route with no I/O is a build-time
  // constant, which would make this answer 200 from cache even with the server wedged.
  await connection();
  return Response.json({ status: "ok" });
}
