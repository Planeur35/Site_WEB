import { simpleText, richText } from './blocks';
import siteSettings from './siteSettings';
import page from './page';
import article from './article';
import category from './category';
import aircraft from './aircraft';
import galleryImage from './galleryImage';
import event from './event';
import tariff from './tariff';
import clubPage from './clubPage';
import clubHistory from './clubHistory';
import flightStory from './flightStory';

export const schemas = [
  // Entered by members
  article,
  event,
  galleryImage,
  // Managed by administrators
  siteSettings,
  clubPage,
  clubHistory,
  aircraft,
  tariff,
  flightStory,
  category,
  page,
  // Reusable text types
  simpleText,
  richText,
];
