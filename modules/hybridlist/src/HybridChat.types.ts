import type { ViewProps } from 'react-native'

export type HybridChatModuleEvents = {
  onChange: (params: ChangeEventPayload) => void
}

export type ChangeEventPayload = {
  value: string
}

export interface ListItem {
  id: number
  content: string
  seen: string
  date: string
  me: boolean
  nonce: string
  chatId: number
  authorId: string
  groupEnd: boolean
  groupStart: boolean
}

export interface ListTheme {
  backgroundColor: string
  textColor: string
  secondaryTextColor: string
  primaryColor: string
  whiteColor: string
  foregroundColor: string
}

export interface OnItemPressEvent {
  nativeEvent: {
    index: number
    item: ListItem
  }
}

export interface HybridListViewProps extends ViewProps {
  data: ListItem[]
  theme: ListTheme
  contentInsetTop: number
  lastSeenId: number
  contentInsetBottom: number
  onItemPress?: (event: OnItemPressEvent) => void
}
