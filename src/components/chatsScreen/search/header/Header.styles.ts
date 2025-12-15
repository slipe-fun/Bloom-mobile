import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create(theme => ({
    header: (large: boolean = false, paddingTop: number) => ({
        position: 'absolute',
        left: 0,
        right: 0,
        paddingTop,
        zIndex: 1,
        top: 0,
        paddingHorizontal: theme.spacing.lg,
        paddingBottom: large ? theme.spacing.lg : theme.spacing.md,
        alignItems: large ? 'flex-start' : 'center'
    }),
     title: (large: boolean = false) => ({
        fontFamily: large ? theme.fontFamily.bold : theme.fontFamily.semibold,
        fontSize: large ? theme.fontSize.xxxl : theme.fontSize.lg,
        color: theme.colors.text
    }),
}))