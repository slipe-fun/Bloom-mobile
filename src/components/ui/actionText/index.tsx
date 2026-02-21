import { type GestureResponderEvent, type StyleProp, Text, type TextProps, type TextStyle } from 'react-native'
import { styles } from './ActionText.styles'

type ActionTextProps = Omit<TextProps, 'children'> & {
  text: string
  actionText?: string
  onPress?: (event: GestureResponderEvent) => void
  actionStyle?: StyleProp<TextStyle>
}

export default function ActionText({ text, actionText, onPress, style, actionStyle, ...props }: ActionTextProps) {
  if (!actionText) {
    return <Text style={styles.text}>{text}</Text>
  }

  const parts = text.split(actionText)

  return (
    <Text style={[styles.text, style]} {...props}>
      {parts[0]}
      <Text style={[styles.actionText, actionStyle]} onPress={onPress}>
        {' '}
        {actionText}{' '}
      </Text>
      {parts[1]}
    </Text>
  )
}
