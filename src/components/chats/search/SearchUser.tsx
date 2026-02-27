import { Avatar } from '@components/ui'
import Icon from '@components/ui/Icon'
import { getFadeIn } from '@constants/animations'
import { useChatItem } from '@hooks'
import type { SearchUser as SearchUserType } from '@interfaces'
import { Pressable, Text, View } from 'react-native'
import Animated, { LayoutAnimationConfig } from 'react-native-reanimated'
import { useUnistyles } from 'react-native-unistyles'
import { styles } from '../chat/Chat.styles'

interface ChatProps {
  user: SearchUserType
  isLast?: boolean
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

export default function SearchUser({ user, isLast = false }: ChatProps) {
  const { theme } = useUnistyles()
  const { handlePress, onPressHandler, animatedChatStyle } = useChatItem(user, true, theme)

  return (
    <AnimatedPressable
      onPressIn={() => handlePress(true)}
      onPressOut={() => handlePress(false)}
      entering={getFadeIn()}
      onPress={onPressHandler}
      style={[styles.chat, animatedChatStyle]}
    >
      <LayoutAnimationConfig skipEntering skipExiting>
        <View style={styles.avatarWrapper}>
          <Avatar size="md" image={user?.avatar} username={user?.username || user?.display_name} />
        </View>
        <View style={styles.content}>
          <View style={styles.headerRow}>
            <Text style={styles.name}>{user?.display_name || user?.username}</Text>

            <View style={styles.metaRow}>
              <Icon icon="chevron.right" size={16} color={theme.colors.secondaryText} />
            </View>
          </View>

          <Text numberOfLines={1} style={styles.secondary(false)}>
            @{user?.username}
          </Text>
        </View>
      </LayoutAnimationConfig>
      {!isLast && <View style={styles.separator} />}
    </AnimatedPressable>
  )
}
