import { Platform } from 'react-native'
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
  },
  tabBarWrapper: {
    flex: 1,
    backgroundColor: Platform.OS === "ios" ? theme.colors.foregroundBlur : theme.colors.foreground,
    borderRadius: theme.radius.full,
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
    borderCurve: 'continuous',
    height: 54 - theme.spacing.xs * 2,
    borderRadius: theme.radius.full,
  },
  tabBarItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
}))
