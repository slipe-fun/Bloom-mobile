import React, { Ref } from "react";
import Animated from "react-native-reanimated";
import { Input } from "@components/ui";
import { getFadeIn } from "@constants/animations";
import { springyTabBar } from "@constants/animations";
import { styles } from "./ActionButton.styles";
import useTabBarStore from "@stores/tabBar";
import { TextInput } from "react-native";

const AnimatedInput = Animated.createAnimatedComponent(Input);

type TabBarSearchInputProps = {
    ref: Ref<TextInput>;
}

export default function TabBarSearchInput({ref, ...props}: TabBarSearchInputProps): React.JSX.Element {
  const { searchValue, setSearchValue, setIsSearchFocused } = useTabBarStore();

  return (
    <AnimatedInput
      ref={ref}
      value={searchValue}
      onChangeText={setSearchValue}
      style={styles.searchInput}
      onFocus={() => setIsSearchFocused(true)}
      onBlur={() => setIsSearchFocused(false)}
      placeholder="Поиск по чатам"
      submitBehavior="blurAndSubmit"
      returnKeyType="search"
      entering={getFadeIn(springyTabBar)}
      basic
      {...props}
    />
  );
};
