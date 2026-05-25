import { Icon } from '@components/ui'
import { charAnimationIn, charAnimationOut, layoutAnimationSpringy, springy, springyChar } from '@constants/animations'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Animated, {
  cancelAnimation,
  Easing,
  interpolateColor,
  type SharedValue,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from 'react-native-reanimated'
import { useUnistyles } from 'react-native-unistyles'
import { useAnimatedTheme } from 'react-native-unistyles/reanimated'
import type { Status } from '.'
import { styles } from './header.styles'

interface TitleProps {
  state: Status
  scrollY: SharedValue<number>
}

export default function Title({ state, scrollY }: TitleProps) {
  const animatedTheme = useAnimatedTheme()
  const color = useSharedValue(0)
  const { theme } = useUnistyles()
  const rotation = useSharedValue(0)
  const { t } = useTranslation('common')
  const rotating = useSharedValue(false)

  const title = state === 'connected' ? 'Bloom' : t('common:chats.header.titleConnecting')

  const startRotation = () => {
    rotating.set(true)
    color.set(withSpring(1, springy))
    rotation.set(withRepeat(withTiming(360, { duration: 2000, easing: Easing.linear }), -1, false))
  }

  const stopRotation = () => {
    color.set(withSpring(0, springy))
    rotating.set(false)
    cancelAnimation(rotation)
    rotation.set(withSpring(0, springy))
  }

  const animatedStyle = useAnimatedStyle(() => {
    const degress = rotating.get() ? rotation.get() : Math.min(0, scrollY.get() / 3)
    return {
      transform: [{ rotate: `${degress}deg` }],
    }
  })

  const animatedProps = useAnimatedProps(() => {
    return {
      fill: interpolateColor(color.get(), [0, 1], [animatedTheme.value.colors.primary, animatedTheme.value.colors.yellow]),
    }
  })

  useEffect(() => {
    if (state === 'connected') {
      stopRotation()
    } else {
      startRotation()
    }

    return () => cancelAnimation(rotation)
  }, [state])

  return (
    <Animated.View key="connected" layout={layoutAnimationSpringy} style={styles.container}>
      <Animated.View style={animatedStyle} layout={layoutAnimationSpringy}>
        <Icon color={theme.colors.primary} animatedProps={animatedProps} icon="logo" size={30} />
      </Animated.View>
      <Animated.View style={styles.row} layout={layoutAnimationSpringy}>
        {title.split('').map((char, i) => (
          <Animated.Text
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanaion>
            key={`${char}-${i}`}
            entering={charAnimationIn(springyChar(i / 2, true), true)}
            exiting={charAnimationOut(springyChar(i / 2, true), true)}
            layout={layoutAnimationSpringy}
            style={styles.text}
          >
            {char}
          </Animated.Text>
        ))}
      </Animated.View>
    </Animated.View>
  )
}
