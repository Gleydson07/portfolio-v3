import { siteConfig } from "@/lib/content";
import { createModerationToken } from "@/lib/moderation/tokens";
import type { Comment } from "@/lib/comments/types";
import { Resend } from "resend";

function getResend(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export async function notifyModeration(comment: Comment): Promise<{
  sent: boolean;
  error?: string;
}> {
  const resend = getResend();
  const to = process.env.MODERATION_EMAIL;
  const from = process.env.EMAIL_FROM;

  if (!resend) {
    return { sent: false, error: "RESEND_API_KEY não configurada." };
  }

  if (!to) {
    return { sent: false, error: "MODERATION_EMAIL não configurado." };
  }

  if (!from) {
    return { sent: false, error: "EMAIL_FROM não configurado." };
  }

  if (!process.env.MODERATION_ACTION_SECRET) {
    return { sent: false, error: "MODERATION_ACTION_SECRET não configurado." };
  }

  let approveToken: string;
  let rejectToken: string;

  try {
    approveToken = createModerationToken(comment.id, "approve");
    rejectToken = createModerationToken(comment.id, "reject");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao gerar token de moderação.";
    return { sent: false, error: message };
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? siteConfig.url;

  const postUrl = `${baseUrl}/blog/${comment.post_slug}`;
  const approveUrl = `${baseUrl}/api/moderate/approve?token=${encodeURIComponent(approveToken)}`;
  const rejectUrl = `${baseUrl}/api/moderate/reject?token=${encodeURIComponent(rejectToken)}`;
  const adminUrl = `${baseUrl}/blog/admin/comentarios`;

  const authorLabel = escapeHtml(comment.author_name?.trim() || "Anônimo");
  const safeBody = escapeHtml(comment.body);
  const safeTitle = escapeHtml(comment.post_title ?? comment.post_slug);

  try {
    const { data, error } = await resend.emails.send({
      from,
      to,
      subject: `Novo comentário pendente — ${comment.post_title ?? comment.post_slug}`,
      html: `
        <h2>Novo comentário aguardando curadoria</h2>
        <p><strong>Post:</strong> <a href="${postUrl}">${safeTitle}</a></p>
        <p><strong>Nome:</strong> ${authorLabel}</p>
        <p><strong>Comentário:</strong></p>
        <blockquote style="white-space:pre-wrap;margin:0;padding-left:16px;border-left:3px solid #334155;">${safeBody}</blockquote>
        <p>
          <a href="${approveUrl}" style="display:inline-block;padding:10px 16px;background:#00d4ff;color:#050508;text-decoration:none;border-radius:6px;margin-right:8px;">Aprovar</a>
          <a href="${rejectUrl}" style="display:inline-block;padding:10px 16px;background:#ef4444;color:#fff;text-decoration:none;border-radius:6px;">Rejeitar</a>
        </p>
        <p><a href="${adminUrl}">Abrir painel de curadoria</a></p>
      `,
    });

    if (error) {
      return { sent: false, error: error.message };
    }

    if (!data?.id) {
      return { sent: false, error: "Resend não retornou confirmação de envio." };
    }

    return { sent: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao enviar e-mail.";
    return { sent: false, error: message };
  }
}
