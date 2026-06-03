import type { ICONS } from '@constants/icons'
import { View } from 'react-native'
import { useUnistyles } from 'react-native-unistyles'
import Icon from '../../Icon'
import { styles } from './SettingsIcon.styles'

interface SettingsIconProps {
  icon: keyof typeof ICONS
  color: string
}

export default function SettingsIcon({ icon, color }: SettingsIconProps) {
  const { theme } = useUnistyles()

  return (
    <View style={styles.container}>
      <Icon icon={icon} size={28} color={color ? color : theme.colors.secondaryText} />
    </View>
  )
}
