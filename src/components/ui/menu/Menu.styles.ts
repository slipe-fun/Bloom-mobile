import { StyleSheet } from "react-native-unistyles";

type MenuWrapperStyleProps = {
  top?: number;
  open?: boolean;
};

export const styles = StyleSheet.create((theme: any) => ({
  backdrop: {
    position: "absolute",
    right: 0,
    top: 0,
    left: 0,
    bottom: 0,
  },
  menuWrapper: ({ open, top }: MenuWrapperStyleProps) => ({
    position: "absolute",
    right: 16,
    top,
    zIndex: 10,
    pointerEvents: open ? "auto" : "none",
  }),
  menu: {
    paddingVertical: theme.spacing.sm,
    transformOrigin: 'top right',
    borderCurve: 'continuous',
    overflow: 'hidden',
  },
  option: {
    padding: theme.spacing.lg,
    alignItems: 'center',
    flex: 1,
    gap: theme.spacing.md,
    flexDirection: 'row',
  },
  optionText:(color?: string) => ({
    fontSize: theme.fontSize.md,
    color,
    fontFamily: theme.fontFamily.medium
  })
}));
