import { Button, Icon } from '@components/ui'
import { layoutAnimation, paperplaneAnimationIn, paperplaneAnimationOut, zoomAnimationIn, zoomAnimationOut } from '@constants/animations'
import useChatScreenStore from '@stores/chatScreen'
import Animated from 'react-native-reanimated'
import { useUnistyles } from 'react-native-unistyles'
import { styles } from './Footer.styles'

type MessageInputProps = {
  setValue: (value: string) => void
  onSend: (value: string, id: number) => void
  value: string
}

export default function SendButton({ setValue, onSend, value }: MessageInputProps) {
  const { replyMessage, setReplyMessage } = useChatScreenStore()
  const { theme } = useUnistyles()

  const hasValue: boolean = value.trim() !== ''

  const handleSend = () => {
    if (hasValue) {
      onSend(value.trim(), replyMessage?.id)
      setValue('')
      setReplyMessage(null)
    }
  }

  return (
    <Button layout={layoutAnimation} onPress={handleSend} blur variant="icon">
      {hasValue ? (
        <>
          <Animated.View entering={zoomAnimationIn} style={styles.buttonBackground} />
          <Animated.View key="paperplane" entering={paperplaneAnimationIn} exiting={paperplaneAnimationOut}>
            <Icon icon="paperplane" size={26} color={theme.colors.white} />
          </Animated.View>
        </>
      ) : (
        <Animated.View key="waveform" entering={zoomAnimationIn} exiting={zoomAnimationOut}>
          <Icon icon="waveform" size={26} color={theme.colors.text} />
        </Animated.View>
      )}
    </Button>
  )
}
