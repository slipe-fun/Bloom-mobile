import type { ICONS } from '@constants/icons'
import type { staticColors } from '@design/colors'
import type { JSX } from 'react'

interface ChatLastMessage {
  content?: string
  date?: Date
}

interface ChatLastMessageView extends ChatLastMessage {
  time?: string
}

export interface User {
  id: string
  username?: string
  display_name?: string | null
  description?: string | null
  avatar?: string | null
  date?: string
  ml_kem_public_key?: string
  ecdh_public_key?: string
  ed_public_key?: string
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
  formatted_date?: string
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

export type IconType = 'transparent' | 'gradient'
export type ColorKey = keyof typeof staticColors | null

export interface SettingsItem {
  icon?: keyof typeof ICONS
  label?: string
  color?: ColorKey
  children?: JSX.Element
  badgeLabel?: string | number
  badgeIcon?: keyof typeof ICONS
  type?: 'link' | 'toggle' | 'button' | 'custom'
  toggleValue?: boolean
  action?: () => void
}

export interface SettingsSection {
  id: string
  description?: string
  title?: string
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

export interface ChatsEmptyCardData {
  avatar: any
  nameWidth: number
  messageWidth: number
}

export interface SettingsDemoMessageData {
  avatar: any
  messageWidth: number
  me: boolean
}
