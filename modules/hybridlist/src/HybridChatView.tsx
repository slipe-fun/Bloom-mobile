import { requireNativeViewManager } from 'expo-modules-core'
import type * as React from 'react'
import type { HybridListViewProps } from './HybridChat.types'

const NativeView: React.ComponentType<HybridListViewProps> = requireNativeViewManager('HybridListView')

export default function HybridListView({ data, theme, contentInsetBottom, contentInsetTop, onItemPress, style }: HybridListViewProps) {
  return (
    <NativeView
      contentInsetBottom={contentInsetBottom}
      contentInsetTop={contentInsetTop}
      data={data}
      theme={theme}
      onItemPress={onItemPress}
      style={style}
    />
  )
}
