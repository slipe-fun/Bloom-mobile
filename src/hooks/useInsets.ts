import { useMemo } from "react";
import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useUnistyles } from "react-native-unistyles";

type Insets = {
  top: number;
  bottom: number;
};

export default function useInsets(): Insets {
  const insets = useSafeAreaInsets();
  const { theme } = useUnistyles();

  return useMemo(() => {
    const isIos = Platform.OS === "ios";
    const iosVersion = isIos ? parseInt(String(Platform.Version), 10) : 0;
    const isIos26 = isIos && iosVersion >= 26;

    const bottom = isIos ? (isIos26 ? theme.spacing.xxxl : insets.bottom) : insets.bottom + 8;

    const top = isIos ? insets.top : insets.top + 6;

    return {
      top,
      bottom,
    };
  }, [insets, theme]);
}
