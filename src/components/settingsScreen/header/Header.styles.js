import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create((theme) => ({
    header: {
        width: "100%",
        position: "absolute",
        zIndex: 1,
        overflow: 'hidden',
    },
    background: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        position: "absolute",
    },
    content: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: theme.spacing.lg,
        paddingBottom: theme.spacing.lg,
        paddingHorizontal: theme.spacing.lg,
    },
}));