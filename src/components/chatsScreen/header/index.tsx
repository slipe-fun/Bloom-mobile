import { useWebSocket } from '@api/providers/WebSocketContext'
import { Button, GradientBlur, Icon } from '@components/ui'
import { charAnimationIn, charAnimationOut, quickSpring, zoomAnimationIn, zoomAnimationOut } from '@constants/animations'
import { useInsets } from '@hooks'
import useChatsScreenStore from '@stores/chats'
import { useEffect, useState } from 'react'
import { View } from 'react-native'
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated'
import { useUnistyles } from 'react-native-unistyles'
import { styles } from './header.styles'
import Title from './Title'

const AnimatedButton = Animated.createAnimatedComponent(Button)

export default function Header() {
  const ws = useWebSocket()
  const insets = useInsets()
  const { theme } = useUnistyles()
  const [status, setStatus] = useState('connecting')
  const { setHeaderHeight, setEdit, edit } = useChatsScreenStore()

  const animatedButtonStyle = useAnimatedStyle(() => ({
    opacity: withSpring(edit ? 0 : 1, quickSpring),
  }))

  useEffect(() => {
    if (ws) {
      ws.onopen = () => setStatus('connected')
      ws.onclose = () => setStatus('connecting')
    }
  }, [ws])

  return (
    <View onLayout={(e) => setHeaderHeight(e.nativeEvent.layout.height)} style={[styles.header, { paddingTop: insets.top }]}>
      <GradientBlur direction="top-to-bottom" />
      <View style={[styles.topHeader]}>
        <Button onPress={() => setEdit(!edit)} blur variant="icon">
          {edit ? (
            <>
              <Animated.View style={styles.buttonBackground} entering={zoomAnimationIn} exiting={zoomAnimationOut} />
              <Animated.View entering={charAnimationIn} exiting={charAnimationOut}>
                <Icon icon="checkmark" color={theme.colors.white} />
              </Animated.View>
            </>
          ) : (
            <Animated.View entering={zoomAnimationIn} exiting={zoomAnimationOut}>
              <Icon icon="pencil" color={theme.colors.text} />
            </Animated.View>
          )}
        </Button>
        <Title state={status} />
        <AnimatedButton style={animatedButtonStyle} blur variant="icon">
          <Icon icon="plus" color={theme.colors.text} />
        </AnimatedButton>
      </View>
    </View>
  )
}
