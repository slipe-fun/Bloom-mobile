import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create(theme => ({
	actionsContainer: { 
        width: "100%", 
        gap: theme.spacing.lg, 
        paddingHorizontal: 20, 
        flexDirection: "column", 
        paddingBottom: theme.spacing.xl,
     },
    separatorContainer: {
        paddingHorizontal: theme.spacing.lg,
    },
    button: (focus) => ({
        backgroundColor: focus ? theme.colors.text : theme.colors.foreground,
    }),
    buttonLabel: (focus) => ({
        fontFamily: theme.fontFamily.semibold,
        color: focus ? theme.colors.background : theme.colors.text,
    }),
    imageIcon: {
        width: 26, 
        height: 26,
    } 
}));
