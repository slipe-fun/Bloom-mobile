import { styles } from "./Search.styles";
import Animated from "react-native-reanimated";
import { useUnistyles } from "react-native-unistyles";
import useUsersSearch from "@api/hooks/useUsersSearch";
import useTabBarStore from "@stores/tabBar";
import { getFadeIn, getFadeOut } from "@constants/animations";
import { LegendList } from "@legendapp/list";
import { useCallback } from "react";
import type { SearchUser } from "@interfaces";
import Chat from "../chat";
import { useInsets } from "@hooks";

export default function Search() {
  const { theme } = useUnistyles();
  const { isSearch, searchValue, tabBarHeight } = useTabBarStore();
  const insets = useInsets();

  const { users, loading, error, addPage } = useUsersSearch(searchValue);

  const keyExtractor = useCallback((item: SearchUser, index: Number) => {
    return String(item.id);
  }, []);

  const renderItem = useCallback(({ item }: { item: SearchUser }) => {
    return <Chat isSearch chat={{ recipient: item }} />;
  }, []);

  return isSearch ? (
    <Animated.View entering={getFadeIn()} exiting={getFadeOut()} style={styles.container}>
      <LegendList
        key='search'
        onEndReached={() => addPage()}
        keyExtractor={keyExtractor}
        style={styles.list}
        keyboardShouldPersistTaps='handled'
        scrollIndicatorInsets={{ top: 0, bottom: tabBarHeight - insets.realBottom }}
        data={users}
        renderItem={renderItem}
      />
    </Animated.View>
  ) : null;
}
