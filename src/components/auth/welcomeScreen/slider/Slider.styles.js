import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create((theme) => ({
  pager: {
    width: "100%",
    aspectRatio: 1 / 1,
  },
  pagerWrapper: {
    flex: 1,
    zIndex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  indicators: {
    flexDirection: "row",
    gap: theme.spacing.md,
    justifyContent: "center",
    alignItems: "center",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.secondaryText,
  },
}));
