import { Input } from '@components/ui'
import { layoutAnimation, springy } from '@constants/animations'
import { PRESSABLE_INPUT_SCALE } from '@constants/animations/values'
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'
import { styles } from './Footer.styles'

type MessageInputProps = {
  setValue: (value: string) => void
  value: string
}

const AnimatedInput = Animated.createAnimatedComponent(Input)

export default function MessageInput({ setValue, value }: MessageInputProps) {
  const scale = useSharedValue(1)

  const handlePress = (inn: boolean = true) => {
    scale.set(withSpring(inn ? PRESSABLE_INPUT_SCALE : 1, springy))
  }

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.get() }],
  }))

  return (
    <Animated.View
      onTouchStart={() => handlePress(true)}
      onTouchMove={() => handlePress(false)}
      onTouchEnd={() => handlePress(false)}
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
