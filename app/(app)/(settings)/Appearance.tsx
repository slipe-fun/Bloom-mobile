import SettingHeader from '@components/settings/settingHeader'
import { Toggle } from '@components/ui'
import { SIZE_MAP } from '@components/ui/button/constats'
import { base } from '@design/base'
import { useInsets } from '@hooks'
import { useState } from 'react'
import { View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

export default function Appearance() {
  const [s, ss] = useState(false)
  const insets = useInsets()
  const headerHeight = insets.top + base.spacing.xxl + SIZE_MAP.md

  return (
    <View style={[styles.container, { paddingTop: headerHeight + 200, paddingHorizontal: 16 }]}>
      <SettingHeader title="settings.app.appearance" icon="sun" />
      <Toggle value={s} onValueChange={ss} />
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
