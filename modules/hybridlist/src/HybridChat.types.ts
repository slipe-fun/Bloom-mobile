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
  seen: boolean
  date: string
  me: boolean
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
  onItemPress?: (event: OnItemPressEvent) => void
}
