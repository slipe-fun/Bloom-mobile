import { Icon, Input } from '@components/ui'
import useTabBarStore from '@stores/tabBar'
import type { Ref } from 'react'
import { useTranslation } from 'react-i18next'
import type { TextInput } from 'react-native'
import { useUnistyles } from 'react-native-unistyles'

type FooterSearchProps = {
  ref: Ref<TextInput>
}

export default function FooterSearch({ ref }: FooterSearchProps) {
  const { theme } = useUnistyles()
  const { t } = useTranslation('common')

  const searchValue = useTabBarStore((state) => state.searchValue)
  const setSearchValue = useTabBarStore((state) => state.setSearchValue)
  const setSearchFocused = useTabBarStore((state) => state.setSearchFocused)

  return (
    <Input
      ref={ref}
      value={searchValue}
      size="lg"
      elevated={true}
      onChangeText={setSearchValue}
      onFocus={() => setSearchFocused(true)}
      onBlur={() => setSearchFocused(false)}
      placeholder={t('common:chats.footer.search.placeholder')}
      icon={<Icon size={22} color={theme.colors.secondaryText} icon="magnifyingglass" />}
      submitBehavior="blurAndSubmit"
      returnKeyType="search"
    />
  )
}
