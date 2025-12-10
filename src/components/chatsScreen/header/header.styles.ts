import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create((theme) => ({
  header: {
    position: "absolute",
    top: 0,
    zIndex: 2,
    width: "100%",
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
    alignItems: "center",
    gap: theme.spacing.lg,
  },
  topHeader: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  text: {
    color: theme.colors.text,
    fontSize: theme.fontSize.lg,
    fontFamily: theme.fontFamily.bold,
  },
}));
