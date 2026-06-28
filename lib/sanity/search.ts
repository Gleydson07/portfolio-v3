export function buildPostSearchParams(title: string, tag: string) {
  const normalizedTitle = title.trim().toLowerCase();
  const normalizedTag = tag.trim();

  return {
    titlePattern: normalizedTitle ? `*${normalizedTitle}*` : "",
    filterTag: normalizedTag,
  };
}
