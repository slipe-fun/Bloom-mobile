import { quickSpring } from '@constants/easings'
import type { SettingsItem as SettingsItemType } from '@interfaces'
import { lightenColor } from '@lib/lightenColor'
import type React from 'react'
import { Pressable, Text, View, type ViewStyle } from 'react-native'
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'
import { useUnistyles } from 'react-native-unistyles'
import Icon from '../../Icon'
import SettingsIcon from '../settingsIcon'
import { styles } from './SettingsItem.styles'

interface SettingsItemProps {
  item: SettingsItemType
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

export default function SettingsItem({ item }: SettingsItemProps): React.JSX.Element {
  const { theme } = useUnistyles()
  const color = useSharedValue<number>(0)

  const iconColor: string = theme.colors[item.color] ?? theme.colors.primary
  const brighterForeground: string = lightenColor(theme.colors.foreground, 10)

  const pressableColor = (out: boolean = false) => {
    color.set(withSpring(out ? 0 : 1, quickSpring))
  }

  const animatedPressableStyle = useAnimatedStyle(
    (): ViewStyle => ({
      backgroundColor: interpolateColor(color.get(), [0, 1], [theme.colors.foreground, brighterForeground]),
    }),
  )

  return (
    <AnimatedPressable
      onPressIn={() => pressableColor(false)}
      onPressOut={() => pressableColor(true)}
      style={[styles.container, animatedPressableStyle]}
    >
      {item.type !== 'button' && <SettingsIcon icon={item.icon} type={item.iconType} color={iconColor} />}

      <Text style={styles.label(item.type === 'button', item.color)}>{item.label}</Text>

      {item.type !== 'button' && (
        <View style={styles.rightSide}>
          {typeof item.badgeLabel !== 'undefined' && <Text style={styles.badgeLabel}>{item.badgeLabel}</Text>}
          <Icon icon={item.badgeIcon ?? 'chevron.right'} size={item.badgeIcon ? 24 : 20} color={theme.colors.secondaryText} />
        </View>
      )}
    </AnimatedPressable>
  )
}
