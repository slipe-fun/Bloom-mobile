import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create((theme) => ({
    wrapper: {
        width: "100%",
        height: "100%", 
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
        backgroundColor: theme.colors.cyanBackdrop,
        borderRadius: theme.radius.xl,
    },
    content: {
        gap: theme.spacing.sm,
        alignItems: "center",   
    },
    title: {
        fontSize: theme.fontSize.lg,
        lineHeight: theme.lineHeight.lg,
        color: theme.colors.cyan,
        fontFamily: theme.fontFamily.semibold,
    },
    description: {
        fontSize: theme.fontSize.md,
        lineHeight: theme.lineHeight.md,
        color: theme.colors.cyan,
        textAlign: "center",    
        opacity: theme.opacity.contentText,
        fontFamily: theme.fontFamily.medium,
    },
}));