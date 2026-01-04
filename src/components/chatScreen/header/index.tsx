import { Avatar, Button, GradientBlur, Menu } from '@components/ui'
import Icon from '@components/ui/Icon'
import { quickSpring } from '@constants/easings'
import { useContextMenu, useInsets } from '@hooks'
import type { Chat, Option } from '@interfaces'
import { useNavigation } from '@react-navigation/native'
import { BlurView } from 'expo-blur'
import { Pressable, Text, View } from 'react-native'
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated'
import { StyleSheet, useUnistyles } from 'react-native-unistyles'
import { staticColor } from 'unistyles'
import { styles } from './Header.styles'

type HeaderProps = {
  chat?: Chat | null
  onLayout?: (value: number) => void
}

const options: Option[] = [
  { label: 'Открыть профиль', icon: 'person', color: staticColor.white, action: () => 'swag' },
  { label: 'Поиск', icon: 'magnifyingglass', color: staticColor.primary, action: () => 'swag' },
  { label: 'Сменить обои', icon: 'image', color: staticColor.yellow, action: () => 'swag' },
  { label: 'Удалить чат', icon: 'trash', color: staticColor.orange, action: () => 'swag' },
]

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

export default function Header({ chat, onLayout }: HeaderProps): React.ReactNode {
  const { theme } = useUnistyles()
  const { isOpen, triggerProps, closeMenu, menuPosition, triggerAnimatedStyle } = useContextMenu()
  const navigation = useNavigation()
  const insets = useInsets()

  const animatedViewStyles = useAnimatedStyle(() => {
    return { opacity: withSpring(isOpen ? 0.5 : 1, quickSpring) }
  })

  return (
    <Animated.View
      onLayout={(e) => onLayout(e.nativeEvent.layout.height)}
      style={[styles.header, { paddingTop: insets.top }, animatedViewStyles]}
    >
      <GradientBlur direction="top-to-bottom" />
      <Button style={styles.button} variant="icon" onPress={() => navigation.goBack()}>
        <BlurView style={StyleSheet.absoluteFill} intensity={40} tint="systemChromeMaterialDark" />
        <Icon icon="chevron.left" color={theme.colors.text} />
      </Button>
      <View style={styles.titleWrapper}>
        <Text style={styles.title}>{chat?.recipient?.username}</Text>
        <Text style={styles.time}>Была(а) недавно</Text>
      </View>

      <AnimatedPressable style={triggerAnimatedStyle} {...triggerProps}>
        <Avatar size="md" username={chat?.recipient?.username} />
      </AnimatedPressable>
      <Menu isOpen={isOpen} options={options} closeMenu={closeMenu} position={menuPosition} />
    </Animated.View>
  )
}
