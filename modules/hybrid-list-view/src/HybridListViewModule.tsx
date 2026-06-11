import { requireNativeModule } from 'expo'
import type * as React from 'react'
import type { HybridListViewProps } from './HybridListView.types'

const NativeView: React.ComponentType<HybridListViewProps> = requireNativeModule('HybridListView')

export default function HybridListView({ data, theme, onItemPress, style }: HybridListViewProps) {
  return <NativeView data={data} theme={theme} onItemPress={onItemPress} style={style} />
}
