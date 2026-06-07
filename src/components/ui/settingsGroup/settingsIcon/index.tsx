import type { ICONS } from '@constants/icons'
import { View } from 'react-native'
import Icon from '../../Icon'
import { styles } from './SettingsIcon.styles'

interface SettingsIconProps {
  icon: keyof typeof ICONS
  color: string
}

export default function SettingsIcon({ icon, color }: SettingsIconProps) {
  return (
    <View style={styles.container}>
      <Icon icon={icon} size={28} uniProps={(theme) => ({ color: color ? theme.colors[color] : theme.colors.secondaryText })} />
    </View>
  )
}
