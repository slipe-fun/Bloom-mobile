import { Button, Icon, Loader } from '@components/ui'
import { getFadeIn, getFadeOut, layoutAnimationSpringy } from '@constants/animations'
import { base } from '@design/base'
import { useAuthFooter, useInsets } from '@hooks'
import { KeyboardStickyView, useReanimatedKeyboardAnimation } from 'react-native-keyboard-controller'
import Animated, { interpolate, interpolateColor, useAnimatedStyle } from 'react-native-reanimated'
import { useUnistyles } from 'react-native-unistyles'
import { useAnimatedTheme } from 'react-native-unistyles/reanimated'
import { styles } from './Footer.styles'

export default function AuthFooter() {
  const insets = useInsets()
  const { theme } = useUnistyles()
  const animatedTheme = useAnimatedTheme()
  const { index, label, isDisabled, progress, loading, handlePress } = useAuthFooter()
  const { progress: keyboardProgress } = useReanimatedKeyboardAnimation()

  const animatedButtonBackgroundStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1, 2, 3],
      [
        animatedTheme.value.colors.foregroundTransparent,
        animatedTheme.value.colors.foregroundTransparent,
        animatedTheme.value.colors.primary,
        animatedTheme.value.colors.red,
      ],
    ),
    transform: [{ scaleX: interpolate(keyboardProgress.value, [0, 1], [1, 1.2]) }],
  }))

  const animatedLabelStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      progress.value,
      [0, 1, 2, 3],
      [
        animatedTheme.value.colors.text,
        animatedTheme.value.colors.secondaryText,
        animatedTheme.value.colors.white,
        animatedTheme.value.colors.white,
      ],
    ),
  }))

  return (
    <KeyboardStickyView offset={{ opened: -base.spacing.lg, closed: -insets.bottom }} style={styles.footer}>
      <Button
        disabled={isDisabled}
        onPress={handlePress}
        style={styles.button}
        size="xl"
        elevated={false}
        variant="textIcon"
        icon={
          index === 0 ? (
            <Animated.View entering={getFadeIn()} exiting={getFadeOut()}>
              <Icon key="at-icon" size={26} color={theme.colors.text} icon="at" />
            </Animated.View>
          ) : loading ? (
            <Loader color={theme.colors.white} size={20} />
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
