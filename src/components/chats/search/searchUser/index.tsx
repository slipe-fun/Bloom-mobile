import { Avatar } from '@components/ui'
import Icon from '@components/ui/Icon'
import { quickSpring } from '@constants/easings'
import type { SearchUser as SearchUserType } from '@interfaces'
import { Pressable, Text, View } from 'react-native'
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'
import { useUnistyles } from 'react-native-unistyles'
import { useAnimatedTheme } from 'react-native-unistyles/reanimated'
import { styles } from './SearchUser.styles'

interface ChatProps {
  user: SearchUserType
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

export default function SearchUser({ user }: ChatProps) {
  const { theme } = useUnistyles()
  const animatedTheme = useAnimatedTheme()
  const progress = useSharedValue(1)

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
      //   onPress={onPressHandler}
      style={[styles.chat, animatedStyle]}
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
