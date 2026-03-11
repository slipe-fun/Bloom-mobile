import { springy } from '@constants/animations'
import { PRESSABLE_INPUT_SCALE } from '@constants/animations/values'
import type React from 'react'
import { type StyleProp, TextInput, View, type ViewStyle } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'
import { useUnistyles } from 'react-native-unistyles'
import { styles } from './Input.styles'

type Size = 'sm' | 'md' | 'lg'

type InputProps = {
  size?: Size
  ref?: React.Ref<TextInput>
  viewStyle?: StyleProp<ViewStyle>
  style?: StyleProp<ViewStyle>
  icon?: React.ReactNode
  button?: React.ReactNode
  disabled?: boolean
  animation?: boolean
  elevated?: boolean
  basic?: boolean
} & React.ComponentProps<typeof TextInput>

const SIZE_MAP: Record<Size, number> = {
  sm: 40,
  md: 44,
  lg: 48,
}

export default function Input({
  size,
  ref,
  viewStyle,
  style,
  icon,
  button,
  disabled,
  basic,
  elevated = true,
  animation = true,
  ...props
}: InputProps) {
  const { theme, rt } = useUnistyles()
  const scale = useSharedValue(1)

  const viewStyleMemo = styles.inputWrapper({ height: SIZE_MAP[size], disabled, elevated })

  const handlePress = (inn: boolean = true) => {
    scale.set(withSpring(inn ? PRESSABLE_INPUT_SCALE : 1, springy))
  }

  const animatedlStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.get() }],
  }))

  const inputComponent = (
    <TextInput
      ref={ref}
      onTouchStart={() => handlePress(true)}
      onTouchEnd={() => handlePress(false)}
      cursorColor={theme.colors.secondaryText}
      selectionColor={theme.colors.secondaryText}
      keyboardAppearance={rt.themeName.includes('dark') ? 'dark' : 'light'}
      placeholderTextColor={theme.colors.secondaryText}
      style={[styles.input(!!icon, SIZE_MAP[size]), style]}
      {...props}
    />
  )

  return !basic ? (
    <Animated.View style={[viewStyleMemo, viewStyle, animation ? animatedlStyle : undefined]}>
      {icon && <View style={styles.iconWrapper}>{icon}</View>}
      {inputComponent}
      {button}
    </Animated.View>
  ) : (
    inputComponent
  )
}
