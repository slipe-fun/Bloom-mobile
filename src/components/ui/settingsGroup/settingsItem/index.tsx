import { springy } from '@constants/animations'
import type { SettingsItem as SettingsItemType } from '@interfaces'
import { useTranslation } from 'react-i18next'
import { Pressable, Text, View } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'
import { useUnistyles } from 'react-native-unistyles'
import Icon from '../../Icon'
import SettingsIcon from '../settingsIcon'
import { styles } from './SettingsItem.styles'

interface SettingsItemProps {
  item: SettingsItemType
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

export default function SettingsItem({ item }: SettingsItemProps) {
  const { theme } = useUnistyles()
  const { t } = useTranslation('common')
  const scale = useSharedValue(1)

  const iconColor: string = theme.colors[item.color] ?? theme.colors.secondaryText

  const handlePress = (inn: boolean = true) => {
    scale.set(withSpring(inn ? 1.03 : 1, springy))
  }

  const animatedPressableStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.get() }],
  }))

  return (
    <AnimatedPressable
      onTouchStart={() => handlePress(true)}
      onTouchMove={() => handlePress(false)}
      onTouchEnd={() => handlePress(false)}
      style={[styles.container, animatedPressableStyle]}
    >
      {item.type !== 'button' && <SettingsIcon icon={item.icon} color={iconColor} />}
      {/* @ts-expect-error */}
      <Text style={styles.label(item.type === 'button', item.color)}>{t(item.label)}</Text>

      {item.type !== 'button' && (
        <View style={styles.rightSide}>
          {typeof item.badgeLabel !== 'undefined' && <Text style={styles.badgeLabel}>{item.badgeLabel}</Text>}
          <Icon icon={item.badgeIcon ?? 'chevron.right'} size={item.badgeIcon ? 24 : 20} color={theme.colors.secondaryText} />
        </View>
      )}
    </AnimatedPressable>
  )
}
