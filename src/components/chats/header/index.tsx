import { useWebSocket } from '@api/providers/WebSocketContext'
import { Button, GradientBlur, Icon } from '@components/ui'
import { useInsets } from '@hooks'
import { useRouter } from 'expo-router'
import { useCallback, useEffect, useState } from 'react'
import Animated, { type SharedValue, useAnimatedStyle } from 'react-native-reanimated'
import { useUnistyles } from 'react-native-unistyles'
import { styles } from './header.styles'
import Title from './Title'

interface HeaderProps {
  scrollY: SharedValue<number>
}

export type Status = 'connected' | 'connecting'

export default function Header({ scrollY }: HeaderProps) {
  const ws = useWebSocket()
  const insets = useInsets()
  const { theme } = useUnistyles()
  const [status, setStatus] = useState<Status>('connecting')
  const { navigate } = useRouter()

  const handlePresentModalPress = useCallback(() => {
    navigate('/NewMessage')
  }, [])

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: Math.max(0, -scrollY.get() / 5) }],
  }))

  useEffect(() => {
    if (ws?.readyState === ws?.OPEN) {
      setStatus('connected')
    } else {
      setStatus('connecting')
    }
  }, [ws])

  return (
    <Animated.View pointerEvents="box-only" style={[styles.header(insets.top), animatedStyle]}>
      <GradientBlur direction="top-to-bottom" />
      <Title scrollY={scrollY} state={status} />
      <Button onPress={handlePresentModalPress} variant="icon">
        <Icon icon="plus" color={theme.colors.text} />
      </Button>
    </Animated.View>
  )
}
