import React, { useEffect, useRef, useState } from "react";
import { Pressable, useWindowDimensions, TextInput, ViewStyle } from "react-native";
import { styles } from "./TabBar.styles";
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { Button, Icon, Input } from "@components/ui";
import useTabBarStore from "@stores/tabBar";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { BlurView } from "expo-blur";
import { useReanimatedKeyboardAnimation } from "react-native-keyboard-controller";
import {
  getFadeIn,
  getFadeOut,
  makeLayoutAnimation,
  springyTabBar,
  quickSpring,
} from "@constants/animations";
import physicsSpring from "@lib/physicSpring";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedInput = Animated.createAnimatedComponent(Input);

const customLayout = makeLayoutAnimation(
  physicsSpring({ mass: quickSpring.mass, duration: 0.25, dampingRatio: 0.85 })
);

export default function TabBarSearchButton(): React.JSX.Element {
  const opacity = useSharedValue<number>(1);
  const ref = useRef<TextInput>(null);
  const { isSearch, setIsSearch, searchValue, setSearchValue, setIsSearchFocused, isSearchFocused } =
    useTabBarStore();
  const { width } = useWindowDimensions();
  const { theme } = useUnistyles();
  const [isLayoutAnimation, setIsLayoutAnimation] = useState<boolean>(false);
  const defaultRichWidth = useSharedValue<number>(0);
  const { progress: keyboardProgress } = useReanimatedKeyboardAnimation();

  const searchReachWidth = width - 48 - theme.spacing.md;
  let layoutTimer: ReturnType<typeof setTimeout>;
  const isDismiss = isSearchFocused || searchValue.trim().length > 0

  const animatedPressableStyle = useAnimatedStyle((): ViewStyle => {
    const defaultDismissRichWidth = isDismiss ? defaultRichWidth.value - 48 - theme.spacing.md : defaultRichWidth.value
    return {
      opacity: opacity.value,
      width: interpolate(
        keyboardProgress.value,
        [0, 1],
        [defaultDismissRichWidth, searchReachWidth - theme.spacing.lg * 2]
      ),
      height: withSpring(isSearch ? 48 : 54, springyTabBar),
    };
  });

  const animatedViewStyle = useAnimatedStyle(
    (): ViewStyle => ({
      transform: [{ scale: withSpring(isSearch ? 24 / 30 : 1, springyTabBar) }],
    })
  );

  const pressableOpacity = (out: boolean = false) => {
    opacity.value = withSpring(out ? 1 : 0.8, springyTabBar);
  };

  useEffect(() => {
    defaultRichWidth.value = withSpring(
      isSearch ? searchReachWidth - theme.spacing.xxxl * 2 : 54,
      springyTabBar
    );
    
    if (isSearch) {
      layoutTimer = setTimeout(() => {
        setIsLayoutAnimation(true);
      }, 300);
    } else {
      clearTimeout(layoutTimer);
      setIsLayoutAnimation(false);
    }
  }, [isSearch]);

  return (
    <>
      <AnimatedPressable
        onPress={() => setIsSearch(!isSearch)}
        style={[styles.searchButton, animatedPressableStyle]}
        layout={isLayoutAnimation ? customLayout : null}
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
            submitBehavior='blurAndSubmit'
            returnKeyType='search'
            entering={getFadeIn(springyTabBar)}
            basic
          />
        )}
      </AnimatedPressable>
      {isDismiss && (
        <Animated.View exiting={getFadeOut(springyTabBar)} entering={getFadeIn(springyTabBar)}>
          <Button
            onPress={() => {
              ref.current?.blur();
              setSearchValue("");
            }}
            size='lg'
            variant='icon'
            style={styles.cancelButton}
          >
            <BlurView style={StyleSheet.absoluteFill} intensity={40} tint='systemChromeMaterialDark' />
            <Icon icon='x' size={26} color={theme.colors.text} />
          </Button>
        </Animated.View>
      )}
    </>
  );
}
