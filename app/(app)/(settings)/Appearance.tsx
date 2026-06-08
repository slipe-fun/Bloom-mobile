import Demonstration from '@components/settings/appearance/Demonstration'
import SettingHeader from '@components/settings/settingHeader'
import { SettingsGroup } from '@components/ui'
import { SIZE_MAP } from '@components/ui/button/constats'
import { APPEARACNE_SECTIONS } from '@constants/settings/appearance'
import { base } from '@design/base'
import { useInsets } from '@hooks'
import { useSettingsStore } from '@stores/settings'
import { useMemo } from 'react'
import { View } from 'react-native'
import Transition from 'react-native-screen-transitions'
import { StyleSheet } from 'react-native-unistyles'

export default function Appearance() {
  const theme = useSettingsStore((state) => state.theme)
  const setTheme = useSettingsStore((state) => state.setTheme)
  const insets = useInsets()
  const headerHeight = insets.top + base.spacing.xxl + SIZE_MAP.md

  const settingsList = useMemo(
    () => APPEARACNE_SECTIONS({ theme, setTheme, demonstartion: <Demonstration key="demonstration" /> }),
    [theme, setTheme, APPEARACNE_SECTIONS],
  )

  return (
    <View style={styles.container}>
      <SettingHeader title="settings.app.appearance.title" icon="sun" />
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
    paddingTop,
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
  }),
}))
