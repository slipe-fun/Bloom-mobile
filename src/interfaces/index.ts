import type { ICONS } from '@constants/icons'
import type { ROUTES } from '@constants/routes'
import type { staticColor } from 'unistyles'

interface ChatLastMessage {
  content?: string
  date?: Date
}

interface ChatLastMessageView extends ChatLastMessage {
  time?: string
}

type TabsObject = typeof ROUTES.tabs

export interface User {
  date: Date
  display_name: string
  id: number
  username: string
  description: string
  avatar: string
  friends_count: number
  email: string
}

export interface Message {
  id: number
  date: Date
  isMe?: boolean
  isSending?: boolean
  content: string
  author_id: number
  chat_id: number
  seen?: Date
  nonce?: string
  reply_to?: Message
  type?: string
  groupStart?: boolean
  groupEnd?: boolean
}

export interface Chat {
  unreadCount?: number
  last_message?: ChatLastMessage
  members?: Member[]
  avatar?: string
  id?: number
  recipient?: Member
}

export interface ChatView extends Chat {
  lastMessage?: ChatLastMessageView
}

export interface Position {
  top: number
  left: number
  width: number
}

export interface DateHeader {
  _id: string
  type: string
  date: Date
  text: string
}

export interface Option {
  icon?: keyof typeof ICONS
  label?: string
  action?: (payload?: string) => void
  color?: string
  separator?: boolean
}

export type TabValue = TabsObject[keyof TabsObject]
export type TabBarType = 'default' | 'edit' | 'settings'

export type IconType = 'transparent' | 'gradient'
export type ColorKey = keyof typeof staticColor | null

export interface SettingsItem {
  icon?: keyof typeof ICONS
  iconType?: IconType
  label: string
  color: ColorKey
  badgeLabel?: string | number
  badgeIcon?: keyof typeof ICONS
  type?: 'link' | 'toggle' | 'button'
}

export interface SettingsSection {
  id: string
  description?: string
  items: SettingsItem[]
}

export interface Member {
  display_name?: string | null
  id: number
  username: string
  avatar: string
}

export interface SearchUser {
  date: Date
  display_name: string | null
  id: number
  username: string | null
  avatar: string
}
