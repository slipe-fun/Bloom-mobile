import { getFadeOut, reversedZoomAnimationIn } from '@constants/animations'
import type { ICONS } from '@constants/icons'
import type React from 'react'
import { type StyleProp, Text, View, type ViewStyle } from 'react-native'
import { useReanimatedKeyboardAnimation } from 'react-native-keyboard-controller'
import Animated, { useAnimatedStyle } from 'react-native-reanimated'
import { useUnistyles } from 'react-native-unistyles'
import type { staticColor } from 'unistyles'
import Icon from '../Icon'
import { styles } from './EmptyModal.styles'

type EmptyModalProps = {
  text: string | React.JSX.Element
  style?: StyleProp<ViewStyle>
  icon?: keyof typeof ICONS
  iconElement?: React.JSX.Element
  color: keyof typeof staticColor
}

export default function EmptyModal({ text, style, icon, iconElement, color, ...props }: EmptyModalProps): React.JSX.Element {
  const { theme } = useUnistyles()
  const keyboard = useReanimatedKeyboardAnimation()

  const animatedStyles = useAnimatedStyle((): ViewStyle => {
    return { transform: [{ translateY: keyboard.height.value / 2 }] }
  })

  return (
    <Animated.View style={[styles.wrapper, animatedStyles]}>
      <Animated.View entering={reversedZoomAnimationIn} exiting={getFadeOut()} style={[styles.modal, style]} {...props}>
        {!iconElement ? (
          <View style={styles.iconWrapper(color)}>
            <Icon size={40} color={theme.colors[color]} icon={icon} />
          </View>
        ) : (
          iconElement
        )}
        <Text style={styles.title}>{text}</Text>
      </Animated.View>
    </Animated.View>
  )
}
