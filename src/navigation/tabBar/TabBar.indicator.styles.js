import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create(theme => ({
    indicator: {
       position: "absolute",
       left: 16,
       opacity: theme.opacity.secondaryText,
       backgroundColor: theme.colors.primary,
       height: 42,
       borderRadius: theme.radius.full,
    }
}));
