import React, { useEffect, useRef } from "react";
import { Pressable, useWindowDimensions, TextInput } from "react-native";
import { styles } from "./TabBar.styles";
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { Button, Icon, Input } from "@components/ui";
import useTabBarStore from "@stores/tabBar";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { BlurView } from "expo-blur";
import { useReanimatedKeyboardAnimation } from "react-native-keyboard-controller";
import { getFadeIn, getFadeOut, springyTabBar } from "@constants/animations";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedInput = Animated.createAnimatedComponent(Input);

export default function TabBarSearchButton(): React.JSX.Element {
  const opacity = useSharedValue(1);
  const ref = useRef<TextInput>(null);
  const { isSearch, setIsSearch, searchValue, setSearchValue, setIsSearchFocused, isSearchFocused } =
    useTabBarStore();
  const { width } = useWindowDimensions();
  const { theme } = useUnistyles();
  const defaultRichWidth = useSharedValue(0);
  const { progress: keyboardProgress } = useReanimatedKeyboardAnimation();

  const searchReachWidth = width - 48 - theme.spacing.md;

  const animatedPressableStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      width: interpolate(keyboardProgress.value, [0, 1], [defaultRichWidth.value, searchReachWidth - theme.spacing.lg * 2]),
      height: withSpring(isSearch ? 48 : 54, springyTabBar),
    };
  });

  const animatedViewStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(isSearch ? 24 / 30 : 1, springyTabBar) }],
  }));

  const pressableOpacity = (out: boolean = false) => {
    opacity.value = withSpring(out ? 1 : 0.5, springyTabBar);
  };

  useEffect(() => {
    defaultRichWidth.value = withSpring(isSearch ? searchReachWidth - theme.spacing.xxxl * 2 : 54, springyTabBar);
  }, [isSearch]);

  return (
    <>
      <AnimatedPressable
        onPress={() => setIsSearch(!isSearch)}
        style={[styles.searchButton, animatedPressableStyle]}
        onTouchStart={() => pressableOpacity()}
        onTouchEnd={() => pressableOpacity(true)}
      >
        <BlurView style={StyleSheet.absoluteFill} intensity={40} tint='systemChromeMaterialDark' />
        <Animated.View style={animatedViewStyle}>
          <Icon icon='magnifyingglass' size={30} />
        </Animated.View>
        {isSearch && (
          <AnimatedInput
            value={searchValue}
            onChangeText={setSearchValue}
			ref={ref}
            style={styles.searchInput}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            placeholder='Поиск по чатам'
			submitBehavior="blurAndSubmit"
			returnKeyType="search"
            entering={getFadeIn(springyTabBar)}
            basic
          />
        )}
      </AnimatedPressable>
      {isSearchFocused && (
        <Animated.View exiting={getFadeOut(springyTabBar)} entering={getFadeIn(springyTabBar)}>
          <Button onPress={() => {ref.current?.blur(); setSearchValue("")}} size='lg' variant='icon' style={styles.cancelButton}>
            <BlurView style={StyleSheet.absoluteFill} intensity={40} tint='systemChromeMaterialDark' />
            <Icon icon='x' size={26} color={theme.colors.text} />
          </Button>
        </Animated.View>
      )}
    </>
  );
}
