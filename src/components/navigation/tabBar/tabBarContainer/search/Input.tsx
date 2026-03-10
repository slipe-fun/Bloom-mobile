import { Icon, Input } from '@components/ui'
import { getFadeIn, getFadeOut, layoutAnimation } from '@constants/animations'
import useTabBarStore from '@stores/tabBar'
import type React from 'react'
import type { Ref } from 'react'
import type { TextInput } from 'react-native'
import Animated from 'react-native-reanimated'
import { useUnistyles } from 'react-native-unistyles'

const AnimatedInput = Animated.createAnimatedComponent(Input)

type TabBarSearchInputProps = {
  ref: Ref<TextInput>
}

export default function TabBarSearchInput({ ref }: TabBarSearchInputProps): React.JSX.Element {
  const { searchValue, setSearchValue, setSearchFocused } = useTabBarStore()
  const { theme } = useUnistyles()

  return (
    <AnimatedInput
      ref={ref}
      value={searchValue}
      size="lg"
      elevated={false}
      animation={false}
      onChangeText={setSearchValue}
      onFocus={() => setSearchFocused(true)}
      viewStyle={{ backgroundColor: 'transparent' }}
      onBlur={() => setSearchFocused(false)}
      placeholder="Поиск по чатам"
      icon={<Icon size={22} color={theme.colors.secondaryText} icon="magnifyingglass" />}
      submitBehavior="blurAndSubmit"
      layout={layoutAnimation}
      returnKeyType="search"
      entering={getFadeIn()}
      exiting={getFadeOut()}
    />
  )
}
