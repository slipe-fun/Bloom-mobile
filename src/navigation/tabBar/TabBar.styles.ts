import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create((theme) => ({
  tabBarContainer: {
    padding: theme.spacing.xxxl,
    paddingTop: theme.spacing.md,
    bottom: 0,
    position: "absolute",
    flexDirection: "row",
    left: 0,
    right: 0,
    gap: theme.spacing.md,
    alignItems: "center",
    justifyContent: "center",
  },
  tabBar: {
    height: 54,
    backgroundColor: theme.colors.foregroundBlur,
    borderRadius: theme.radius.full,
    overflow: "hidden",
    flexDirection: "row",
    borderCurve: "continuous",
    padding: theme.spacing.xs,
    alignItems: "center",
    justifyContent: "center",
  },
  indicator: {
    position: "absolute",
    top: theme.spacing.xs,
    left: theme.spacing.xs,
    borderCurve: "continuous",
    height: 54 - theme.spacing.xs * 2,
    borderRadius: theme.radius.full,
  },
  tabBarItem: {
    alignItems: "center",
    justifyContent: "center",
    width: 70,
    height: "100%",
  },
  searchButton: {
    width: 54,
    height: 54,
    zIndex: 1,
    padding: 10,
    overflow: "hidden",
    borderRadius: theme.radius.full,
    borderCurve: "continuous",
    backgroundColor: theme.colors.foregroundBlur,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  searchInput: {
    height: 48,
    paddingLeft: 10,
  },
  cancelButton: {
	backgroundColor: theme.colors.foregroundBlur,
  }
}));
