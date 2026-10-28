export const siteSettingsQuery = `*[_type == "siteSettings"][0]`;

export const allArticlesQuery = `*[_type == "article" && defined(slug.current)] | order(publishedAt desc) {
  ...,
  category->
}`;

export const latestArticlesQuery = `*[_type == "article" && defined(slug.current)] | order(publishedAt desc)[0...$limit] {
  ...,
  category->
}`;

export const articleBySlugQuery = `*[_type == "article" && slug.current == $slug][0] {
  ...,
  category->
}`;

/** Events that have not ended before `$since` (start of today). */
export const upcomingEventsQuery = `*[_type == "event" && coalesce(endDate, startDate) >= $since] | order(startDate asc)`;

export const allAircraftQuery = `*[_type == "aircraft"] | order(category asc, sortOrder asc, name asc)`;

export const allTariffsQuery = `*[_type == "tariff"]`;

export const allClubPagesQuery = `*[_type == "clubPage"]`;

export const clubHistoryQuery = `*[_type == "clubHistory"][0]`;

export const allFlightStoriesQuery = `*[_type == "flightStory"] | order(flightDate desc)`;

export const allGalleryImagesQuery = `*[_type == "galleryImage"] | order(date desc)`;
