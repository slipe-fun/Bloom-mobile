import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create((theme: any) => ({
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
        backgroundColor: theme.colors.foreground,
        borderCurve: 'continuous',
        borderRadius: theme.radius.xxl,
    },
    title:(isName: boolean) => ({
        fontSize: theme.fontSize.md,
        textAlign: 'center',
        color: isName ? theme.colors.primary : theme.colors.text,
        fontFamily: isName ? theme.fontFamily.semibold : theme.fontFamily.medium,
    }),
}));