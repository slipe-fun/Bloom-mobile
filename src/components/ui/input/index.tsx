import type React from 'react'
import { useMemo } from 'react'
import { type StyleProp, TextInput, View, type ViewStyle } from 'react-native'
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
  basic?: boolean
} & React.ComponentProps<typeof TextInput>

const SIZE_MAP: Record<Size, number> = {
  sm: 40,
  md: 44,
  lg: 48,
}

export default function Input({ size, ref, viewStyle, style, icon, button, disabled, basic, ...props }: InputProps): React.JSX.Element {
  const { theme } = useUnistyles()

  const viewStyleMemo = useMemo(() => styles.inputWrapper({ height: SIZE_MAP[size], disabled }), [size])

  const inputComponent = (
    <TextInput
      ref={ref}
      cursorColor={theme.colors.secondaryText}
      selectionColor={theme.colors.secondaryText}
      keyboardAppearance="dark"
      placeholderTextColor={theme.colors.secondaryText}
      style={[styles.input(!!icon, SIZE_MAP[size]), style]}
      {...props}
    />
  )

  return !basic ? (
    <View style={[viewStyleMemo, viewStyle]}>
      {icon && <View style={styles.iconWrapper}>{icon}</View>}
      {inputComponent}
      {button}
    </View>
  ) : (
    inputComponent
  )
}
