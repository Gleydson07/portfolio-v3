const postSearchFilter = `_type == "post" && defined(slug.current) && (
  $search == "" ||
  lower(title) match $titlePattern ||
  count((tags)[lower(@) match $tagPattern]) > 0
)`;

const postListProjection = `{
  _id,
  title,
  "slug": slug.current,
  excerpt,
  publishedAt,
  mainImage,
  tags
}`;

export const postsPaginatedQuery = `{
  "posts": *[${postSearchFilter}] | order(publishedAt desc) [$start...$end] ${postListProjection},
  "total": count(*[${postSearchFilter}])
}`;

export const postBySlugQuery = `*[_type == "post" && slug.current == $slug][0] {
  _id,
  title,
  "slug": slug.current,
  excerpt,
  publishedAt,
  mainImage,
  tags,
  body
}`;

export const postSlugsQuery = `*[_type == "post" && defined(slug.current)]{
  "slug": slug.current,
  publishedAt
}`;

export const postsSitemapQuery = `*[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
  "slug": slug.current,
  publishedAt
}`;

export const postsByIdsQuery = `*[_type == "post" && _id in $ids]{
  _id,
  title,
  "slug": slug.current
}`;
