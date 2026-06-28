export const POSTS_PAGE_SIZE = 20;

/** Proporção 16:9 usada em capas e imagens do blog. */
export const POST_IMAGE_ASPECT = 16 / 9;

/** Capa da listagem — ideal 1280×720 px na produção. */
export const POST_LIST_WIDTH = 1280;

/** Capa do artigo — ideal 1920×1080 px na produção. */
export const POST_HERO_WIDTH = 1920;

/** Open Graph — ideal 1200×630 px na produção. */
export const POST_OG_WIDTH = 1200;
export const POST_OG_HEIGHT = 630;

export function postImageHeight(width: number) {
  return Math.round((width * 9) / 16);
}
