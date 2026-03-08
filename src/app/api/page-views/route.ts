import { NextResponse } from "next/server";

export const runtime = "edge";

const KEY = "page-views:total";

function getUpstashCredentials() {
  const redisUrl = process.env.REDIS_URL || process.env.KV_REST_API_URL;
  if (!redisUrl) return null;

  // If it's already a REST API URL (https://), use KV-style env vars
  if (redisUrl.startsWith("https://")) {
    return {
      url: redisUrl,
      token: process.env.KV_REST_API_TOKEN!,
    };
  }

  // Parse redis://default:TOKEN@host:port into REST API credentials
  try {
    const parsed = new URL(redisUrl);
    return {
      url: `https://${parsed.hostname}`,
      token: parsed.password,
    };
  } catch {
    return null;
  }
}

export async function GET() {
  try {
    const creds = getUpstashCredentials();
    if (!creds) return NextResponse.json({ views: null });

    const res = await fetch(`${creds.url}/incr/${KEY}`, {
      headers: { Authorization: `Bearer ${creds.token}` },
      cache: "no-store",
    });

    if (!res.ok) return NextResponse.json({ views: null });

    const data = await res.json();
    return NextResponse.json(
      { views: data.result },
      { headers: { "Cache-Control": "no-store, max-age=0" } }
    );
  } catch {
    return NextResponse.json({ views: null });
  }
}
