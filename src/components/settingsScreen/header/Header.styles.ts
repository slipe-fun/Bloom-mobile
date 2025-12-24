import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create(theme => ({
    header: (paddingTop: number) => ({
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        paddingTop,
        gap: theme.spacing.lg,
        paddingBottom: theme.spacing.lg,
        paddingHorizontal: theme.spacing.lg,
    }),
    floatingHeader: (paddingTop: number) => ({
        left: 0,
        right: 0,
        top: 0,
        zIndex: 1,
        paddingTop,
        position: 'absolute',
        alignItems: 'center',
        paddingBottom: theme.spacing.md
    }),
    floatingHeaderTitle: {
        color: theme.colors.text,
        fontFamily: theme.fontFamily.semibold,
        fontSize: theme.fontSize.lg,
    }
}));