import { styles } from "./Search.styles";
import Animated, { useAnimatedScrollHandler, useSharedValue, withSpring } from "react-native-reanimated";
import useUsersSearch from "@api/hooks/useUsersSearch";
import useTabBarStore from "@stores/tabBar";
import { fastSpring, getFadeIn, getFadeOut } from "@constants/animations";
import { AnimatedLegendList } from "@legendapp/list/reanimated";
import { useCallback, useEffect, useState } from "react";
import type { SearchUser } from "@interfaces";
import Chat from "../chat";
import { useInsets } from "@hooks";
import SearchHeader from "./header";
import { EmptyModal } from "@components/ui";

export default function Search(): React.JSX.Element {
  const { isSearch, searchValue, tabBarHeight, isSearchFocused } = useTabBarStore();
  const insets = useInsets();
  const scrollY = useSharedValue<number>(0);
  const [headerHeight, setHeaderHeight] = useState<number>(0);
  const { users, loading, error, addPage } = useUsersSearch(searchValue);

  const isSearchValue = searchValue.trim().length > 0;
  const blockHandler = isSearchFocused || isSearchValue;

  const keyExtractor = useCallback((item: SearchUser) => {
    return String(item.id);
  }, []);

  const renderItem = useCallback(({ item }: { item: SearchUser }) => {
    return <Chat isSearch chat={{ recipient: item }} />;
  }, []);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = !blockHandler ? event.contentOffset.y : headerHeight;
    },
  });

  useEffect(() => {
    if (isSearchFocused) {
      scrollY.value = withSpring(headerHeight, fastSpring);
    } else if (isSearchValue) {
      scrollY.value = withSpring(headerHeight, fastSpring);
    } else {
      scrollY.value = withSpring(0, fastSpring);
    }
  }, [isSearchFocused]);

  return isSearch ? (
    <Animated.View entering={getFadeIn()} exiting={getFadeOut()} style={styles.container}>
      <SearchHeader scrollY={scrollY} setHeaderHeight={setHeaderHeight} />
       <AnimatedLegendList
        key='search'
        onScroll={scrollHandler}
        onEndReached={() => addPage()}
        keyExtractor={keyExtractor}
        style={styles.list}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps='handled'
        contentContainerStyle={{ paddingBottom: tabBarHeight, paddingTop: headerHeight }}
        scrollIndicatorInsets={{ top: headerHeight - insets.realTop, bottom: tabBarHeight - insets.realBottom }}
        data={users}
        renderItem={renderItem}
      />
      <EmptyModal text="В истории поиска пусто... Введите свой первый запрос!" icon="magnifyingglass" color="primary" visible={!isSearchValue}/>
    </Animated.View>
  ) : null;
}
