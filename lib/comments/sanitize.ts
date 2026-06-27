import sanitizeHtml from "sanitize-html";

export function sanitizeCommentBody(body: string): string {
  return sanitizeHtml(body, {
    allowedTags: [],
    allowedAttributes: {},
  }).trim();
}
