"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { approveCommentAction, rejectCommentAction } from "@/lib/comments/admin-actions";
import type { Comment } from "@/lib/comments/types";

function formatDateTime(date: string | null) {
  if (!date) return "—";
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(date));
}

function displayName(name: string | null) {
  return name?.trim() || "Anônimo";
}

type CommentModerationPanelProps = {
  pending: Comment[];
  approved: Comment[];
  rejected: Comment[];
};

type Tab = "pending" | "approved" | "rejected";

export function CommentModerationPanel({
  pending,
  approved,
  rejected,
}: CommentModerationPanelProps) {
  const [tab, setTab] = useState<Tab>("pending");
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const rows =
    tab === "pending" ? pending : tab === "approved" ? approved : rejected;

  const handleApprove = (commentId: string) => {
    startTransition(async () => {
      const result = await approveCommentAction(commentId);
      setMessage(result.ok ? "Comentário aprovado." : result.error);
      if (result.ok) router.refresh();
    });
  };

  const handleReject = (commentId: string) => {
    startTransition(async () => {
      const result = await rejectCommentAction(commentId, reason);
      if (result.ok) {
        setRejectingId(null);
        setReason("");
        setMessage("Comentário rejeitado.");
        router.refresh();
      } else {
        setMessage(result.error);
      }
    });
  };

  return (
    <div>
      <div className="mb-8 flex flex-wrap gap-2">
        {(
          [
            ["pending", `Pendentes (${pending.length})`],
            ["approved", `Aprovados (${approved.length})`],
            ["rejected", `Rejeitados (${rejected.length})`],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={`font-mono rounded-full px-4 py-2 text-xs tracking-widest uppercase transition-colors ${
              tab === key
                ? "bg-accent/15 text-accent"
                : "border border-glass-border text-text-secondary hover:text-text-primary"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {message && (
        <p className="font-mono mb-6 text-xs tracking-widest text-accent uppercase">{message}</p>
      )}

      {rows.length === 0 ? (
        <p className="font-mono text-xs tracking-widest text-text-secondary uppercase">
          Nenhum comentário nesta aba.
        </p>
      ) : (
        <ul className="space-y-4">
          {rows.map((comment) => (
            <li key={comment.id} className="glass-panel rounded-2xl p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-xs tracking-widest text-accent uppercase">
                    {comment.post_title ?? comment.post_slug}
                  </p>
                  <p className="font-display mt-2 text-lg font-semibold text-text-primary">
                    {displayName(comment.author_name)}
                  </p>
                </div>
                <div className="text-right font-mono text-[10px] tracking-widest text-text-secondary uppercase">
                  <p>Enviado: {formatDateTime(comment.created_at)}</p>
                  {comment.approved_at && <p>Aprovado: {formatDateTime(comment.approved_at)}</p>}
                  {comment.rejected_at && <p>Rejeitado: {formatDateTime(comment.rejected_at)}</p>}
                </div>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-text-secondary">{comment.body}</p>

              {comment.rejection_reason && (
                <p className="mt-3 font-mono text-xs text-red-300">
                  Motivo: {comment.rejection_reason}
                </p>
              )}

              {tab === "pending" && !comment.notification_sent_at && (
                <p className="font-mono mt-3 text-[10px] tracking-widest text-amber-300 uppercase">
                  Notificação não enviada
                  {comment.notification_error ? `: ${comment.notification_error}` : ""}
                </p>
              )}

              {tab === "pending" && (
                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => handleApprove(comment.id)}
                    className="font-mono rounded-full border border-accent/40 px-4 py-2 text-xs tracking-widest text-accent uppercase hover:bg-accent/10 disabled:opacity-50"
                  >
                    Aprovar
                  </button>
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => {
                      setRejectingId(comment.id);
                      setReason("");
                    }}
                    className="font-mono rounded-full border border-red-400/40 px-4 py-2 text-xs tracking-widest text-red-300 uppercase hover:bg-red-400/10 disabled:opacity-50"
                  >
                    Rejeitar
                  </button>
                  <a
                    href={`/blog/${comment.post_slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono px-2 py-2 text-xs tracking-widest text-text-secondary uppercase hover:text-accent"
                  >
                    Ver post
                  </a>
                </div>
              )}

              {rejectingId === comment.id && (
                <div className="mt-5 space-y-3 border-t border-glass-border pt-4">
                  <label
                    htmlFor={`reason-${comment.id}`}
                    className="font-mono block text-xs tracking-widest text-text-secondary uppercase"
                  >
                    Motivo da rejeição
                  </label>
                  <textarea
                    id={`reason-${comment.id}`}
                    value={reason}
                    onChange={(event) => setReason(event.target.value)}
                    minLength={3}
                    maxLength={500}
                    rows={3}
                    className="w-full rounded-xl border border-glass-border bg-transparent px-4 py-3 text-sm text-text-primary outline-none focus:border-red-400/40"
                    placeholder="Descreva o motivo..."
                  />
                  <div className="flex gap-3">
                    <button
                      type="button"
                      disabled={isPending || reason.trim().length < 3}
                      onClick={() => handleReject(comment.id)}
                      className="font-mono rounded-full bg-red-500/20 px-4 py-2 text-xs tracking-widest text-red-300 uppercase disabled:opacity-50"
                    >
                      Confirmar rejeição
                    </button>
                    <button
                      type="button"
                      onClick={() => setRejectingId(null)}
                      className="font-mono px-4 py-2 text-xs tracking-widest text-text-secondary uppercase"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
