import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create(theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  list: (paddingBottom: number) => ({
    paddingBottom,
    paddingHorizontal: theme.spacing.lg,
  })
}));
