import { type NextRequest, NextResponse } from "next/server";
import { POSTS_PAGE_SIZE } from "@/lib/blog/constants";
import { getPostsPage } from "@/lib/sanity/fetch";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const page = Math.max(0, Number.parseInt(searchParams.get("page") ?? "0", 10) || 0);
  const limit = Math.min(
    POSTS_PAGE_SIZE,
    Math.max(1, Number.parseInt(searchParams.get("limit") ?? String(POSTS_PAGE_SIZE), 10) || POSTS_PAGE_SIZE)
  );
  const title = searchParams.get("q") ?? "";
  const tag = searchParams.get("tag") ?? "";

  const result = await getPostsPage({ page, limit, title, tag });
  return NextResponse.json(result);
}
