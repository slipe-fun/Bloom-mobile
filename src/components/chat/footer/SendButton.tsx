import { Icon } from '@components/ui'
import { paperplaneAnimationIn, paperplaneAnimationOut, springy, zoomAnimationIn, zoomAnimationOut } from '@constants/animations'
import { useEffect } from 'react'
import { Pressable, View } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'
import { styles } from './Footer.styles'

interface SendButtonProps {
  hasValue: boolean
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

export default function SendButton({ hasValue }: SendButtonProps) {
  const scale = useSharedValue(0)

  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.get() }],
    opacity: scale.get(),
  }))

  useEffect(() => {
    scale.set(withSpring(hasValue ? 1 : 0, springy))
  }, [hasValue])

  return (
    <View style={styles.sendButtonWrapper}>
      {hasValue ? (
        <AnimatedPressable style={{ zIndex: 1 }} key="paperplane" entering={paperplaneAnimationIn} exiting={paperplaneAnimationOut}>
          <Icon size={24} icon="paperplane" uniProps={(theme) => ({ color: theme.colors.white })} />
        </AnimatedPressable>
      ) : (
        <AnimatedPressable key="waveform" entering={zoomAnimationIn} exiting={zoomAnimationOut}>
          <Icon size={24} icon="waveform" uniProps={(theme) => ({ color: theme.colors.secondaryText })} />
        </AnimatedPressable>
      )}
      <Animated.View style={[styles.sendButtonBackground, animatedButtonStyle]} />
    </View>
  )
}
