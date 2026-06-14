import createChat from '@api/lib/chats/create'
import getChatsFromStorage from '@api/lib/chats/getChatsFromStorage'
import { useChatList } from '@api/providers/ChatsContext'
import { Avatar } from '@components/ui'
import Icon from '@components/ui/Icon'
import { quickSpring } from '@constants/easings'
import type { User } from '@interfaces'
import useChatStore from '@stores/chat'
import useStorageStore from '@stores/storage'
import { useRouter } from 'expo-router'
import { Pressable, Text, View } from 'react-native'
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'
import { useAnimatedTheme } from 'react-native-unistyles/reanimated'
import { styles } from './SearchUser.styles'

interface ChatProps {
  user: User
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

export default function SearchUser({ user }: ChatProps) {
  const animatedTheme = useAnimatedTheme()
  const progress = useSharedValue(1)
  const { push } = useRouter()
  const setChat = useChatStore((state) => state.setChat)
  const { mmkv, ensureMMKV } = useStorageStore()
  const { addChat } = useChatList()

  const handlePress = (inn: boolean = true) => {
    progress.set(withSpring(inn ? 0 : 1, quickSpring))
  }

  const openChat = async () => {
    const storage = mmkv ?? (await ensureMMKV())
    const chats = getChatsFromStorage(storage)

    const chat = chats.find((chat) => chat?.recipient?.id === user?.id)
    if (chat) {
      setChat(chat)
      push(`/(app)/chat/${chat?.id}`)
      return
    }

    const createdChat = await createChat(user)
    addChat(createdChat)
    setChat(createdChat)
    push(`/(app)/chat/${chat?.id}`)
  }

  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(progress.get(), [1, 0], ['transparent', animatedTheme.get().colors.foregroundTransparent]),
  }))

  return (
    <AnimatedPressable
      onTouchStart={() => handlePress(true)}
      onTouchMove={() => handlePress(false)}
      onTouchEnd={() => handlePress(false)}
      onPress={openChat}
      //   onPress={onPressHandler}
      style={[styles.chat, animatedStyle]}
    >
      <Avatar style={styles.avatar} size="md" image={user?.avatar} userId={user?.username || user?.display_name} />
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.name}>{user?.display_name || user?.username}</Text>

          <Icon icon="chevron.right" size={16} uniProps={(theme) => ({ color: theme.colors.secondaryText })} />
        </View>

        <Text numberOfLines={1} style={styles.username}>
          @{user?.username}
        </Text>
      </View>
      {/* {!isLast && <View style={styles.separator('md')} />} */}
    </AnimatedPressable>
  )
}
