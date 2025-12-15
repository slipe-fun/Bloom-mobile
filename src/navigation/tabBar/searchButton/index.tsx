import React, { useRef } from "react";
import { Pressable, TextInput, StyleSheet } from "react-native";
import Animated from "react-native-reanimated";
import { styles } from "../TabBar.styles";
import { BlurView } from "expo-blur";
import { Button, Icon } from "@components/ui";
import useTabBarStore from "@stores/tabBar";
import { useUnistyles } from "react-native-unistyles";
import { getFadeIn, getFadeOut, makeLayoutAnimation } from "@constants/animations";
import { springyTabBar } from "@constants/animations";
import useSearchButtonAnimation from "src/hooks/useTabBarSearchAnimation";
import TabBarSearchInput from "./SearchInput";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const customLayout = makeLayoutAnimation(
  springyTabBar
);

export default function TabBarSearchButton(): React.JSX.Element {
  const ref = useRef<TextInput>(null);
  const { theme } = useUnistyles();
  const { isSearch, setIsSearch, setSearchValue } = useTabBarStore();

  const {
    animatedPressableStyle,
    animatedIconStyle,
    pressableOpacity,
    isDismiss,
  } = useSearchButtonAnimation();

  return (
    <>
      <AnimatedPressable
        style={[styles.searchButton, animatedPressableStyle]}
        onPress={() => setIsSearch(!isSearch)}
        onTouchStart={() => pressableOpacity(false)}
        onTouchEnd={() => pressableOpacity(true)}
        // layout={customLayout}
      >
        <BlurView style={StyleSheet.absoluteFill} intensity={40} tint="systemChromeMaterialDark" />

        <Animated.View style={animatedIconStyle}>
          <Icon icon="magnifyingglass" size={30} />
        </Animated.View>

        {isSearch && <TabBarSearchInput ref={ref} />}
      </AnimatedPressable>

      {isDismiss && (
        <Animated.View exiting={getFadeOut(springyTabBar)} entering={getFadeIn(springyTabBar)}>
          <Button
            size="lg"
            variant="icon"
            style={styles.cancelButton}
            onPress={() => {
              ref.current?.blur();
              setSearchValue("");
            }}
          >
            <BlurView style={StyleSheet.absoluteFill} intensity={40} tint="systemChromeMaterialDark" />
            <Icon icon="x" size={26} color={theme.colors.text} />
          </Button>
        </Animated.View>
      )}
    </>
  );
}
