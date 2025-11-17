import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create(theme => ({
    titleContainer: {
        width: '100%',
        gap: theme.spacing.md,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: 100,
        height: 100
    },
    title: {
        fontFamily: theme.fontFamily.bold,
        fontSize: theme.fontSize.xxxl,
        color: theme.colors.text
    }
}))