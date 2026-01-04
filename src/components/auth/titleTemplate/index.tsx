import { Icon } from '@components/ui'
import type { ICONS } from '@constants/icons'
import type React from 'react'
import { Image, ImageSourcePropType, Text, View, type ViewStyle } from 'react-native'
import { useReanimatedKeyboardAnimation } from 'react-native-keyboard-controller'
import Animated, { interpolate, useAnimatedStyle } from 'react-native-reanimated'
import { useUnistyles } from 'react-native-unistyles'
import { styles } from './TitleTemplate.styles'

type TitleTemplateProps = {
  icon: keyof typeof ICONS
  title: string
}

export default function AuthTitleTemplate({ icon, title }: TitleTemplateProps): React.JSX.Element {
  const { progress } = useReanimatedKeyboardAnimation()
  const { theme } = useUnistyles()

  const animatedViewStyle = useAnimatedStyle(
    (): ViewStyle => ({
      transform: [{ scale: interpolate(progress.value, [0, 1], [1, 0.5], 'clamp') }],
      transformOrigin: 'center bottom 0px',
    }),
  )
  return (
    <View style={styles.titleContainer}>
      <Animated.View style={animatedViewStyle}>
        <Icon icon={icon} color={theme.colors.primary} size={108} />
      </Animated.View>
      <Text style={styles.title}>{title}</Text>
    </View>
  )
}
