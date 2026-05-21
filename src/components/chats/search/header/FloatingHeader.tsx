import { GradientBlur } from '@components/ui'
import { springy } from '@constants/animations'
import { quickSpring } from '@constants/easings'
import { base } from '@design/base'
import { useInsets } from '@hooks'
import type React from 'react'
import { useTranslation } from 'react-i18next'
import Animated, { type SharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated'
import { styles } from './Header.styles'

type FloatingHeaderProps = {
  scrollY: SharedValue<number>
  headerHeight: number
}

export default function FloatingHeader({ scrollY }: FloatingHeaderProps): React.JSX.Element {
  const insets = useInsets()
  const { t } = useTranslation('common')

  const topInset = insets.top + base.spacing.xl

  const animatedViewStyle = useAnimatedStyle(
    () => ({
      opacity: withSpring(scrollY.get() >= topInset / 2 ? 1 : 0, quickSpring),
    }),
    [topInset],
  )

  const animatedTextStyle = useAnimatedStyle(
    () => ({
      transform: [{ translateY: withSpring(scrollY.get() >= topInset / 2 ? 0 : 20, springy) }],
    }),
    [topInset],
  )

  return (
    <Animated.View pointerEvents="none" style={[styles.floatingHeader(insets.top), animatedViewStyle]}>
      <GradientBlur direction="top-to-bottom" />
      <Animated.Text style={[styles.title(false), animatedTextStyle]}>{t('common:chats.search.title')}</Animated.Text>
    </Animated.View>
  )
}
