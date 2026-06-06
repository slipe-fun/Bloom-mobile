import type { SettingsSection } from '@interfaces'
import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'
import { styles } from './SettingsGroup.styles'
import SettingsItem from './settingsItem'

type SettingsGroupProps = {
  section: SettingsSection
}

export default function SettingsGroup({ section }: SettingsGroupProps) {
  const { t } = useTranslation('common')
  return (
    <View style={styles.container}>
      {/* @ts-expect-error */}
      {section.title && <Text style={styles.title}>{t(section.title)}</Text>}
      <View style={styles.group}>
        {section.items.map((settingItem, index) => (
          <SettingsItem key={`${section.id}-${settingItem.label}`} item={settingItem} last={index + 1 === section.items.length} />
        ))}
      </View>
    </View>
  )
}
