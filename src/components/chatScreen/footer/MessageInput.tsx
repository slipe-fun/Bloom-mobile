import { Input } from '@components/ui'
import { getFadeIn, getFadeOut, layoutAnimation, quickSpring } from '@constants/animations'
import { base } from '@design/base'
import { useInsets } from '@hooks'
import type { Chat } from '@interfaces'
import useChatStore from '@stores/chat'
import { useCallback } from 'react'
import { type LayoutChangeEvent, Pressable } from 'react-native'
import Animated, { type SharedValue, withSpring } from 'react-native-reanimated'
import { styles } from './Footer.styles'

type MessageInputProps = {
  setValue: (value: string) => void
  value: string
  footerHeight: SharedValue<number>
  recipient: Chat['recipient']
}

const AnimatedInput = Animated.createAnimatedComponent(Input)

export default function MessageInput({ setValue, value, footerHeight, recipient }: MessageInputProps) {
  const replyMessage = useChatStore((state) => state.replyMessage)
  const insets = useInsets()

  const onInputLayout = useCallback(
    (e: LayoutChangeEvent) => {
      const height = e.nativeEvent.layout.height

      footerHeight.set(withSpring(height + insets.bottom + base.spacing.md, quickSpring))
    },
    [footerHeight],
  )

  return (
    <Animated.View onLayout={onInputLayout} layout={layoutAnimation} style={styles.messageInputWrapper}>
      {replyMessage ? (
        <Animated.View layout={layoutAnimation} entering={getFadeIn()} exiting={getFadeOut()} style={styles.replyBlockWrapper}>
          <Pressable style={styles.replyBlock}></Pressable>
        </Animated.View>
      ) : null}

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
