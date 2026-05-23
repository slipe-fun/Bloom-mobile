import { Avatar } from '@components/ui'
import Icon from '@components/ui/Icon'
import type { SearchUser as SearchUserType } from '@interfaces'
import { Pressable, Text, View } from 'react-native'
import Animated from 'react-native-reanimated'
import { useUnistyles } from 'react-native-unistyles'
import { styles } from './SearchUser.styles'

interface ChatProps {
  user: SearchUserType
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

export default function SearchUser({ user }: ChatProps) {
  const { theme } = useUnistyles()

  return (
    <AnimatedPressable
      //   onPressIn={() => handlePress(true)}
      //   onPressOut={() => handlePress(false)}
      //   onPress={onPressHandler}
      style={[styles.chat]}
    >
      <Avatar style={styles.avatar} size="md" image={user?.avatar} userId={user?.username || user?.display_name} />
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.name}>{user?.display_name || user?.username}</Text>

          <Icon icon="chevron.right" size={16} color={theme.colors.secondaryText} />
        </View>

        <Text numberOfLines={1} style={styles.username}>
          @{user?.username}
        </Text>
      </View>
      {/* {!isLast && <View style={styles.separator('md')} />} */}
    </AnimatedPressable>
  )
}
