import type { ICONS } from '@constants/icons'
import type { staticColors } from '@design/colors'
import type { JSX } from 'react'

interface ChatLastMessage {
  content?: string
  date?: string
}

export interface ChatUser {
  id: string
  username?: string
  display_name?: string | null
  description?: string | null
  avatar?: string | null
  date?: string
}

export interface User extends ChatUser {
  kyber_public_key?: string
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
  id?: number
  key: string
  recipient?: ChatUser
  me?: ChatUser
}

export interface DateHeader {
  _id: string
  type: string
  date: Date
  text: string
}

export type ColorKey = keyof typeof staticColors | null

export interface SettingsItem {
  icon?: keyof typeof ICONS
  label?: string
  color?: ColorKey
  children?: JSX.Element
  disabled?: boolean
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
