import { staticColors } from '@design/colors'
import type { TabValue } from '@interfaces'
import type { ICONS } from './icons'

export const TAB_COLORS = (backdrop?: boolean): Record<TabValue, string> =>
  ({
    Friends: staticColors[backdrop ? 'orangeBackdrop' : 'orange'],
    Explore: staticColors[backdrop ? 'yellowBackdrop' : 'yellow'],
    index: staticColors[backdrop ? 'primaryBackdrop' : 'primary'],
    Settings: staticColors[backdrop ? 'pinkBackdrop' : 'pink'],
  }) as const

export const TAB_ICONS: Record<TabValue, keyof typeof ICONS> = {
  index: 'message',
  Explore: 'compass',
  Settings: 'gear',
  Friends: 'person.circle',
} as const
