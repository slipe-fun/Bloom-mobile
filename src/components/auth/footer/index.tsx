import { Button, Icon } from '@components/ui'
import { getFadeIn, getFadeOut, layoutAnimationSpringy } from '@constants/animations'
import { quickSpring } from '@constants/easings'
import { useAuthFooter, useInsets } from '@hooks'
import { useEffect } from 'react'
import { useReanimatedKeyboardAnimation } from 'react-native-keyboard-controller'
import Animated, { interpolate, interpolateColor, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'
import { useUnistyles } from 'react-native-unistyles'
import { styles } from './Footer.styles'

const AnimatedButton = Animated.createAnimatedComponent(Button)

export default function AuthFooter() {
  const insets = useInsets()
  const { theme } = useUnistyles()
  const { index, label, isDisabled, progressValue, handlePress } = useAuthFooter()
  const { progress: keyboardProgress, height: keyboardHeight } = useReanimatedKeyboardAnimation()

  const progress = useSharedValue(0)
  const labelProgress = useSharedValue(1)

  const animatedButtonStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1, 2, 3],
      [theme.colors.foreground, theme.colors.foreground, theme.colors.primary, theme.colors.red],
    ),
  }))

  const animatedViewStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: keyboardHeight.value }],
    paddingBottom: interpolate(keyboardProgress.value, [0, 1], [insets.bottom, theme.spacing.lg], 'clamp'),
    paddingHorizontal: interpolate(keyboardProgress.value, [0, 1], [theme.spacing.xxxl, theme.spacing.lg], 'clamp'),
  }))

  const animatedLabelStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      labelProgress.value,
      [0, 1, 2, 3],
      [theme.colors.text, theme.colors.secondaryText, theme.colors.white, theme.colors.white],
    ),
  }))

  useEffect(() => {
    labelProgress.value = withSpring(progressValue, quickSpring)
    progress.value = withSpring(progressValue, quickSpring)
  }, [progressValue])

  return (
    <Animated.View style={[styles.footer, animatedViewStyle]}>
      <AnimatedButton
        disabled={isDisabled}
        onPress={handlePress}
        size="xl"
        variant="textIcon"
        style={animatedButtonStyle}
        icon={
          index === 0 && (
            <Animated.View entering={getFadeIn()} exiting={getFadeOut()}>
              <Icon key="at-icon" size={26} color={theme.colors.text} icon="at" />
            </Animated.View>
          )
        }
      >
        <Animated.View layout={layoutAnimationSpringy} style={styles.partsContainer}>
          {label.split(' ').map((part, i) => (
            <Animated.Text
              key={part}
              entering={getFadeIn()}
              exiting={getFadeOut()}
              layout={layoutAnimationSpringy}
              style={[styles.buttonLabel, animatedLabelStyle]}
            >
              {part}{' '}
            </Animated.Text>
          ))}
        </Animated.View>
      </AnimatedButton>
    </Animated.View>
  )
}
