import { Input } from '@components/ui'
import { layoutAnimationSpringy } from '@constants/animations'
import useChatScreenStore from '@stores/chatScreen'
import { BlurView } from 'expo-blur'
import type React from 'react'
import Animated from 'react-native-reanimated'
import { StyleSheet } from 'react-native-unistyles'
import ReplyBlock from '../replyBlock'
import { styles } from './Footer.styles'

type MessageInputProps = {
  setValue: (value: string) => void
  hasValue: boolean
  value: string
}

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView)

export default function MessageInput({ setValue, value }: MessageInputProps): React.JSX.Element {
  const { replyMessage, setReplyMessage } = useChatScreenStore()

  return (
    <Animated.View style={styles.inputWrapper} layout={layoutAnimationSpringy}>
      <AnimatedBlurView layout={layoutAnimationSpringy} style={StyleSheet.absoluteFill} intensity={40} tint="systemChromeMaterialDark" />
      <ReplyBlock onCancel={() => setReplyMessage(null)} message={replyMessage} />

      <Input
        numberOfLines={7}
        onChangeText={setValue}
        multiline
        submitBehavior="newline"
        basic
        size="md"
        returnKeyType="previous"
        value={value}
        placeholder="Cообщение..."
      />
    </Animated.View>
  )
}
