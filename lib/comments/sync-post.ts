import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export async function syncCommentsPostMeta(
  postId: string,
  slug: string,
  title?: string
): Promise<void> {
  if (!isSupabaseConfigured) return;

  const supabase = getSupabaseAdmin();
  if (!supabase) return;

  const update: { post_slug: string; post_title?: string } = { post_slug: slug };
  if (title?.trim()) {
    update.post_title = title.trim();
  }

  await supabase.from("comments").update(update).eq("post_id", postId);
}
