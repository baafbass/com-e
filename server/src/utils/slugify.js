/** Converts text to a URL-friendly slug: "Home & Living" -> "home-living". */
export const slugify = (text) =>
  text
    .toString()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
