import { NextRequest, NextResponse } from "next/server";
import { rejectComment } from "@/lib/comments/moderate";
import { moderationPage, rejectFormPage } from "@/lib/moderation/html";
import { verifyModerationToken } from "@/lib/moderation/tokens";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");

  if (!token || !verifyModerationToken(token, "reject")) {
    return new NextResponse(
      moderationPage("Token inválido", "Este link expirou ou é inválido.", false),
      {
        status: 400,
        headers: { "Content-Type": "text/html; charset=utf-8" },
      }
    );
  }

  return new NextResponse(rejectFormPage(token), {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const token = String(formData.get("token") ?? "");
  const reason = String(formData.get("reason") ?? "");

  const verified = verifyModerationToken(token, "reject");
  if (!verified) {
    return new NextResponse(
      moderationPage("Token inválido", "Este link expirou ou é inválido.", false),
      {
        status: 400,
        headers: { "Content-Type": "text/html; charset=utf-8" },
      }
    );
  }

  const result = await rejectComment(verified.commentId, reason, "email-link");

  if (!result.ok) {
    return new NextResponse(moderationPage("Erro", result.error, false), {
      status: 400,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  const title = result.alreadyProcessed ? "Já rejeitado" : "Comentário rejeitado";
  const message = result.alreadyProcessed
    ? "Este comentário já havia sido rejeitado anteriormente."
    : "O comentário foi rejeitado e não será exibido publicamente.";

  return new NextResponse(moderationPage(title, message), {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
