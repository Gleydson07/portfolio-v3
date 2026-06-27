import { revalidatePath, revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";
import { syncCommentsPostMeta } from "@/lib/comments/sync-post";

type WebhookPayload = {
  _type: string;
  _id?: string;
  title?: string;
  slug?: { current?: string };
};

export async function POST(request: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;

  if (!secret) {
    return NextResponse.json({ message: "Revalidação não configurada" }, { status: 501 });
  }

  try {
    const { isValidSignature, body } = await parseBody<WebhookPayload>(request, secret);

    if (!isValidSignature) {
      return NextResponse.json({ message: "Assinatura inválida" }, { status: 401 });
    }

    if (body?._type === "post") {
      revalidateTag("posts");

      const slug = body.slug?.current;
      const postId = body._id;

      if (postId && slug) {
        await syncCommentsPostMeta(postId, slug, body.title);
      }

      if (slug) {
        revalidateTag(`post:${slug}`);
        revalidatePath(`/blog/${slug}`);
      }

      revalidatePath("/blog");
      revalidatePath("/sitemap.xml");
    }

    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch {
    return NextResponse.json({ message: "Erro ao revalidar" }, { status: 500 });
  }
}
