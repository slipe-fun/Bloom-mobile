import SettingHeader from '@components/settings/settingHeader'
import { View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

export default function KeyPassword() {
  return (
    <View style={styles.container}>
      <SettingHeader title="privacy.keyPassword" icon="key" />
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
