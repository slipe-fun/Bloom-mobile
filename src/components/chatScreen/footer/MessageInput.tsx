import { Input } from '@components/ui'
import useChatScreenStore from '@stores/chatScreen'
import { BlurView } from 'expo-blur'
import type React from 'react'
import { Platform, View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'
import ReplyBlock from '../replyBlock'
import { styles } from './Footer.styles'

type MessageInputProps = {
  setValue: (value: string) => void
  value: string
}

export default function MessageInput({ setValue, value }: MessageInputProps): React.JSX.Element {
  const { replyMessage, setReplyMessage } = useChatScreenStore()

  return (
    <View style={styles.inputWrapper}>
      {Platform.OS === 'ios' && <BlurView style={StyleSheet.absoluteFill} intensity={40} tint="systemChromeMaterialDark" />}
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
    </View>
  )
}
