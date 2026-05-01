import { useWebSocket } from '@api/providers/WebSocketContext'
import { Button, GradientBlur, Icon } from '@components/ui'
import { zoomAnimationIn, zoomAnimationOut } from '@constants/animations'
import { useInsets } from '@hooks'
import { useRouter } from 'expo-router'
import { useCallback, useEffect, useState } from 'react'
import { View } from 'react-native'
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue } from 'react-native-reanimated'
import { useUnistyles } from 'react-native-unistyles'
import { useAnimatedTheme } from 'react-native-unistyles/reanimated'
import { styles } from './header.styles'
import Title from './Title'

export default function Header() {
  const ws = useWebSocket()
  const insets = useInsets()
  const { theme } = useUnistyles()
  const animatedTheme = useAnimatedTheme()
  const [status, setStatus] = useState('connecting')
  const router = useRouter()
  const animation = useSharedValue(1)

  const handlePresentModalPress = useCallback(() => {
    router.navigate('/NewMessage')
  }, [])

  const animatedButtonStyle = useAnimatedStyle(() => ({
    opacity: animation.get(),
  }))

  const animatedEditButtonStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(animation.get(), [1, 0], [animatedTheme.value.colors.pressable, animatedTheme.value.colors.primary]),
  }))

  useEffect(() => {
    if (ws?.readyState === ws?.OPEN) {
      setStatus('connected')
    } else {
      setStatus('connecting')
    }
  }, [ws])

  return (
    <View pointerEvents="box-only" style={styles.header(insets.top)}>
      <GradientBlur direction="top-to-bottom" />
      <Button style={animatedEditButtonStyle} variant="icon">
        <Animated.View entering={zoomAnimationIn} exiting={zoomAnimationOut}>
          <Icon icon="pencil" color={theme.colors.text} />
        </Animated.View>
      </Button>
      <Title state={status} />
      <Button onPress={handlePresentModalPress} style={animatedButtonStyle} variant="icon">
        <Icon icon="plus" color={theme.colors.text} />
      </Button>
    </View>
  )
}
