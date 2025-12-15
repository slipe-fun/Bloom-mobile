import { LayoutChangeEvent, Text, TextStyle, ViewStyle } from "react-native";
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
  const scrollTarget = useSharedValue<number>(0);

  const onLayout = useCallback((event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    headerHeightValue.set(height);
    setHeaderHeight(height);
  }, []);

  const animatedViewStyle = (large: boolean = false) =>
    useAnimatedStyle((): ViewStyle => {
      scrollTarget.set(headerHeightValue.get() - insets.top)
      return large
        ? {
            opacity: interpolate(scrollY.get(), [0, scrollTarget.get()], [1, 0], "clamp"),
            transform: [
              {
                translateY: interpolate(
                  scrollY.get(),
                  [0, scrollTarget.get()],
                  [0, -scrollTarget.get()],
                  "clamp"
                ),
              },
            ],
          }
        : {
            opacity: interpolate(scrollY.get(), [0, scrollTarget.get()], [0, 1], "clamp"),
          };
    }, [headerHeightValue]);

  const animatedTextStyle = useAnimatedStyle((): TextStyle => ({
    transform: [
      {
        translateY: interpolate(scrollY.get(), [0, scrollTarget.get()], [24, 0], "clamp")
      }
    ]
  }))

  return (
    <>
      <Animated.View
        onLayout={onLayout}
        style={[animatedViewStyle(true), styles.header(true, insets.top + 12)]}
      >
        <Text style={styles.title(true)}>Поиск</Text>
      </Animated.View>
      <Animated.View style={[animatedViewStyle(false), styles.header(false, insets.top)]}>
        <GradientBlur direction="top-to-bottom" />
        <Animated.Text style={[styles.title(false), animatedTextStyle]}>Поиск</Animated.Text>
      </Animated.View>
    </>
  );
}
