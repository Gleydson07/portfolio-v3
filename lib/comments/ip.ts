import { createHash } from "crypto";
import { headers } from "next/headers";

export async function getIpHash(): Promise<string | null> {
  const salt = process.env.IP_HASH_SALT;
  if (!salt) return null;

  const headerStore = await headers();
  const forwarded = headerStore.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || headerStore.get("x-real-ip");

  if (!ip) return null;

  return createHash("sha256").update(`${salt}:${ip}`).digest("hex");
}
