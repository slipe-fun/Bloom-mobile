import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create(theme => ({
    container: {
        flex: 1,
        paddingHorizontal: theme.spacing.xl,
        gap: theme.spacing.lg,
        justifyContent: 'center',
    },
}));
