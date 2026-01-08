import { StyleSheet } from 'react-native-unistyles'

export const styles = StyleSheet.create((theme) => ({
  tabBarContainer: {
    paddingHorizontal: theme.spacing.xxl,
    paddingTop: theme.spacing.md,
    bottom: 0,
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    left: 0,
    right: 0,
  },
}))
