import { StyleSheet } from 'react-native-unistyles'
import { SIZE_MAP } from './constats'

type ButtonStyleProps = {
  size: number
  isIcon: boolean
  paddingHorizontal: number
  elevated: boolean
  isTextIcon: boolean
}

export const styles = StyleSheet.create((theme) => ({
  button: ({ size, isIcon, paddingHorizontal, elevated, isTextIcon }: ButtonStyleProps) => ({
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    boxShadow: elevated ? `${theme.shadows.pressable} ${theme.colors.shadow}` : undefined,
    height: size,
    width: size >= SIZE_MAP.xl ? '100%' : 'auto',
    overflow: 'hidden',
    aspectRatio: isIcon ? 1 : undefined,
    paddingHorizontal: size >= SIZE_MAP.xl ? 0 : paddingHorizontal,
    borderCurve: 'continuous',
    borderRadius: theme.radius.full,
    backgroundColor: elevated ? 'transparent' : theme.colors.foreground,
    gap: isTextIcon ? theme.spacing.md - theme.spacing.xxs : 0,
  }),
  label: (size: number) => ({
    color: theme.colors.text,
    fontSize: size >= SIZE_MAP.lg ? theme.fontSize.lg : theme.fontSize.md,
    fontFamily: theme.fontFamily.medium,
  }),
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
