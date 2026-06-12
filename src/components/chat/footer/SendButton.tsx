import { Icon } from '@components/ui'
import { paperplaneAnimationIn, paperplaneAnimationOut, springy, zoomAnimationIn, zoomAnimationOut } from '@constants/animations'
import type { ListItem } from '@modules/hybridlist'
import { useEffect } from 'react'
import { Pressable, View } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'
import { styles } from './Footer.styles'

interface SendButtonProps {
  value: string
  setValue: (value: string) => void
  handleSend: (item: ListItem) => void
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

export default function SendButton({ value, setValue, handleSend }: SendButtonProps) {
  const scale = useSharedValue(0)

  const hasValue = !!value.trim()

  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.get() }],
    opacity: scale.get(),
  }))

  const send = () => {
    handleSend({ id: Math.floor(Math.random() * 10000), content: value, seen: false, date: '123', me: true })
    setValue('')
  }

  useEffect(() => {
    scale.set(withSpring(hasValue ? 1 : 0, springy))
  }, [hasValue])

  return (
    <View style={styles.sendButtonWrapper}>
      {hasValue ? (
        <AnimatedPressable
          onPress={send}
          style={{ zIndex: 1 }}
          key="paperplane"
          entering={paperplaneAnimationIn}
          exiting={paperplaneAnimationOut}
        >
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
