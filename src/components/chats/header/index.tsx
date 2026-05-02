import { useWebSocket } from '@api/providers/WebSocketContext'
import { Button, GradientBlur, Icon } from '@components/ui'
import { useInsets } from '@hooks'
import { useRouter } from 'expo-router'
import { useCallback, useEffect, useState } from 'react'
import { View } from 'react-native'
import { useUnistyles } from 'react-native-unistyles'
import { styles } from './header.styles'
import Title from './Title'

export default function Header() {
  const ws = useWebSocket()
  const insets = useInsets()
  const { theme } = useUnistyles()
  const [status, setStatus] = useState('connecting')
  const router = useRouter()

  const handlePresentModalPress = useCallback(() => {
    router.navigate('/NewMessage')
  }, [])

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
      <Title state={status} />
      <Button onPress={handlePresentModalPress} variant="icon">
        <Icon icon="plus" color={theme.colors.text} />
      </Button>
    </View>
  )
}
