import type React from 'react'
import { type StyleProp, Text, View, type ViewStyle } from 'react-native'
import { styles } from './Separator.styles'

type SeparatorProps = {
  label?: string
  style?: StyleProp<ViewStyle>
  ref?: React.Ref<any>
}

export default function Separator({ label, style, ref }: SeparatorProps): React.JSX.Element {
  return (
    <View ref={ref} style={[styles.container, style]}>
      <View style={styles.line} />
      {label && (
        <>
          <Text style={styles.label}>{label}</Text>
          <View style={styles.line} />
        </>
      )}
    </View>
  )
}
