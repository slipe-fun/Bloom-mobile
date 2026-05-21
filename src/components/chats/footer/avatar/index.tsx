import { Avatar, Button, Icon } from '@components/ui'
import { getFadeIn, getFadeOut, springy } from '@constants/animations'
import { ICON_PRESSABLE_SCALE } from '@constants/animations/values'
import useFooterStore from '@stores/footer'
import { useRouter } from 'expo-router'
import type { RefObject } from 'react'
import type { TextInput } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'
import Transition from 'react-native-screen-transitions'
import { useUnistyles } from 'react-native-unistyles'
import { styles } from './Avatar.styles'

const AnimatedAvatar = Animated.createAnimatedComponent(Avatar)

interface FooterAvatarProps {
  inputRef: RefObject<TextInput>
}

export default function FooterAvatar({ inputRef = null }: FooterAvatarProps) {
  const { push } = useRouter()
  const search = useFooterStore((state) => state.search)
  const { theme } = useUnistyles()
  const setSearch = useFooterStore((state) => state.setSearch)
  const scale = useSharedValue(1)

  const handlePress = (inn: boolean = true) => {
    scale.set(withSpring(inn ? ICON_PRESSABLE_SCALE : 1, springy))
  }

  const animatedAvatarStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.get() }],
  }))

  return !search ? (
    <Transition.Boundary.Trigger
      onTouchStart={() => handlePress(true)}
      onTouchEnd={() => handlePress(false)}
      // @ts-expect-error
      entering={getFadeIn()}
      exiting={getFadeOut()}
      id="avatar"
      onPress={() => push('/(app)/Settings')}
    >
      <AnimatedAvatar
        style={[styles.avatar, animatedAvatarStyle]}
        image="https://i.pinimg.com/736x/77/5b/a5/775ba539f6a59d678ee01d0353646e88.jpg"
        size="lg"
        userId="dk3k293KK"
      />
    </Transition.Boundary.Trigger>
  ) : (
    <Button
      entering={getFadeIn()}
      exiting={getFadeOut()}
      variant="icon"
      icon={<Icon color={theme.colors.text} size={28} icon="x" />}
      size="lg"
      onPress={() => {
        setSearch(false)
        inputRef.current.blur()
      }}
    />
  )
}
