import { Icon, Input } from '@components/ui'
import { quickSpring } from '@constants/easings'
import useTabBarStore from '@stores/tabBar'
import { type Ref, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import type { TextInput } from 'react-native'
import { interpolateColor, useAnimatedProps, useSharedValue, withSpring } from 'react-native-reanimated'
import type { PathProps } from 'react-native-svg'
import { useUnistyles } from 'react-native-unistyles'
import { useAnimatedTheme } from 'react-native-unistyles/reanimated'

type FooterSearchProps = {
  ref: Ref<TextInput>
}

export default function FooterSearch({ ref }: FooterSearchProps) {
  const animatedTheme = useAnimatedTheme()
  const { theme } = useUnistyles()
  const { t } = useTranslation('common')
  const colorValue = useSharedValue(0)

  const searchValue = useTabBarStore((state) => state.searchValue)
  const searchFocused = useTabBarStore((state) => state.searchFocused)
  const setSearchValue = useTabBarStore((state) => state.setSearchValue)
  const setSearchFocused = useTabBarStore((state) => state.setSearchFocused)

  const animatedProps = useAnimatedProps(
    (): PathProps => ({
      fill: interpolateColor(colorValue.get(), [0, 1], [animatedTheme.value.colors.secondaryText, animatedTheme.value.colors.text]),
    }),
  )

  useEffect(() => {
    colorValue.set(withSpring(searchFocused ? 1 : 0, quickSpring))
  }, [searchFocused])

  return (
    <Input
      ref={ref}
      value={searchValue}
      size="lg"
      viewStyle={{ flex: 1 }}
      elevated={true}
      onChangeText={setSearchValue}
      onFocus={() => setSearchFocused(true)}
      onBlur={() => setSearchFocused(false)}
      placeholder={t('common:chats.footer.search.placeholder')}
      icon={<Icon size={22} color={theme.colors.secondaryText} animatedProps={animatedProps} icon="magnifyingglass" />}
      submitBehavior="blurAndSubmit"
      returnKeyType="search"
    />
  )
}
