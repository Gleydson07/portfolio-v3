"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { captureArticleSpeechControl } from "@/lib/analytics/track";

type ArticleSpeechPlayerProps = {
  text: string;
  className?: string;
  postSlug: string;
  postTitle: string;
};

type PlaybackState = "idle" | "playing" | "paused";

const PREFERRED_VOICE_NAMES = [
  "microsoft maria",
  "google português do brasil",
  "google portugues do brasil",
  "luciana",
  "francisca",
  "fernanda",
];

const iconButtonClassName =
  "flex h-9 w-9 items-center justify-center rounded-full border border-glass-border text-accent transition-colors hover:border-accent/50 hover:bg-accent/10 disabled:cursor-not-allowed disabled:opacity-40";

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
      <path d="M8 5.14v13.72c0 .79.87 1.27 1.54.84l11.14-6.86a1 1 0 0 0 0-1.7L9.54 4.3A1 1 0 0 0 8 5.14Z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
      <path d="M7 5h3v14H7V5zm7 0h3v14h-3V5z" />
    </svg>
  );
}

function StopIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5" aria-hidden="true">
      <path d="M7 7h10v10H7V7z" />
    </svg>
  );
}

type ControlButtonProps = {
  label: string;
  onClick: () => void;
  children: ReactNode;
  disabled?: boolean;
};

function ControlButton({ label, onClick, children, disabled = false }: ControlButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={iconButtonClassName}
    >
      {children}
    </button>
  );
}

function normalizeVoiceName(name: string) {
  return name.toLowerCase().normalize("NFD").replace(/\p{M}/gu, "");
}

function isBrazilianPortugueseVoice(voice: SpeechSynthesisVoice) {
  const lang = voice.lang.toLowerCase();
  return lang === "pt-br" || lang.startsWith("pt-br-") || lang.startsWith("pt_br");
}

function voiceScore(voice: SpeechSynthesisVoice) {
  const normalizedName = normalizeVoiceName(voice.name);
  const preferredIndex = PREFERRED_VOICE_NAMES.findIndex((candidate) =>
    normalizedName.includes(normalizeVoiceName(candidate)),
  );

  if (preferredIndex >= 0) {
    return 100 - preferredIndex;
  }

  if (voice.localService) {
    return 10;
  }

  return 1;
}

function pickBrazilianPortugueseVoice(voices: SpeechSynthesisVoice[]) {
  const brazilianVoices = voices.filter(isBrazilianPortugueseVoice);
  if (brazilianVoices.length === 0) return null;

  return brazilianVoices.sort((a, b) => voiceScore(b) - voiceScore(a))[0];
}

function useBrazilianPortugueseVoice() {
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setSupported(false);
      return;
    }

    const syncVoice = () => {
      const selected = pickBrazilianPortugueseVoice(window.speechSynthesis.getVoices());
      setVoice(selected);
      setSupported(Boolean(selected));
    };

    syncVoice();
    window.speechSynthesis.addEventListener("voiceschanged", syncVoice);

    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", syncVoice);
    };
  }, []);

  return { voice, supported };
}

export function ArticleSpeechPlayer({
  text,
  className = "",
  postSlug,
  postTitle,
}: ArticleSpeechPlayerProps) {
  const [playbackState, setPlaybackState] = useState<PlaybackState>("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const { voice, supported } = useBrazilianPortugueseVoice();

  const cancelSpeech = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    utteranceRef.current = null;
    setPlaybackState("idle");
    setStatusMessage("");
  }, []);

  const stop = useCallback(() => {
    cancelSpeech();
    captureArticleSpeechControl("stop", { postSlug, postTitle });
  }, [cancelSpeech, postSlug, postTitle]);

  const play = useCallback(() => {
    if (!text || typeof window === "undefined" || !("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();
    captureArticleSpeechControl("play", { postSlug, postTitle });

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "pt-BR";
    if (voice) {
      utterance.voice = voice;
    }

    utterance.onstart = () => {
      setPlaybackState("playing");
      setStatusMessage("Lendo artigo.");
    };

    utterance.onend = () => {
      utteranceRef.current = null;
      setPlaybackState("idle");
      setStatusMessage("Leitura concluída.");
      captureArticleSpeechControl("completed", { postSlug, postTitle });
    };

    utterance.onerror = () => {
      utteranceRef.current = null;
      setPlaybackState("idle");
      setStatusMessage("Não foi possível iniciar a leitura.");
      captureArticleSpeechControl("error", { postSlug, postTitle });
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [text, voice, postSlug, postTitle]);

  const pause = useCallback(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    if (playbackState !== "playing") return;

    window.speechSynthesis.pause();
    setPlaybackState("paused");
    setStatusMessage("Leitura pausada.");
    captureArticleSpeechControl("pause", { postSlug, postTitle });
  }, [playbackState, postSlug, postTitle]);

  const resume = useCallback(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    if (playbackState !== "paused") return;

    window.speechSynthesis.resume();
    setPlaybackState("playing");
    setStatusMessage("Leitura retomada.");
    captureArticleSpeechControl("resume", { postSlug, postTitle });
  }, [playbackState, postSlug, postTitle]);

  useEffect(() => () => cancelSpeech(), [cancelSpeech]);

  if (!text) return null;

  return (
    <div
      className={`flex items-center gap-1.5 ${className}`}
      role="group"
      aria-label="Controles de leitura em voz alta"
    >
      {playbackState === "idle" && (
        <ControlButton label="Ouvir artigo" onClick={play} disabled={!supported}>
          <PlayIcon />
        </ControlButton>
      )}

      {playbackState === "playing" && (
        <>
          <ControlButton label="Pausar leitura" onClick={pause}>
            <PauseIcon />
          </ControlButton>
          <ControlButton label="Parar leitura" onClick={stop}>
            <StopIcon />
          </ControlButton>
        </>
      )}

      {playbackState === "paused" && (
        <>
          <ControlButton label="Continuar leitura" onClick={resume}>
            <PlayIcon />
          </ControlButton>
          <ControlButton label="Parar leitura" onClick={stop}>
            <StopIcon />
          </ControlButton>
        </>
      )}

      <p className="sr-only" aria-live="polite">
        {!supported ? "Leitura em voz alta não disponível neste navegador." : statusMessage}
      </p>
    </div>
  );
}
