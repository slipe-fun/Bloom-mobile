import { styles } from "./Search.styles";
import Animated from "react-native-reanimated";
import { useUnistyles } from "react-native-unistyles";
import useUsersSearch from "@api/hooks/useUsersSearch";
import useTabBarStore from "@stores/tabBar";
import { getFadeIn, getFadeOut } from "@constants/animations";
import { LegendList } from "@legendapp/list"
import { useCallback } from "react";
import type { SearchUser } from "@interfaces";
import Chat from "../chat";

export default function Search() {
  const { theme } = useUnistyles();
  const { isSearch, searchValue } = useTabBarStore();

  const { users, loading, error, addPage } = useUsersSearch(searchValue);

  const keyExtractor = useCallback((item: SearchUser) => {
      return String(item.id);
    }, []);

    const renderItem = useCallback(
        ({ item }: { item: SearchUser }) => {
          return (
            <Chat
              isSearch
              chat={{recipient: item}}
            />
          );
        },
        []
      );

  return isSearch  ? (
    <Animated.View
    entering={getFadeIn()}
    exiting={getFadeOut()}
      style={[styles.container, { paddingTop: 32 }]}
    >
        <LegendList
          key="search"
          estimatedItemSize={7}
          onEndReached={() => addPage()}
          keyExtractor={keyExtractor}
          keyboardShouldPersistTaps="handled"
          data={users}
          renderItem={renderItem}
        />
    </Animated.View>
  ) : null;
}
