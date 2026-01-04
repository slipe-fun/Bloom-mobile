import type { TabValue } from '@interfaces'
import { staticColor } from 'unistyles'
import type { ICONS } from './icons'

export const TAB_COLORS = (backdrop?: boolean): Record<TabValue, string> =>
  ({
    tab_friends: staticColor[backdrop ? 'greenBackdrop' : 'green'],
    tab_search: staticColor[backdrop ? 'yellowBackdrop' : 'yellow'],
    tab_chats: staticColor[backdrop ? 'primaryBackdrop' : 'primary'],
    tab_settings: staticColor[backdrop ? 'pinkBackdrop' : 'pink'],
  }) as const

export const TAB_ICONS: Record<TabValue, keyof typeof ICONS> = {
  tab_chats: 'message',
  tab_search: 'compass',
  tab_settings: 'gear',
  tab_friends: 'person.circle',
} as const
