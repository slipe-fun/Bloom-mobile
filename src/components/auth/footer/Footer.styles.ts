import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create(theme => ({
	footer:{ 
        width: "100%", 
        position: 'absolute',
        bottom: 0,
        paddingHorizontal: theme.spacing.xxxl,
     },
     buttonLabel: {
        fontSize: theme.fontSize.lg,
        fontFamily: theme.fontFamily.semibold,
        color: theme.colors.text,
    },
    partsContainer: {
        flexDirection: "row",
    }
}));
