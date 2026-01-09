import { Button, Icon, Loader } from '@components/ui'
import { getFadeIn, getFadeOut, layoutAnimationSpringy } from '@constants/animations'
import { useAuthFooter, useInsets } from '@hooks'
import { KeyboardStickyView, useReanimatedKeyboardAnimation } from 'react-native-keyboard-controller'
import Animated, { interpolate, interpolateColor, useAnimatedStyle } from 'react-native-reanimated'
import { useUnistyles } from 'react-native-unistyles'
import { styles } from './Footer.styles'

const AnimatedLoader = Animated.createAnimatedComponent(Loader)

export default function AuthFooter() {
  const insets = useInsets()
  const { theme } = useUnistyles()
  const { index, label, isDisabled, progress, loading, handlePress } = useAuthFooter()
  const { progress: keyboardProgress } = useReanimatedKeyboardAnimation()

  const animatedButtonBackgroundStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1, 2, 3],
      [theme.colors.foregroundTransparent, theme.colors.foregroundTransparent, theme.colors.primary, theme.colors.red],
    ),
    transform: [{ scaleX: interpolate(keyboardProgress.value, [0, 1], [1, 1.2]) }],
  }))

  const animatedLabelStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      progress.value,
      [0, 1, 2, 3],
      [theme.colors.text, theme.colors.secondaryText, theme.colors.white, theme.colors.white],
    ),
  }))

  return (
    <KeyboardStickyView offset={{ opened: -theme.spacing.lg, closed: -insets.bottom }} style={styles.footer}>
      <Button
        disabled={isDisabled}
        onPress={handlePress}
        style={styles.button}
        size="xl"
        variant="textIcon"
        icon={
          index === 0 ? (
            <Animated.View entering={getFadeIn()} exiting={getFadeOut()}>
              <Icon key="at-icon" size={26} color={theme.colors.text} icon="at" />
            </Animated.View>
          ) : loading ? (
            <AnimatedLoader color={theme.colors.white} size={20} entering={getFadeIn()} exiting={getFadeOut()} />
          ) : null
        }
      >
        <Animated.View style={[styles.buttonBackground, animatedButtonBackgroundStyle]} />
        <Animated.View layout={layoutAnimationSpringy} style={styles.partsContainer}>
          {label.split(' ').map((part) => (
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
      </Button>
    </KeyboardStickyView>
  )
}
