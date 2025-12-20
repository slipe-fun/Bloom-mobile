import TabBarItem from "./Item";
import { LayoutChangeEvent } from "react-native";
import { styles } from "./TabBarContainer.styles";
import TabBarIndicator from "./Indicator";
import { Haptics } from "react-native-nitro-haptics";
import useTabBarStore from "@stores/tabBar";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  LayoutAnimationConfig,
} from "react-native-reanimated";
import TabBarSearchButton from "./searchButton";
import {
  springyTabBar,
  vSlideAnimationIn,
  vSlideAnimationOut,
  zoomAnimationIn,
  zoomAnimationOut,
} from "@constants/animations";
import React, { useCallback } from "react";
import { StyleSheet } from "react-native-unistyles";
import { BlurView } from "expo-blur";

export default function TabBarContainer({ state, navigation }): React.JSX.Element {
  const { setTabBarHeight, isSearch, tabBarHeight, isSearchFocused } = useTabBarStore();
  const tabBarWidth = useSharedValue(0);

  const animatedViewStyle = useAnimatedStyle(() => {
    return tabBarWidth.value > 0
      ? {
          height: withSpring(isSearch ? 48 : 54, springyTabBar),
          width: withSpring(isSearch ? 48 : tabBarWidth.value, springyTabBar),
        }
      : {};
  }, [isSearch, tabBarWidth, isSearchFocused]);

  const onLayoutTabBar = useCallback((event: LayoutChangeEvent, isContainer: boolean = false) => {
    const { layout } = event.nativeEvent;

    if (tabBarWidth.value <= 1 && !isContainer) tabBarWidth.value = layout.width;

    if (tabBarHeight <= 1 && isContainer) setTabBarHeight(layout.height);
  }, []);

  const onPress = useCallback((route, focused: boolean) => {
    const event = navigation.emit({
      type: "tabPress",
      target: route.key,
      canPreventDefault: true,
    });

    if (!focused && !event.defaultPrevented) {
      Haptics.impact("light");
      navigation.navigate(route.name);
    }
  }, []);

  return (
    <Animated.View exiting={vSlideAnimationOut} entering={vSlideAnimationIn} style={styles.tabBarWrapper}>
      <LayoutAnimationConfig skipEntering skipExiting>
        {!isSearchFocused && (
          <Animated.View
            exiting={zoomAnimationOut}
            entering={zoomAnimationIn}
            onLayout={(event) => onLayoutTabBar(event)}
            style={[styles.tabBar, animatedViewStyle]}
          >
            <BlurView style={StyleSheet.absoluteFill} intensity={40} tint='systemChromeMaterialDark' />
            <TabBarIndicator index={state.index} count={state.routes.length} />
            {state.routes.map((route, index) => {
              const focused = state.index === index;

              return (
                <TabBarItem
                  key={index}
                  route={route}
                  focused={focused}
                  onPress={() => onPress(route, focused)}
                />
              );
            })}
          </Animated.View>
        )}
        <TabBarSearchButton />
      </LayoutAnimationConfig>
    </Animated.View>
  );
}
