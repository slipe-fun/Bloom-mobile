import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create(theme => ({
    container: (paddingBottom: number) => ({
        flex: 1,
        paddingHorizontal: theme.spacing.xl,
        gap: theme.spacing.lg,
        justifyContent: 'center',
        paddingBottom,
    }),
}));
