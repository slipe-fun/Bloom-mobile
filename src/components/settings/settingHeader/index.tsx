import { Button, GradientBlur, Icon } from '@components/ui'
import type { ICONS } from '@constants/icons'
import { useInsets } from '@hooks'
import { useRouter } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'
import { styles } from './SettingHeader.styles'

interface SettingsHeaderProps {
  title?: any
  icon?: keyof typeof ICONS
  actionIcon?: keyof typeof ICONS
  action?: () => void
}

export default function SettingHeader({ title, icon, actionIcon, action }: SettingsHeaderProps) {
  const insets = useInsets()
  const { back } = useRouter()
  const { t } = useTranslation()

  return (
    <View style={styles.header(insets.top)}>
      <GradientBlur pointerEvents="none" gray direction="top-to-bottom" />
      <Button
        variant="icon"
        icon={<Icon uniProps={(theme) => ({ color: theme.colors.text })} size={26} icon="chevron.left" />}
        size="md"
        onPress={() => back()}
      />
      <View style={styles.titleWrapper}>
        <Icon uniProps={(theme) => ({ color: theme.colors.secondaryText })} size={24} icon={icon} />
        <Text style={styles.title}>{t(`settings:${title}`)}</Text>
      </View>
      {action ? (
        <Button
          variant="icon"
          icon={<Icon uniProps={(theme) => ({ color: theme.colors.text })} size={26} icon={actionIcon} />}
          size="md"
          onPress={action}
        />
      ) : (
        <View pointerEvents="none" style={styles.padding} />
      )}
    </View>
  )
}
