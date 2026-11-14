export const siteSettingsQuery = `*[_type == "siteSettings"][0]`;

export const allPartnersQuery = `*[_type == "partner"] | order(sortOrder asc, name asc)`;

export const pricingPageQuery = `*[_type == "pricingPage"][0]`;

export const joinPageQuery = `*[_type == "joinPage"][0]`;

export const discoverPageQuery = `*[_type == "discoverPage"][0]`;

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

export const initiationTariffsQuery = `*[_type == "tariff" && offer == "vol-initiation"]`;

export const allClubPagesQuery = `*[_type == "clubPage"]`;

export const clubHistoryQuery = `*[_type == "clubHistory"][0]`;

/** The six most recent stories that have a page address. */
export const allFlightStoriesQuery = `*[_type == "flightStory" && defined(slug.current)] | order(flightDate desc)[0...6]`;

export const flightStoryBySlugQuery = `*[_type == "flightStory" && slug.current == $slug][0]`;

export const allGalleryImagesQuery = `*[_type == "galleryImage"] | order(date desc)`;
