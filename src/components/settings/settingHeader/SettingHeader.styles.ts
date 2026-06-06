import { SIZE_MAP } from '@components/ui/button/constats'
import { StyleSheet } from 'react-native-unistyles'

export const styles = StyleSheet.create((theme) => ({
  header: (paddingTop: number) => ({
    width: '100%',
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl,
    paddingTop,
    flexDirection: 'row',
    zIndex: 1,
  }),
  titleWrapper: {
    gap: theme.spacing.sm - 2,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: theme.fontSize.lg,
    fontFamily: theme.fontFamily.semibold,
    color: theme.colors.text,
  },
  padding: {
    width: SIZE_MAP.md,
    height: SIZE_MAP.md,
  },
}))
