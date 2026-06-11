import { StyleSheet } from 'react-native-unistyles'

export const styles = StyleSheet.create((theme) => ({
  header: {
    width: '100%',
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xxxl + 10,
    flexDirection: 'row',
    zIndex: 1,
    top: 0,
    position: 'absolute',
    alignItems: 'center',
    gap: theme.spacing.lg,
  },
  title: {
    fontFamily: theme.fontFamily.semibold,
  },
  user: {
    flex: 1,
    overflow: 'visible',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    zIndex: 1,
    boxShadow: `${theme.shadows.pressable} ${theme.colors.shadow}`,
  },
  titleWrapper: {
    position: 'absolute',
    top: 42,
    paddingHorizontal: theme.spacing.lg - 2,
    height: 36,
  },
}))
