export const siteSettingsQuery = `*[_type == "siteSettings"][0]`;

export const pageBySlugQuery = `*[_type == "page" && slug.current == $slug][0]`;

export const allArticlesQuery = `*[_type == "article"] | order(publishedAt desc) {
  ...,
  category->
}`;

export const articleBySlugQuery = `*[_type == "article" && slug.current == $slug][0] {
  ...,
  category->
}`;

export const allAircraftQuery = `*[_type == "aircraft"] | order(category asc, sortOrder asc, name asc)`;

export const allGalleryImagesQuery = `*[_type == "galleryImage"] | order(date desc)`;

export const allCategoriesQuery = `*[_type == "category"]`;
