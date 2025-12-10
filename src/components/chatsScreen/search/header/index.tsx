import { LayoutChangeEvent, Text, ViewStyle } from "react-native";
import Animated, {
  interpolate,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { styles } from "./Header.styles";
import { useInsets } from "@hooks";
import { GradientBlur } from "@components/ui";
import { useCallback } from "react";

type SearchHeaderProps = {
  scrollY: SharedValue<number>;
  setHeaderHeight: (height: number) => void;
};

export default function SearchHeader({ scrollY, setHeaderHeight }: SearchHeaderProps): React.JSX.Element {
  const headerHeightValue = useSharedValue<number>(0);
  const insets = useInsets();

  const onLayout = useCallback((event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    headerHeightValue.set(height);
    setHeaderHeight(height);
  }, []);

  const animatedViewStyle = (large: boolean = false) =>
    useAnimatedStyle((): ViewStyle => {
      return large
        ? {
            opacity: interpolate(scrollY.get(), [0, headerHeightValue.get()], [1, 0], "clamp"),
            transform: [
              {
                translateY: interpolate(
                  scrollY.get(),
                  [0, headerHeightValue.get()],
                  [0, -headerHeightValue.get() / 2],
                  "clamp"
                ),
              },
            ],
          }
        : {
            opacity: interpolate(scrollY.get(), [0, headerHeightValue.get()], [0, 1], "clamp"),
            transform: [
              {
                translateY: interpolate(scrollY.get(), [0, headerHeightValue.get()], [30, 0], "clamp"),
              },
            ],
          };
    }, [headerHeightValue]);

  return (
    <>
      <Animated.View
        onLayout={onLayout}
        style={[animatedViewStyle(true), styles.header(true, insets.top + 12)]}
      >
        <Text style={styles.title(true)}>Поиск</Text>
      </Animated.View>
      <Animated.View style={[animatedViewStyle(false), styles.header(false, insets.top)]}>
        <GradientBlur />
        <Text style={styles.title(false)}>Поиск</Text>
      </Animated.View>
    </>
  );
}
