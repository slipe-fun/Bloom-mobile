import { useUser } from '@api/providers/UserContext'
import { Button, Icon } from '@components/ui'
import { getFadeIn, getFadeOut, layoutAnimationSpringy } from '@constants/animations'
import type { Member, Message } from '@interfaces'
import type React from 'react'
import { useEffect, useState } from 'react'
import { Text, View } from 'react-native'
import Animated from 'react-native-reanimated'
import { useUnistyles } from 'react-native-unistyles'
import { styles } from './replyBlock.styles'

type ReplyBlockProps = {
  message: Message
  onCancel?: () => void
  isMe?: boolean
  recipient: Member
}

const AnimatedButton = Animated.createAnimatedComponent(Button)

export default function ReplyBlock({ message, onCancel, isMe, recipient }: ReplyBlockProps): React.JSX.Element {
  const { theme } = useUnistyles()
  const [username, setUsername] = useState('')
  const user = useUser()

  useEffect(() => {
    ;(async () => {
      const username =
        user?.id === message?.author_id ? user?.display_name || user?.username : recipient?.display_name || recipient?.username
      setUsername(username || 'anon')
    })()
  }, [message])

  return (
    message && (
      <View style={styles.replyWrapper}>
        <Animated.View
          exiting={getFadeOut()}
          entering={getFadeIn()}
          layout={layoutAnimationSpringy}
          style={styles.replyChild(!onCancel, isMe)}
        >
          <View style={styles.replyTo}>
            <Text style={styles.replyToName} numberOfLines={1}>
              В ответ {username}
            </Text>
            <Text style={styles.replyToMessage} numberOfLines={1}>
              {message?.content}
            </Text>
          </View>
          {onCancel && (
            <AnimatedButton onPress={() => onCancel()} layout={layoutAnimationSpringy} variant="icon" style={styles.button}>
              <Icon color={theme.colors.secondaryText} icon="star" />
            </AnimatedButton>
          )}
        </Animated.View>
      </View>
    )
  )
}
