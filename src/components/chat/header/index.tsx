import { Avatar, Button, GradientBlur } from '@components/ui'
import Icon from '@components/ui/Icon'
import { springy } from '@constants/animations'
import { ICON_PRESSABLE_SCALE } from '@constants/animations/values'
import { useInsets } from '@hooks'
import type { Chat } from '@interfaces'
import { useNavigation } from '@react-navigation/native'
import { Pressable, View } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'
import { styles } from './Header.styles'

interface HeaderProps {
  chat?: Chat | null
}

const AnimatedAvatar = Animated.createAnimatedComponent(Avatar)

export default function Header({ chat }: HeaderProps): React.ReactNode {
  const navigation = useNavigation()
  const insets = useInsets()
  const scale = useSharedValue(1)

  const handlePress = (inn: boolean = true) => {
    scale.set(withSpring(inn ? ICON_PRESSABLE_SCALE : 1, springy))
  }

  const animatedAvatarStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.get() }],
  }))

  return (
    <Animated.View style={[styles.header, { paddingTop: insets.top }]}>
      <GradientBlur direction="top-to-bottom" />
      <Button variant="icon" onPress={() => navigation.goBack()}>
        <Icon icon="chevron.left" uniProps={(theme) => ({ color: theme.colors.text })} />
      </Button>
      <View style={styles.user}>
        <Button
          scaleMethod={ICON_PRESSABLE_SCALE - 0.06}
          style={styles.titleWrapper}
          labelStyle={styles.title}
          label={chat?.recipient?.display_name || chat?.recipient?.username}
          variant="text"
        />
        <Pressable onTouchStart={() => handlePress(true)} onTouchEnd={() => handlePress(false)}>
          <AnimatedAvatar
            style={[styles.avatar, animatedAvatarStyle]}
            size="lg"
            userId={chat?.recipient?.id}
            image={chat?.recipient?.avatar}
          />
        </Pressable>
      </View>

      <Button variant="icon" onPress={() => navigation.goBack()}>
        <Icon icon="dots" uniProps={(theme) => ({ color: theme.colors.text })} />
      </Button>
    </Animated.View>
  )
}
