import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create(theme => ({
    text: {
       fontFamily: theme.fontFamily.medium,
       fontSize: theme.fontSize.md,
       color: theme.colors.secondaryText,
       textAlign: 'center'
    },
    actionText: {
        fontFamily: theme.fontFamily.semibold,
        fontSize: theme.fontSize.md,
        color: theme.colors.primary
    }
}));
