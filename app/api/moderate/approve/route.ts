import { NextRequest, NextResponse } from "next/server";
import { approveComment } from "@/lib/comments/moderate";
import { moderationPage } from "@/lib/moderation/html";
import { verifyModerationToken } from "@/lib/moderation/tokens";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");

  if (!token) {
    return new NextResponse(moderationPage("Token inválido", "Link de moderação inválido.", false), {
      status: 400,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  const verified = verifyModerationToken(token, "approve");
  if (!verified) {
    return new NextResponse(
      moderationPage("Token expirado", "Este link expirou ou é inválido.", false),
      {
        status: 400,
        headers: { "Content-Type": "text/html; charset=utf-8" },
      }
    );
  }

  const result = await approveComment(verified.commentId, "email-link");

  if (!result.ok) {
    return new NextResponse(moderationPage("Erro", result.error, false), {
      status: 400,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  const title = result.alreadyProcessed ? "Já aprovado" : "Comentário aprovado";
  const message = result.alreadyProcessed
    ? "Este comentário já havia sido aprovado anteriormente."
    : "O comentário foi publicado no post.";

  return new NextResponse(moderationPage(title, message), {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
