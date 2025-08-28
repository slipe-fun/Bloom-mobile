import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create(theme => ({
    tabBarItem: {
       flex: 1,
       justifyContent: "center",
       alignItems: "center",
       gap: theme.spacing.xxs,
       height: 42,
       flexDirection: "column",
       color: theme.colors.text,
    },
    label: {
         fontSize: theme.fontSize.xs,
         lineHeight: theme.lineHeight.xs,
         color: theme.colors.text,
         fontFamily: theme.fontFamily.medium,
    }
}));
