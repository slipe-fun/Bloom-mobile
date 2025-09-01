import React, { useRef, useEffect } from "react";
import { View } from "react-native";
import PagerView from "react-native-pager-view";
import Animated, {
  useAnimatedStyle,
  interpolateColor,
} from "react-native-reanimated";
import { styles } from "./Slider.styles";
import { useUnistyles } from "react-native-unistyles";
import Slide from "./slide";

const AnimatedView = Animated.createAnimatedComponent(View);

export default function Slider({ slides, setPage, position, offset, page }) {
  const pagerRef = useRef(null);
  const { theme } = useUnistyles();

  useEffect(() => {
    const total = slides.length;
    const timer = setInterval(() => {
      if (page < total - 1) {
        page += 1;
        pagerRef.current?.setPage(page);
        setPage(page);
      } else {
        clearInterval(timer);
      }
    }, 4000);
    return () => clearInterval(timer);
  }, [slides, setPage, position, page]);

  const renderIndicators = () => (
    <View style={styles.indicators}>
      {slides.map((slide, index) => {
        const animatedStyle = useAnimatedStyle(() => {
          const progress = position.value + offset.value;
          const backgroundColor = interpolateColor(
            progress,
            [index - 1, index, index + 1],
            [
              theme.colors.secondaryText,
              slide.color,
              theme.colors.secondaryText,
            ]
          );
          return { backgroundColor };
        });

        return <AnimatedView key={index} style={[styles.dot, animatedStyle]} />;
      })}
    </View>
  );

  return (
    <View style={styles.pagerWrapper}>
      <PagerView
        style={styles.pager}
        ref={pagerRef}
        initialPage={0}
        onPageSelected={(e) => setPage(e.nativeEvent.position)}
        onPageScroll={(e) => {
          position.value = e.nativeEvent.position;
          offset.value = e.nativeEvent.offset;
        }}
        overScrollMode="never"
      >
        {slides.map((item, index) => (
          <Slide
            key={index}
            item={item}
            index={index}
            position={position}
            offset={offset}
          />
        ))}
      </PagerView>
      {renderIndicators()}
    </View>
  );
}
