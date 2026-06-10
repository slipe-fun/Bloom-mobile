import Toggle from '@components/ui/toggle'
import { quickSpring } from '@constants/animations'
import type { SettingsItem as SettingsItemType } from '@interfaces'
import { useTranslation } from 'react-i18next'
import { Pressable, Text, View } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'
import Icon from '../../Icon'
import SettingsIcon from '../settingsIcon'
import { styles } from './SettingsItem.styles'

interface SettingsItemProps {
  item: SettingsItemType
  last: boolean
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

export default function SettingsItem({ item, last }: SettingsItemProps) {
  const { t } = useTranslation('settings')
  const opacity = useSharedValue(1)

  const handlePress = (inn: boolean = true) => {
    item.type !== 'toggle' && !item.disabled && opacity.set(withSpring(inn ? 0.25 : 1, quickSpring))
  }

  const animatedPressableStyle = useAnimatedStyle(() => ({
    opacity: item.disabled ? 0.25 : opacity.get(),
  }))

  return (
    <AnimatedPressable
      onTouchStart={() => handlePress(true)}
      pointerEvents={item.disabled ? 'none' : undefined}
      onTouchMove={() => handlePress(false)}
      onTouchEnd={() => handlePress(false)}
      onPress={item.type !== 'toggle' ? item.action : undefined}
      style={[styles.container(item.type === 'button', item.type === 'toggle'), animatedPressableStyle]}
    >
      {item.icon && <SettingsIcon icon={item.icon} color={item.color} />}
      <View style={styles.content(last, !!item.icon)}>
        <Text style={styles.label(item.type === 'button', item.color)}>{t(item.label)}</Text>

        {item.type === 'link' ||
          (item.type === undefined && (
            <View style={styles.rightSide}>
              {typeof item.badgeLabel !== 'undefined' && <Text style={styles.badgeLabel}>{t(item.badgeLabel)}</Text>}
              <Icon
                icon={item.badgeIcon ?? 'chevron.right'}
                size={item.badgeIcon ? 24 : 20}
                uniProps={(theme) => ({ color: theme.colors.secondaryText })}
              />
            </View>
          ))}
      </View>
      {item.type === 'toggle' && <Toggle value={item.toggleValue} onToggle={item.action} />}
    </AnimatedPressable>
  )
}
