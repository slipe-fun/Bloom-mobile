import { Icon } from '@components/ui'
import { layoutAnimation } from '@constants/animations'
import { quickSpring } from '@constants/easings'
import type { ICONS } from '@constants/icons'
import useAuthStore from '@stores/auth'
import { useEffect } from 'react'
import { Text, type ViewStyle } from 'react-native'
import { useReanimatedKeyboardAnimation } from 'react-native-keyboard-controller'
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated'
import { useUnistyles } from 'react-native-unistyles'
import { styles } from './TitleTemplate.styles'

interface TitleTemplateProps {
  icon: keyof typeof ICONS
  title: string
}

export default function AuthTitleTemplate({ icon, title }: TitleTemplateProps) {
  const { progress: keyboardProgress } = useReanimatedKeyboardAnimation()
  const { theme } = useUnistyles()
  const error = useAuthStore((state) => state.error)
  const errorValue = useSharedValue(0)

  const animatedViewStyle = useAnimatedStyle(
    (): ViewStyle => ({
      transform: [{ scale: interpolate(keyboardProgress.get(), [0, 1], [1, 0.5], 'clamp') }],
      transformOrigin: 'center bottom 0px',
    }),
  )

  const animatedIconProps = useAnimatedProps(() => ({
    fill: interpolateColor(errorValue.get(), [0, 1], [theme.colors.primary, theme.colors.red]),
  }))

  useEffect(() => {
    errorValue.set(withSpring(error ? 1 : 0, quickSpring))
  }, [error])

  return (
    <Animated.View layout={layoutAnimation} style={styles.titleContainer}>
      <Animated.View style={animatedViewStyle}>
        <Icon animatedProps={animatedIconProps} icon={icon} color={theme.colors.primary} size={108} />
      </Animated.View>
      <Text style={styles.title}>{title}</Text>
    </Animated.View>
  )
}
