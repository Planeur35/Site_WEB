import {simpleText, richText} from './blocks'
import {news} from './news'
import {event} from './event'
import {glider} from './glider'
import {tariff} from './tariff'
import {flightStory} from './flightStory'
import {siteSettings} from './siteSettings'
import {clubHistory} from './clubHistory'
import {clubPage} from './clubPage'

export const schemaTypes = [
  // Contenus saisis par les membres
  news,
  event,
  // Contenus gérés par les administrateurs
  clubPage,
  glider,
  tariff,
  flightStory,
  siteSettings,
  clubHistory,
  // Types de texte réutilisables
  simpleText,
  richText,
]
