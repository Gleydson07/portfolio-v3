import sanitizeHtml from "sanitize-html";

export function sanitizeCommentBody(body: string): string {
  const normalized = body.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  return sanitizeHtml(normalized, {
    allowedTags: [],
    allowedAttributes: {},
    textFilter: (text) => text,
  }).trim();
}
