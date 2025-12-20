import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create((theme) => ({
  tabBarWrapper: {
    flexDirection: "row",
    gap: theme.spacing.md,
    width: "100%",
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
}));
