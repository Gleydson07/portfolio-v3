import { createHmac, timingSafeEqual } from "crypto";

const TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;

type ModerationAction = "approve" | "reject";

type TokenPayload = {
  commentId: string;
  action: ModerationAction;
  exp: number;
};

function getSecret(): string {
  const secret = process.env.MODERATION_ACTION_SECRET;
  if (!secret) {
    throw new Error("MODERATION_ACTION_SECRET não configurado.");
  }
  return secret;
}

function signPayload(encodedPayload: string): string {
  return createHmac("sha256", getSecret()).update(encodedPayload).digest("base64url");
}

function encodePayload(payload: TokenPayload): string {
  return Buffer.from(JSON.stringify(payload)).toString("base64url");
}

export function createModerationToken(commentId: string, action: ModerationAction): string {
  const payload: TokenPayload = {
    commentId,
    action,
    exp: Date.now() + TOKEN_TTL_MS,
  };

  const encoded = encodePayload(payload);
  return `${encoded}.${signPayload(encoded)}`;
}

export function verifyModerationToken(
  token: string,
  expectedAction: ModerationAction
): { commentId: string } | null {
  try {
    const [encoded, signature] = token.split(".");
    if (!encoded || !signature) return null;

    const expectedSignature = signPayload(encoded);
    const signatureBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expectedSignature);

    if (
      signatureBuffer.length !== expectedBuffer.length ||
      !timingSafeEqual(signatureBuffer, expectedBuffer)
    ) {
      return null;
    }

    const payload = JSON.parse(
      Buffer.from(encoded, "base64url").toString("utf8")
    ) as TokenPayload;

    if (payload.action !== expectedAction || payload.exp < Date.now()) {
      return null;
    }

    return { commentId: payload.commentId };
  } catch {
    return null;
  }
}
