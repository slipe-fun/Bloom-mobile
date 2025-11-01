import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create(theme => ({
    replyWrapper: {
        padding: theme.spacing.xs,
        paddingBottom: 0,
    },
    replyChild: {
        borderTopLeftRadius: theme.radius.sm,
        borderTopRightRadius: theme.radius.sm,
        borderBottomLeftRadius: theme.radius.xs,
        borderBottomRightRadius: theme.radius.xs,
        backgroundColor: theme.colors.foregroundTransparent,
        borderCurve: 'continuous',
        flex: 1,
        flexDirection: 'row'
    },
    replyTo: {
        gap: theme.spacing.xs,
        padding: theme.spacing.md,
        flex: 1,
    },
    replyToName: {
        color: theme.colors.text,
        fontSize: theme.fontSize.md,
        fontFamily: theme.fontFamily.semibold
    },
    replyToMessage: {
        color: theme.colors.secondaryText,
        fontFamily: theme.fontFamily.medium,
        fontSize: theme.fontSize.sm
    },
    button: {
        backgroundColor: 'transparent'
    }
}))