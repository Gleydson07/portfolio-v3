"use client";

import { useActionState } from "react";
import { submitComment, type SubmitCommentState } from "@/lib/comments/actions";

const initialState: SubmitCommentState = {
  ok: false,
  message: "",
};

type CommentFormProps = {
  postSlug: string;
  postTitle: string;
  disabled?: boolean;
};

export function CommentForm({ postSlug, postTitle, disabled = false }: CommentFormProps) {
  const [state, formAction, pending] = useActionState(submitComment, initialState);

  if (disabled) {
    return (
      <p className="font-mono text-xs tracking-widest text-text-secondary uppercase">
        Comentários indisponíveis no momento.
      </p>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="postSlug" value={postSlug} />
      <input type="hidden" name="postTitle" value={postTitle} />
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

      <div>
        <label
          htmlFor="authorName"
          className="font-mono mb-2 block text-xs tracking-widest text-text-secondary uppercase"
        >
          Nome (opcional)
        </label>
        <input
          id="authorName"
          name="authorName"
          type="text"
          maxLength={80}
          placeholder="Seu nome"
          className="glass-panel w-full rounded-xl border border-glass-border bg-transparent px-4 py-3 text-sm text-text-primary outline-none focus:border-accent/40"
        />
      </div>

      <div>
        <label
          htmlFor="body"
          className="font-mono mb-2 block text-xs tracking-widest text-text-secondary uppercase"
        >
          Comentário
        </label>
        <textarea
          id="body"
          name="body"
          required
          minLength={3}
          maxLength={2000}
          rows={5}
          placeholder="Escreva seu comentário..."
          className="glass-panel w-full rounded-xl border border-glass-border bg-transparent px-4 py-3 text-sm leading-relaxed text-text-primary outline-none focus:border-accent/40"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="font-mono rounded-full border border-accent/40 px-5 py-2.5 text-xs tracking-widest text-accent uppercase transition-colors hover:bg-accent/10 disabled:opacity-50"
      >
        {pending ? "Enviando..." : "Enviar comentário"}
      </button>

      {state.message && (
        <p
          className={`font-mono text-xs tracking-widest uppercase ${
            state.ok ? "text-accent" : "text-red-400"
          }`}
          role="status"
        >
          {state.message}
        </p>
      )}
    </form>
  );
}
