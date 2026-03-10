import { Platform } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

type InputStyleProps = {
  height: number
  disabled: boolean
  elevated: boolean
}

export const styles = StyleSheet.create((theme) => ({
  inputWrapper: ({ height, disabled, elevated }: InputStyleProps) => ({
    width: '100%',
    height: 'auto',
    minHeight: height,
    backgroundColor: theme.colors.pressable,
    borderRadius: theme.radius.full,
    borderCurve: 'continuous',
    boxShadow: elevated ? `${theme.shadows.pressable} ${theme.colors.shadow}` : undefined,
    flexDirection: 'row',
    borderColor: elevated ? theme.colors.border : 'transparent',
    borderWidth: theme.borderWidth.md,
    opacity: disabled ? theme.opacity.secondaryText : 1,
    pointerEvents: disabled ? 'none' : 'auto',
    alignItems: 'center',
  }),
  input: (icon: boolean, size: number) => ({
    flex: 1,
    paddingLeft: icon ? 0 : theme.spacing.lg,
    paddingVertical: Platform.OS === 'ios' ? (size - size / 2) / 2 : 0,
    paddingRight: theme.spacing.lg,
    textAlignVertical: 'center',
    includeFontPadding: false,
    height: size,
    color: theme.colors.text,
    fontSize: theme.fontSize.md,
    fontFamily: theme.fontFamily.medium,
    borderWidth: 0,
  }),
  iconWrapper: {
    height: '100%',
    aspectRatio: 1 / 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
}))
