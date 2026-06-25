export function buildPostSearchParams(search: string) {
  const normalized = search.trim().toLowerCase();

  return {
    search: normalized,
    titlePattern: normalized ? `*${normalized}*` : "",
    tagPattern: normalized ? `*${normalized}*` : "",
  };
}
