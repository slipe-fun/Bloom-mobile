import { Avatar, Button, GradientBlur } from '@components/ui'
import Icon from '@components/ui/Icon'
import { useInsets } from '@hooks'
import type { Chat } from '@interfaces'
import { useNavigation } from '@react-navigation/native'
import { Pressable, Text, View } from 'react-native'
import Animated from 'react-native-reanimated'
import { useUnistyles } from 'react-native-unistyles'
import { styles } from './Header.styles'

type HeaderProps = {
  chat?: Chat | null
  onLayout?: (value: number) => void
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

export default function Header({ chat }: HeaderProps): React.ReactNode {
  const { theme } = useUnistyles()
  const navigation = useNavigation()
  const insets = useInsets()

  return (
    <Animated.View style={[styles.header, { paddingTop: insets.top }]}>
      <GradientBlur direction="top-to-bottom" />
      <Button variant="icon" onPress={() => navigation.goBack()}>
        <Icon icon="chevron.left" color={theme.colors.text} />
      </Button>
      <View style={styles.titleWrapper}>
        <Text style={styles.title}>{chat?.recipient?.display_name || chat?.recipient?.username}</Text>
        <Text style={styles.time}>Был(а) недавно</Text>
      </View>

      <AnimatedPressable>
        <Avatar size="md" username={chat?.recipient?.username} />
      </AnimatedPressable>
    </Animated.View>
  )
}
