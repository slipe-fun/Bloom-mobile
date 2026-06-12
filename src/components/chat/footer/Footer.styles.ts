import { SIZE_MAP } from '@components/ui/input'
import { StyleSheet } from 'react-native-unistyles'

export const styles = StyleSheet.create((theme) => ({
  footer: {
    width: '100%',
    paddingTop: theme.spacing.xxl,
    flexDirection: 'row',
    position: 'absolute',
    alignItems: 'flex-end',
    bottom: 0,
    gap: theme.spacing.md,
  },
  sendButtonWrapper: {
    height: SIZE_MAP.md,
    aspectRatio: 1 / 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pressable: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  sendButtonBackground: {
    height: SIZE_MAP.md - theme.spacing.xs * 2,
    position: 'absolute',
    aspectRatio: 1 / 1,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.primary,
  },
}))
