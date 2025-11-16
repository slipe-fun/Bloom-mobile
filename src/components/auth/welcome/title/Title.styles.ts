import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create((theme) => ({
    titleContainer: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",   
        alignItems: 'center',
        paddingHorizontal: theme.spacing.xl,
    },
    char: {
        fontSize: theme.fontSize.super,
        fontFamily: theme.fontFamily.bold,
        transformOrigin: 'bottom-center',
        color: theme.colors.primary,
    }
}))