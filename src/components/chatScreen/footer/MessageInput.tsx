import { Input } from '@components/ui'
import { layoutAnimation, quickSpring, springy } from '@constants/animations'
import { PRESSABLE_INPUT_SCALE } from '@constants/animations/values'
import { base } from '@design/base'
import { useInsets } from '@hooks'
import type { Chat } from '@interfaces'
import { useCallback } from 'react'
import type { LayoutChangeEvent } from 'react-native'
import Animated, { type SharedValue, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'
import { styles } from './Footer.styles'

type MessageInputProps = {
  setValue: (value: string) => void
  value: string
  footerHeight: SharedValue<number>
  recipient: Chat['recipient']
}

const AnimatedInput = Animated.createAnimatedComponent(Input)

export default function MessageInput({ setValue, value, footerHeight }: MessageInputProps) {
  const insets = useInsets()
  const scale = useSharedValue(1)

  const onInputLayout = useCallback(
    (e: LayoutChangeEvent) => {
      const height = e.nativeEvent.layout.height

      footerHeight.set(withSpring(height + insets.bottom + base.spacing.md, quickSpring))
    },
    [footerHeight],
  )

  const handlePress = (inn: boolean = true) => {
    scale.set(withSpring(inn ? PRESSABLE_INPUT_SCALE : 1, springy))
  }

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.get() }],
  }))

  return (
    <Animated.View
      onTouchStart={() => handlePress(true)}
      onTouchEnd={() => handlePress(false)}
      onLayout={onInputLayout}
      layout={layoutAnimation}
      style={[styles.messageInputWrapper, animatedStyle]}
    >
      <AnimatedInput
        basic
        layout={layoutAnimation}
        numberOfLines={7}
        onChangeText={setValue}
        multiline
        submitBehavior="newline"
        size="md"
        returnKeyType="previous"
        value={value}
        placeholder="Cообщение..."
      />
    </Animated.View>
  )
}
