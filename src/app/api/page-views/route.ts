import { NextRequest, NextResponse } from "next/server";
import Redis from "ioredis";
import { createHash } from "crypto";

const KEY = "page-views:total";
const SESSION_PREFIX = "pv-session:";
const SESSION_TTL = 1800; // 30-minute session window

let redis: Redis | null = null;

function getRedis() {
  if (redis) return redis;
  const url = process.env.REDIS_URL;
  if (!url) return null;
  redis = new Redis(url, {
    maxRetriesPerRequest: 1,
    connectTimeout: 5000,
  });
  redis.on("error", () => {});
  return redis;
}

function fingerprint(req: NextRequest): string {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const ua = req.headers.get("user-agent") ?? "";
  return createHash("sha256").update(`${ip}|${ua}`).digest("hex").slice(0, 16);
}

// GET = read current count (no increment)
export async function GET() {
  try {
    const client = getRedis();
    if (!client) return NextResponse.json({ views: null });

    const count = await client.get(KEY);

    return NextResponse.json(
      { views: count ? parseInt(count, 10) : 0 },
      { headers: { "Cache-Control": "no-store, max-age=0" } },
    );
  } catch (error) {
    console.error("[PageViews]", error);
    return NextResponse.json({ views: null });
  }
}

// POST = increment (deduplicated per session)
export async function POST(req: NextRequest) {
  try {
    const client = getRedis();
    if (!client) return NextResponse.json({ views: null });

    const fp = fingerprint(req);
    const sessionKey = `${SESSION_PREFIX}${fp}`;

    const alreadyCounted = await client.exists(sessionKey);
    if (alreadyCounted) {
      // Refresh TTL but don't count again
      await client.expire(sessionKey, SESSION_TTL);
      const count = await client.get(KEY);
      return NextResponse.json({ views: count ? parseInt(count, 10) : 0 });
    }

    // New session — count it
    await client.set(sessionKey, "1", "EX", SESSION_TTL);
    const count = await client.incr(KEY);

    return NextResponse.json(
      { views: count },
      { headers: { "Cache-Control": "no-store, max-age=0" } },
    );
  } catch (error) {
    console.error("[PageViews]", error);
    return NextResponse.json({ views: null });
  }
}
