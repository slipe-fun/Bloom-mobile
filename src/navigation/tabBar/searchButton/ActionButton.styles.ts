import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create((theme) => ({
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
}));
