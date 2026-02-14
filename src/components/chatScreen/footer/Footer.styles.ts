import { Platform } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

export const styles = StyleSheet.create((theme) => ({
  footer: {
    width: '100%',
    paddingTop: theme.spacing.md,
    flexDirection: 'row',
    position: 'absolute',
    alignItems: 'flex-end',
    bottom: 0,
    gap: theme.spacing.md,
  },
  inputWrapper: {
    backgroundColor: Platform.OS === 'ios' ? theme.colors.foregroundBlur : theme.colors.foreground,
    borderRadius: theme.radius.lg,
    borderWidth: theme.borderWidth.md,
    borderColor: theme.colors.border,
    overflow: 'hidden',
    flex: 1,
    borderCurve: 'continuous',
    zIndex: 1,
  },
  buttonBackground: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.full,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
  },
}))
