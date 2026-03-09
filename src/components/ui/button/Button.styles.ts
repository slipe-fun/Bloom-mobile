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
    height: size,
    width: size >= SIZE_MAP.xl ? '100%' : 'auto',
    overflow: 'hidden',
    aspectRatio: isIcon ? 1 : undefined,
    paddingHorizontal: size >= SIZE_MAP.xl ? 0 : paddingHorizontal,
    borderCurve: 'continuous',
    borderRadius: theme.radius.full,
    boxShadow: elevated ? `${theme.shadows.pressable} ${theme.colors.shadow}` : undefined,
    borderColor: elevated ? theme.colors.border : 'transparent',
    borderWidth: theme.borderWidth.md,
    backgroundColor: theme.colors.pressable,
    gap: isTextIcon ? theme.spacing.md - theme.spacing.xxs : 0,
  }),
  label: (size: number) => ({
    color: theme.colors.text,
    fontSize: size >= SIZE_MAP.lg ? theme.fontSize.lg : theme.fontSize.md,
    fontFamily: theme.fontFamily.medium,
  }),
}))
