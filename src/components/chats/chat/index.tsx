import { useUser } from '@api/providers/UserContext'
import { Avatar } from '@components/ui'
import Icon from '@components/ui/Icon'
import { getFadeIn, getFadeOut, quickSpring } from '@constants/animations'
import type { Chat as ChatType } from '@interfaces'
import formatSentTime from '@lib/formatSentTime'
import { useRouter } from 'expo-router'
import { Pressable, Text, View } from 'react-native'
import Animated, { interpolateColor, LayoutAnimationConfig, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'
import { useAnimatedTheme } from 'react-native-unistyles/reanimated'
import { styles } from './Chat.styles'

interface ChatProps {
  chat: ChatType
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

export default function Chat({ chat }: ChatProps) {
  const animatedTheme = useAnimatedTheme()
  const { push } = useRouter()
  const progress = useSharedValue(1)
  const user = useUser()

  console.log(chat)

  const chat_user = chat?.members?.find((member) => member?.id !== user?.id)

  const handlePress = (inn: boolean = true) => {
    progress.set(withSpring(inn ? 0 : 1, quickSpring))
  }

  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(progress.get(), [1, 0], ['transparent', animatedTheme.get().colors.foregroundTransparent]),
  }))

  const lastMessage = {
    time: chat?.last_message?.date ? formatSentTime(chat?.last_message?.date) : '',
    content: chat?.last_message?.content || 'Чат создан',
  }

  return (
    <AnimatedPressable
      onTouchStart={() => handlePress(true)}
      onTouchMove={() => handlePress(false)}
      onTouchEnd={() => handlePress(false)}
      onPress={() => push('/(app)/chat/342')}
      style={[styles.chat, animatedStyle]}
    >
      <Avatar style={styles.avatar} size="xl" image={chat_user?.avatar} userId={chat_user?.id} />
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.name}>{chat_user?.display_name || chat_user?.username}</Text>
          <Text style={styles.secondary}>{lastMessage?.time}</Text>
          <Icon icon="chevron.right" size={16} uniProps={(theme) => ({ color: theme.colors.secondaryText })} />
        </View>
        <LayoutAnimationConfig skipEntering skipExiting>
          <Animated.Text
            entering={getFadeIn()}
            exiting={getFadeOut()}
            key={lastMessage?.content}
            style={styles.secondary}
            numberOfLines={2}
          >
            {lastMessage?.content}
          </Animated.Text>
        </LayoutAnimationConfig>
      </View>

      {/* {!isLast && <View style={styles.separator('lg')} />} */}
    </AnimatedPressable>
  )
}
