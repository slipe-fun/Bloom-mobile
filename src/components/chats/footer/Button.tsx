import { Button, Icon } from '@components/ui'
import { springy } from '@constants/animations'
import useFooterStore from '@stores/footer'
import { useRouter } from 'expo-router'
import { type RefObject, useEffect } from 'react'
import type { TextInput } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'
import { useUnistyles } from 'react-native-unistyles'

interface FooterAvatarProps {
  inputRef: RefObject<TextInput>
}

export default function FooterButton({ inputRef = null }: FooterAvatarProps) {
  const { push } = useRouter()
  const search = useFooterStore((state) => state.search)
  const { theme } = useUnistyles()
  const setSearch = useFooterStore((state) => state.setSearch)
  const setSearchValue = useFooterStore((state) => state.setSearchValue)
  const rotate = useSharedValue(0)

  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotate.get()}deg` }],
  }))

  const onPress = () => {
    if (search) {
      setSearch(false)
      inputRef.current.blur()
      inputRef.current.clear()
      setSearchValue('')
    } else {
      push('/(app)/NewMessage')
    }
  }

  useEffect(() => {
    rotate.set(withSpring(search ? -45 : 0, springy))
  }, [search])

  return (
    <Button
      variant="icon"
      icon={
        <Animated.View style={animatedIconStyle}>
          <Icon color={theme.colors.text} size={30} icon="plus" />
        </Animated.View>
      }
      size="lg"
      onPress={onPress}
    />
  )
}
