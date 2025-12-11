import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create(theme => ({
    wrapper: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        position: "absolute",
        paddingHorizontal: 40,
        justifyContent: "center",   
        alignItems: "center",
    },
    modal: {
        width: "100%",
        maxWidth: 300,
        justifyContent: "center",
        alignItems: "center",
        gap: theme.spacing.lg,  
        padding: theme.spacing.xxl,
        backgroundColor: theme.colors.foreground,
        borderCurve: 'continuous',
        borderRadius: theme.radius.xxxl,
    },
    title: {
        fontSize: theme.fontSize.md,
        textAlign: 'center',
        color: theme.colors.text,
        fontFamily: theme.fontFamily.medium,
    },
    iconWrapper:(color: keyof typeof theme.colors) => ({
        width: 72,
        height: 72,
        borderRadius: theme.radius.full,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors[color + "Backdrop"],
    })
}));