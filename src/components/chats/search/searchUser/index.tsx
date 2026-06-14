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
  const { actions } = useChatList()

  const handlePress = (inn: boolean = true) => {
    progress.set(withSpring(inn ? 0 : 1, quickSpring))
  }

  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(progress.get(), [1, 0], ['transparent', animatedTheme.get().colors.foregroundTransparent]),
  }))

  return (
    <AnimatedPressable
      onTouchStart={() => handlePress(true)}
      onTouchMove={() => handlePress(false)}
      onTouchEnd={() => handlePress(false)}
      onPress={() => actions.openOrCreateChat(user)}
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
