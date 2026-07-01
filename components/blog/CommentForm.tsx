"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { submitComment, type SubmitCommentState } from "@/lib/comments/actions";
import { COMMENT_BODY_MAX, COMMENT_NAME_MAX } from "@/lib/comments/validation";
import {
  captureCommentFormAbandoned,
  captureCommentFormStarted,
  captureCommentFormSubmitted,
} from "@/lib/analytics/track";

const initialState: SubmitCommentState = {
  ok: false,
  message: "",
};

type CommentFormProps = {
  postId: string;
  postSlug: string;
  postTitle: string;
  disabled?: boolean;
};

function CharacterCounter({ current, max }: { current: number; max: number }) {
  return (
    <span
      className={`font-mono text-[10px] tracking-widest uppercase ${
        current >= max ? "text-red-400" : "text-text-secondary"
      }`}
      aria-live="polite"
    >
      {current}/{max}
    </span>
  );
}

function clamp(value: string, max: number) {
  return value.slice(0, max);
}

export function CommentForm({ postId, postSlug, postTitle, disabled = false }: CommentFormProps) {
  const [state, formAction, pending] = useActionState(submitComment, initialState);
  const [authorName, setAuthorName] = useState("");
  const [body, setBody] = useState("");
  const startedRef = useRef(false);
  const submittedRef = useRef(false);
  const authorNameRef = useRef("");
  const bodyRef = useRef("");

  const commentMeta = { postId, postSlug, postTitle };

  useEffect(() => {
    authorNameRef.current = authorName;
    bodyRef.current = body;
  }, [authorName, body]);

  const markStarted = () => {
    if (startedRef.current) return;
    startedRef.current = true;
    captureCommentFormStarted(commentMeta);
  };

  useEffect(() => {
    if (!state.ok) return;
    submittedRef.current = true;
    captureCommentFormSubmitted({ postId, postSlug, postTitle });
    setAuthorName("");
    setBody("");
  }, [state.ok, postId, postSlug, postTitle]);

  useEffect(() => {
    return () => {
      if (!startedRef.current || submittedRef.current) return;

      captureCommentFormAbandoned({
        postId,
        postSlug,
        postTitle,
        hadBody: bodyRef.current.trim().length > 0,
        hadName: authorNameRef.current.trim().length > 0,
        bodyLength: bodyRef.current.trim().length,
      });
    };
  }, [postId, postSlug, postTitle]);

  if (disabled) {
    return (
      <p className="font-mono text-xs tracking-widest text-text-secondary uppercase">
        Comentários indisponíveis no momento.
      </p>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="postId" value={postId} />
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
        <div className="mb-2 flex items-baseline justify-between gap-4">
          <label
            htmlFor="authorName"
            className="font-mono text-xs tracking-widest text-text-secondary uppercase"
          >
            Nome (opcional)
          </label>
          <CharacterCounter current={authorName.length} max={COMMENT_NAME_MAX} />
        </div>
        <input
          id="authorName"
          name="authorName"
          type="text"
          value={authorName}
          maxLength={COMMENT_NAME_MAX}
          placeholder="Seu nome"
          onFocus={markStarted}
          onChange={(event) => {
            markStarted();
            setAuthorName(clamp(event.target.value, COMMENT_NAME_MAX));
          }}
          className="glass-panel w-full rounded-xl border border-glass-border bg-transparent px-4 py-3 text-sm text-text-primary outline-none focus:border-accent/40"
        />
      </div>

      <div>
        <div className="mb-2 flex items-baseline justify-between gap-4">
          <label
            htmlFor="body"
            className="font-mono text-xs tracking-widest text-text-secondary uppercase"
          >
            Comentário
          </label>
          <CharacterCounter current={body.length} max={COMMENT_BODY_MAX} />
        </div>
        <textarea
          id="body"
          name="body"
          required
          minLength={3}
          maxLength={COMMENT_BODY_MAX}
          rows={5}
          value={body}
          placeholder="Escreva seu comentário..."
          onFocus={markStarted}
          onChange={(event) => {
            markStarted();
            setBody(clamp(event.target.value, COMMENT_BODY_MAX));
          }}
          className="glass-panel w-full rounded-xl border border-glass-border bg-transparent px-4 py-3 text-sm leading-relaxed text-text-primary outline-none focus:border-accent/40"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        onClick={markStarted}
        className="font-mono rounded-full border border-accent/40 px-5 py-2.5 text-xs tracking-widest text-accent uppercase transition-colors hover:bg-accent/10 disabled:opacity-50"
      >
        {pending ? "Enviando..." : "Enviar comentário"}
      </button>

      {state.message && !state.ok && (
        <p className="font-mono text-xs tracking-widest text-red-400 uppercase" role="alert">
          {state.message}
        </p>
      )}

      {state.message && state.ok && (
        <p className="font-mono text-xs tracking-widest text-accent uppercase" role="status">
          {state.message}
        </p>
      )}
    </form>
  );
}
