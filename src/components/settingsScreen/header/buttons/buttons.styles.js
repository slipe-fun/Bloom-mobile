import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create((theme) => ({
  container: {
    alignItems: "center",
    flexDirection: "row",
    width: "100%",
    gap: theme.spacing.lg,
  },
  button: {
    flex: 1,
    overflow: "hidden",
    height: '100%',
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FF9C33",
    borderRadius: theme.radius.full,
  },
}));