import { Avatar, Button, GradientBlur, Menu } from '@components/ui'
import Icon from '@components/ui/Icon'
import { quickSpring } from '@constants/easings'
import { staticColors } from '@design/colors'
import { useContextMenu, useInsets } from '@hooks'
import type { Chat, Option } from '@interfaces'
import { useNavigation } from '@react-navigation/native'
import { Pressable, Text, View } from 'react-native'
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated'
import { useUnistyles } from 'react-native-unistyles'
import { styles } from './Header.styles'

type HeaderProps = {
  chat?: Chat | null
  onLayout?: (value: number) => void
}

const options: Option[] = [
  { label: 'Открыть профиль', icon: 'person', color: staticColors.white, action: () => 'swag' },
  { label: 'Поиск', icon: 'magnifyingglass', color: staticColors.primary, action: () => 'swag' },
  { label: 'Сменить обои', icon: 'image', color: staticColors.yellow, action: () => 'swag' },
  { label: 'Удалить чат', icon: 'trash', color: staticColors.orange, action: () => 'swag' },
]

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

export default function Header({ chat }: HeaderProps): React.ReactNode {
  const { theme } = useUnistyles()
  const { isOpen, triggerProps, closeMenu, menuPosition, triggerAnimatedStyle } = useContextMenu()
  const navigation = useNavigation()
  const insets = useInsets()

  const animatedViewStyles = useAnimatedStyle(() => {
    return { opacity: withSpring(isOpen ? 0.5 : 1, quickSpring) }
  })

  return (
    <Animated.View style={[styles.header, { paddingTop: insets.top }, animatedViewStyles]}>
      <GradientBlur direction="top-to-bottom" />
      <Button blur variant="icon" onPress={() => navigation.goBack()}>
        <Icon icon="chevron.left" color={theme.colors.text} />
      </Button>
      <View style={styles.titleWrapper}>
        <Text style={styles.title}>{chat?.recipient?.display_name || chat?.recipient?.username}</Text>
        <Text style={styles.time}>Был(а) недавно</Text>
      </View>

      <AnimatedPressable style={triggerAnimatedStyle} {...triggerProps}>
        <Avatar size="md" username={chat?.recipient?.username} />
      </AnimatedPressable>
      <Menu isOpen={isOpen} options={options} closeMenu={closeMenu} position={menuPosition} />
    </Animated.View>
  )
}
