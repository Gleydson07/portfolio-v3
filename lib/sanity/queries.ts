const postSearchFilter = `_type == "post" && defined(slug.current) && (
  ($titlePattern == "" || lower(title) match $titlePattern) &&
  ($filterTag == "" || $filterTag in tags)
)`;

const postListProjection = `{
  _id,
  title,
  "slug": slug.current,
  excerpt,
  publishedAt,
  "listImage": coalesce(listImage, heroImage, mainImage),
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
  "listImage": coalesce(listImage, heroImage, mainImage),
  "heroImage": coalesce(heroImage, listImage, mainImage),
  "ogImage": coalesce(ogImage, heroImage, listImage, mainImage),
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

export const postTagsQuery = `array::unique(*[_type == "post" && defined(tags) && count(tags) > 0].tags[]) | order(@ asc)`;
