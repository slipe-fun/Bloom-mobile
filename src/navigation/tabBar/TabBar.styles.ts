import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create((theme) => ({
  tabBarContainer: {
    padding: theme.spacing.xxxl,
    paddingTop: theme.spacing.md,
    bottom: 0,
    position: "absolute",
    flexDirection: "row",
    justifyContent: 'flex-end',
    alignItems: 'center',
    left: 0,
    right: 0,
  },
}));
