import type { ICONS } from '@constants/icons'
import type { SettingsItem } from '@interfaces'
import { lightenColor } from '@lib/lightenColor'
import { LinearGradient } from 'expo-linear-gradient'
import type React from 'react'
import { View } from 'react-native'
import { useUnistyles } from 'react-native-unistyles'
import Icon from '../../Icon'
import { styles } from './SettingsIcon.styles'

interface SettingsIconProps {
  icon: keyof typeof ICONS
  color: string
  type: SettingsItem['iconType']
}

export default function SettingsIcon({ icon, color, type }: SettingsIconProps): React.JSX.Element {
  const { theme } = useUnistyles()

  const gradientColors = [lightenColor(color, 10), color]

  return (
    <View style={styles.container}>
      {type === 'gradient' ? (
        <LinearGradient colors={gradientColors as any} style={styles.background} start={{ x: 0.5, y: 0 }} end={{ x: 0.5, y: 1 }} />
      ) : null}

      <Icon icon={icon} size={24} color={type === 'gradient' ? theme.colors.white : theme.colors.secondaryText} />
    </View>
  )
}
