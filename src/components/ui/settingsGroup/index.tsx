import type { SettingsSection } from '@interfaces'
import type React from 'react'
import { Text, View } from 'react-native'
import { styles } from './SettingsGroup.styles'
import SettingsItem from './settingsItem'

type SettingsGroupProps = {
  section: SettingsSection
}

export default function SettingsGroup({ section }: SettingsGroupProps): React.JSX.Element {
  return (
    <View style={styles.container}>
      <View style={styles.group}>
        {section.items.map((settingItem) => (
          <SettingsItem key={settingItem.label} item={settingItem} />
        ))}
      </View>
      {section.description && <Text style={styles.description}>{section.description}</Text>}
    </View>
  )
}
