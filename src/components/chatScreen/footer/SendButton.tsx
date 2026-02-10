import { Button, Icon } from '@components/ui'
import { paperplaneAnimationIn, paperplaneAnimationOut, zoomAnimationIn, zoomAnimationOut } from '@constants/animations'
import Animated from 'react-native-reanimated'
import { useUnistyles } from 'react-native-unistyles'
import { styles } from './Footer.styles'

interface SendButtonProps {
  handleSend: () => void
  hasValue: boolean
}

export default function SendButton({ handleSend, hasValue }: SendButtonProps) {
  const { theme } = useUnistyles()

  return (
    <Button onPress={handleSend} blur variant="icon">
      {hasValue ? (
        <>
          <Animated.View entering={zoomAnimationIn} exiting={zoomAnimationOut} style={styles.buttonBackground} />
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
