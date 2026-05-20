import { StyleSheet } from 'react-native-unistyles'

export const styles = StyleSheet.create((theme) => ({
  shuffleContainer: {
    maxWidth: 275,
    width: '100%',
    height: 115,
    position: 'relative',
    overflow: 'visible',
    justifyContent: 'flex-end',
  },
  shuffleCard: {
    width: '100%',
    height: 68,
    overflow: 'hidden',
    position: 'absolute',
    padding: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md - 2,
    borderRadius: theme.radius.md,
    borderCurve: 'continuous',
    backgroundColor: theme.colors.foreground,
  },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.background,
    zIndex: 1,
  },
  avatar: {
    height: 44,
    width: 44,
    borderRadius: theme.radius.full,
  },
  textContainer: {
    flex: 1,
    gap: theme.spacing.md / 2,
  },
  namePlaceholder: {
    height: 15,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.switcher,
    borderCurve: 'continuous',
  },
  messagePlaceholder: {
    height: 15,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.switcher,
    borderCurve: 'continuous',
  },
}))
