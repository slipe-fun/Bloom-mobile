import SettingHeader from '@components/settings/settingHeader'
import { SettingsGroup } from '@components/ui'
import { SIZE_MAP } from '@components/ui/button/constats'
import { LANGUAGE_SECTIONS } from '@constants/settings/language'
import { base } from '@design/base'
import { useInsets } from '@hooks'
import { useSettingsStore } from '@stores/settings'
import { useMemo } from 'react'
import { View } from 'react-native'
import Transition from 'react-native-screen-transitions'
import { StyleSheet } from 'react-native-unistyles'

export default function Language() {
  const language = useSettingsStore((state) => state.language)
  const setLanguage = useSettingsStore((state) => state.setLanguage)
  const insets = useInsets()
  const headerHeight = insets.top + base.spacing.xxl + SIZE_MAP.md

  const settingsList = useMemo(() => LANGUAGE_SECTIONS({ language, setLanguage }), [language, setLanguage])

  return (
    <View style={styles.container}>
      <SettingHeader title="app.language.title" icon="globe" />
      <Transition.ScrollView contentContainerStyle={styles.list(headerHeight, insets.bottom)} showsVerticalScrollIndicator={false}>
        {settingsList.map((item, _i) => (
          <SettingsGroup section={item} key={item.id} />
        ))}
      </Transition.ScrollView>
    </View>
  )
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.grayBackground,
  },
  list: (paddingTop: number, paddingBottom: number) => ({
    paddingBottom,
    gap: theme.spacing.lg,
    paddingTop,
    paddingHorizontal: theme.spacing.lg,
  }),
}))
