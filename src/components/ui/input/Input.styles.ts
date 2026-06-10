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
    height,
    backgroundColor: elevated ? 'transparent' : theme.colors.foreground,
    borderRadius: theme.radius.full,
    borderCurve: 'continuous',
    overflow: 'hidden',
    boxShadow: elevated ? `${theme.shadows.pressable} ${theme.colors.shadow}` : undefined,
    flexDirection: 'row',
    opacity: disabled ? theme.opacity.secondaryText : 1,
    pointerEvents: disabled ? 'none' : 'auto',
    alignItems: 'flex-end',
  }),
  input: (icon: boolean, size: number) => ({
    flex: 1,
    paddingLeft: icon ? 0 : theme.spacing.lg,
    paddingVertical: Platform.OS === 'ios' ? (size - size / 2) / 1.75 : 0,
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
    paddingLeft: theme.spacing.lg - 2,
    paddingRight: theme.spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  blur: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.pressable,
  },
  borderOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderColor: theme.colors.border,
    borderCurve: 'continuous',
    borderWidth: theme.borderWidth.md,
    borderRadius: theme.radius.full,
  },
}))
