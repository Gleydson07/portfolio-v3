import { getSupabaseAdmin } from "@/lib/supabase/admin";

const DEFAULT_HOURLY_LIMIT = 3;

function getHourlyLimit(): number {
  const raw = process.env.COMMENT_HOURLY_LIMIT;
  if (!raw) return DEFAULT_HOURLY_LIMIT;

  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_HOURLY_LIMIT;
}

export async function isRateLimited(ipHash: string | null): Promise<boolean> {
  if (!ipHash) return false;

  const supabase = getSupabaseAdmin();
  if (!supabase) return false;

  const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();

  const { count, error } = await supabase
    .from("comments")
    .select("id", { count: "exact", head: true })
    .eq("ip_hash", ipHash)
    .gte("created_at", since);

  if (error) {
    console.error("rate-limit check failed", error);
    return false;
  }

  return (count ?? 0) >= getHourlyLimit();
}
