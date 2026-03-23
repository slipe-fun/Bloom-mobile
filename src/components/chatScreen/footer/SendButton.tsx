import { Button, Icon } from '@components/ui'
import { getFadeIn, getFadeOut, layoutAnimation, paperplaneAnimationIn, paperplaneAnimationOut, quickSpring } from '@constants/animations'
import { useEffect } from 'react'
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'
import { useUnistyles } from 'react-native-unistyles'
import { useAnimatedTheme } from 'react-native-unistyles/reanimated'

interface SendButtonProps {
  handleSend: () => void
  hasValue: boolean
}

export default function SendButton({ handleSend, hasValue }: SendButtonProps) {
  const { theme } = useUnistyles()
  const animatedTheme = useAnimatedTheme()
  const color = useSharedValue(1)

  const animatedButtonStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(color.get(), [1, 0], [animatedTheme.value.colors.pressable, animatedTheme.value.colors.primary]),
  }))

  useEffect(() => {
    color.set(withSpring(hasValue ? 0 : 1, quickSpring))
  }, [hasValue])

  return (
    <Button layout={layoutAnimation} style={animatedButtonStyle} onPress={handleSend} variant="icon">
      {hasValue ? (
        <Animated.View key="paperplane" entering={paperplaneAnimationIn} exiting={paperplaneAnimationOut}>
          <Icon icon="paperplane" color={theme.colors.white} />
        </Animated.View>
      ) : (
        <Animated.View key="waveform" entering={getFadeIn()} exiting={getFadeOut()}>
          <Icon icon="waveform" color={theme.colors.text} />
        </Animated.View>
      )}
    </Button>
  )
}
