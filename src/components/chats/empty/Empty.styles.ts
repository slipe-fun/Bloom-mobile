import { StyleSheet } from 'react-native-unistyles'

export const styles = StyleSheet.create((theme) => ({
  container: {
    ...StyleSheet.absoluteFillObject,
    gap: theme.spacing.lg,
    paddingHorizontal: theme.spacing.modal,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shuffleContainer: {
    maxWidth: 305,
    width: '100%',
    height: 115,
    position: 'relative',
    // backgroundColor: 'pink',
    overflow: 'visible',
    justifyContent: 'flex-end',
  },
  shuffleCard: {
    width: '100%',
    height: 68,
    overflow: 'hidden',
    position: 'absolute',
    borderRadius: theme.radius.md,
    borderCurve: 'continuous',
    backgroundColor: theme.colors.foreground,
  },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.background,
    zIndex: 1,
  },
}))
