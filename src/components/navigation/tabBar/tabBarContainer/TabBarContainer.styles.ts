import { StyleSheet } from 'react-native-unistyles'

export const styles = StyleSheet.create((theme) => ({
  container: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  tabBar: {
    flex: 1,
    gap: theme.spacing.md - 2,
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.md - 2 + theme.spacing.xs,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  tabBarWrapper: {
    flex: 1,
    backgroundColor: theme.colors.pressable,
    borderRadius: theme.radius.full,
    boxShadow: `${theme.shadows.pressable} ${theme.colors.shadow}`,
    borderWidth: theme.borderWidth.md,
    borderColor: theme.colors.border,
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderCurve: 'continuous',
  },
  indicator: {
    position: 'absolute',
    top: theme.spacing.xs,
    left: theme.spacing.xs,
    transformOrigin: 'center',
    borderCurve: 'continuous',
    height: 51.5 - theme.spacing.xs * 2,
    backgroundColor: theme.colors.foregroundTransparent,
    borderRadius: theme.radius.full,
  },
  tabBarItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    height: '100%',
  },
}))
